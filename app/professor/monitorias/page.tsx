import type { Metadata } from "next";
import {
  buscarMateriasParaSelect,
  buscarMonitoriasProfessor,
  buscarReservasDaMonitoria,
  buscarTurmasParaSelect,
} from "@/lib/professor/queries";
import { MonitoriasLista } from "@/components/professor/monitorias-lista";

export const metadata: Metadata = {
  title: "Monitorias — Ambiente do professor — 4K Vestibulares",
  description: "Abra horários de monitoria e veja quem reservou vaga.",
};

export default async function MonitoriasProfessorPage() {
  const [monitorias, materias, turmas] = await Promise.all([
    buscarMonitoriasProfessor(),
    buscarMateriasParaSelect(),
    buscarTurmasParaSelect(),
  ]);

  /**
   * Server Action inline: só expõe `buscarReservasDaMonitoria` (já pronta
   * em lib/professor/queries.ts) pro cliente poder chamá-la sob demanda no
   * botão "Ver inscritos" — módulo "server-only" não pode ser importado
   * direto num Client Component.
   */
  async function carregarReservas(monitoriaId: string) {
    "use server";
    return buscarReservasDaMonitoria(monitoriaId);
  }

  return (
    <main id="conteudo" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <MonitoriasLista
        monitorias={monitorias}
        materias={materias}
        turmas={turmas}
        carregarReservas={carregarReservas}
      />
    </main>
  );
}
