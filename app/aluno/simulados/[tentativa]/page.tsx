import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buscarQuestoesSimulado } from "@/lib/aluno/queries";
import { SimuladoRunner } from "@/components/aluno/simulado-runner";

export const metadata: Metadata = {
  title: "Simulado — 4K Vestibulares",
  description: "Prova em andamento.",
};

export default async function SimuladoTentativaPage({
  params,
}: {
  params: Promise<{ tentativa: string }>;
}) {
  const { tentativa } = await params;
  const questoes = await buscarQuestoesSimulado(tentativa);

  // Sem questões = prova finalizada ou tentativa inválida → resultado/espelho.
  if (questoes.length === 0) {
    redirect(`/aluno/simulados/${tentativa}/resultado`);
  }

  return (
    <SimuladoRunner tentativaId={tentativa} questoesIniciais={questoes} />
  );
}
