import type { Metadata } from "next";
import { buscarAvisosProfessor, buscarTurmasParaSelect } from "@/lib/professor/queries";
import { AvisosLista } from "@/components/professor/avisos-lista";

export const metadata: Metadata = {
  title: "Avisos — Ambiente do professor — 4K Vestibulares",
  description: "Publique comunicados para os alunos.",
};

export default async function AvisosProfessorPage() {
  const [avisos, turmas] = await Promise.all([
    buscarAvisosProfessor(),
    buscarTurmasParaSelect(),
  ]);

  return (
    <main id="conteudo" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <AvisosLista avisos={avisos} turmas={turmas} />
    </main>
  );
}
