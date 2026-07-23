import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavProfessor } from "@/components/professor/nav-professor";

/**
 * Shell do ambiente do professor + guard único (removido dos filhos).
 * Sem sessão → login. Aluno → seu próprio ambiente.
 */
export default async function ProfessorLayout({
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
  if (tipo !== "professor") redirect("/aluno");

  return (
    <div className="min-h-dvh bg-bg">
      <NavProfessor />
      {/* Reserva espaço p/ chrome fixo: barras no mobile, rail no desktop. */}
      <div className="pt-14 pb-24 md:pt-0 md:pb-0 md:pl-20">{children}</div>
    </div>
  );
}
