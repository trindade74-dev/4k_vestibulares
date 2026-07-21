import type { Metadata } from "next";
import { buscarQuestoes } from "@/lib/aluno/queries";
import { QuizRunner } from "@/components/aluno/quiz-runner";

export const metadata: Metadata = {
  title: "Quiz do dia — 4K Vestibulares",
  description: "Responda o quiz diário e acompanhe seu desempenho.",
};

export default async function QuizPage() {
  // Questões SEM gabarito (QuestaoSegura). O gabarito só chega via a server
  // action `responder`, depois que o aluno escolhe — nunca no payload inicial.
  const questoes = await buscarQuestoes(false, 5);
  return <QuizRunner questoesIniciais={questoes} />;
}
