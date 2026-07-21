import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavAluno } from "@/components/aluno/nav-aluno";

/**
 * Shell do ambiente do aluno + guard único (removido dos filhos).
 * Sem sessão → login. Professor → seu próprio ambiente.
 */
export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tipo } = await supabase.rpc("meu_tipo");
  if (tipo === "professor") redirect("/professor");

  return (
    <div className="min-h-dvh bg-bg">
      <NavAluno />
      {/* Reserva espaço p/ chrome fixo: barras no mobile, rail no desktop. */}
      <div className="pt-14 pb-24 md:pt-0 md:pb-0 md:pl-20">{children}</div>
    </div>
  );
}
