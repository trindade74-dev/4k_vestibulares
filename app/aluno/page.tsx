import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sair } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "Ambiente do aluno — 4K Vestibulares",
  description: "Seu ambiente de estudos na Plataforma 4K.",
};

/** Saudação pela hora de Brasília (renderiza no servidor). */
function saudacaoBrasilia() {
  const hora = Number(
    new Intl.DateTimeFormat("pt-BR", {
      hour: "numeric",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    }).format(new Date()),
  );
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function AlunoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Cross-check de tipo: professor não fica no ambiente do aluno.
  const { data: tipo } = await supabase.rpc("meu_tipo");
  if (tipo === "professor") redirect("/professor");

  const { data: perfil } = await supabase
    .from("usuarios")
    .select("nome")
    .eq("id", user.id)
    .single();

  const primeiroNome = (perfil?.nome ?? "estudante").trim().split(/\s+/)[0];

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-medium text-muted">Plataforma 4K</p>
        <h1 className="titulo-impacto mt-3 text-4xl text-ink sm:text-5xl">
          {saudacaoBrasilia()}, <span className="text-roxo">{primeiroNome}</span>
        </h1>
        <p className="mt-5 inline-block rounded-xl border border-[var(--revisar-border)] bg-[var(--revisar-bg)] px-4 py-1.5 text-sm font-medium text-[var(--revisar-text)]">
          Ambiente do aluno em construção · Fase 3
        </p>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted">
          Quiz diário, simulados e seu radar de desempenho chegam aqui em breve.
        </p>
        <form action={sair} className="mt-8">
          <button type="submit" className="btn btn-contorno">
            Sair
          </button>
        </form>
      </div>
    </main>
  );
}
