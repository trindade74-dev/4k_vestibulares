import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Destino dos links de e-mail do Supabase (templates customizados):
 * - Confirmar cadastro: /auth/confirm?token_hash=...&type=email
 * - Redefinir senha:    /auth/confirm?token_hash=...&type=recovery&next=/redefinir-senha
 *
 * verifyOtp cria a sessão; daí redirecionamos ao lugar certo.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      if (next) redirect(next);
      if (type === "recovery") redirect("/redefinir-senha");

      const { data: tipo } = await supabase.rpc("meu_tipo");
      redirect(tipo === "professor" ? "/professor" : "/aluno");
    }
  }

  redirect("/login?erro=link-invalido");
}
