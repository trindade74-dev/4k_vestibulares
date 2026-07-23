import type { Metadata } from "next";
import {
  buscarMateriaisProfessor,
  buscarMateriasParaSelect,
  buscarTurmasParaSelect,
} from "@/lib/professor/queries";
import { MateriaisLista } from "@/components/professor/materiais-lista";

export const metadata: Metadata = {
  title: "Materiais — Ambiente do professor — 4K Vestibulares",
  description: "Gerencie os materiais publicados para os alunos.",
};

export default async function MateriaisProfessorPage() {
  const [materiais, materias, turmas] = await Promise.all([
    buscarMateriaisProfessor(),
    buscarMateriasParaSelect(),
    buscarTurmasParaSelect(),
  ]);

  return (
    <main id="conteudo" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <MateriaisLista materiais={materiais} materias={materias} turmas={turmas} />
    </main>
  );
}
