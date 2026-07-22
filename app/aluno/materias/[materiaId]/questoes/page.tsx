import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buscarMateria, buscarQuestoesMateria } from "@/lib/aluno/queries";
import { QuizRunner } from "@/components/aluno/quiz-runner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ materiaId: string }>;
}): Promise<Metadata> {
  const { materiaId } = await params;
  const materia = await buscarMateria(materiaId);
  return {
    title: materia
      ? `Praticar ${materia.nome} — 4K Vestibulares`
      : "Praticar questões — 4K Vestibulares",
    description: "Questões desta matéria, com correção na hora.",
  };
}

export default async function QuestoesDaMateriaPage({
  params,
}: {
  params: Promise<{ materiaId: string }>;
}) {
  const { materiaId } = await params;
  const materia = await buscarMateria(materiaId);
  if (!materia) notFound();

  // Questões SEM gabarito (QuestaoSegura), escopadas à matéria do hub.
  const questoes = await buscarQuestoesMateria(materiaId, 5);

  return (
    <QuizRunner
      questoesIniciais={questoes}
      materiaId={materiaId}
      tituloCena={materia.nome}
    />
  );
}
