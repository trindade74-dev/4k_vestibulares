import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/** Rotas que exigem sessão ativa. */
const ROTAS_PROTEGIDAS = ["/aluno", "/professor", "/redefinir-senha"];

/**
 * Proteção de rotas (convenção proxy do Next 16):
 * - refresca a sessão Supabase em toda request coberta pelo matcher;
 * - sem sessão em rota protegida → /login;
 * - com sessão em /login → ambiente do tipo do usuário (meu_tipo()).
 *
 * O cross-check de tipo (aluno abrindo /professor) fica nas páginas,
 * para não pagar um RPC em toda request.
 */
export async function proxy(request: NextRequest) {
  const { user, supabase, response } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const redirecionar = (destino: string) => {
    const url = request.nextUrl.clone();
    url.pathname = destino;
    url.search = "";
    const redirect = NextResponse.redirect(url);
    // Preserva os cookies de sessão gravados pelo updateSession.
    response.cookies.getAll().forEach(({ name, value, ...options }) => {
      redirect.cookies.set(name, value, options);
    });
    return redirect;
  };

  const protegida = ROTAS_PROTEGIDAS.some(
    (rota) => pathname === rota || pathname.startsWith(`${rota}/`),
  );

  if (!user && protegida) {
    return redirecionar("/login");
  }

  if (user && pathname === "/login") {
    const { data: tipo } = await supabase.rpc("meu_tipo");
    return redirecionar(tipo === "professor" ? "/professor" : "/aluno");
  }

  return response;
}

export const config = {
  matcher: ["/login", "/aluno/:path*", "/professor/:path*", "/redefinir-senha"],
};
