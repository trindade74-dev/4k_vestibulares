"use client";

import { useActionState, useEffect } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { atualizarMonitoria, criarMonitoria } from "@/lib/professor/actions";
import type {
  MonitoriaProfessor,
  OpcaoSelect,
  ResultadoAcao,
} from "@/lib/professor/tipos";
import { ModalFormulario } from "@/components/professor/modal-formulario";

/** Estado neutro: nem "ok" nem "erro" presentes, então nada dispara sozinho. */
const ESTADO_INICIAL = {} as ResultadoAcao;

/**
 * `data_hora` já vem do banco como horário de Brasília com offset fixo
 * (-03:00, ver `dataHoraBrasilia` em lib/professor/actions.ts). Formata pro
 * valor de um `<input type="datetime-local">` usando o relógio de
 * Brasília — não o fuso do navegador — pra não deslocar o horário exibido.
 */
function paraDatetimeLocalBrasilia(iso: string): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const obter = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? "00";
  return `${obter("year")}-${obter("month")}-${obter("day")}T${obter("hour")}:${obter("minute")}`;
}

type Props = {
  aberto: boolean;
  monitoria?: MonitoriaProfessor;
  materias: OpcaoSelect[];
  turmas: OpcaoSelect[];
  onFechar: () => void;
  onSucesso: () => void;
};

/**
 * Modal de criar/editar monitoria. `monitoria` presente = edição (usa
 * `.bind(null, monitoria.id)` na action de update); ausente = criação.
 */
export function MonitoriaFormModal({
  aberto,
  monitoria,
  materias,
  turmas,
  onFechar,
  onSucesso,
}: Props) {
  const editando = Boolean(monitoria);
  const acao = monitoria
    ? atualizarMonitoria.bind(null, monitoria.id)
    : criarMonitoria;
  const [estado, executar, enviando] = useActionState(acao, ESTADO_INICIAL);

  useEffect(() => {
    if ("ok" in estado && estado.ok) onSucesso();
  }, [estado, onSucesso]);

  return (
    <ModalFormulario
      aberto={aberto}
      titulo={editando ? "Editar monitoria" : "Nova monitoria"}
      onFechar={onFechar}
    >
      <form action={executar} className="space-y-4">
        <div>
          <label htmlFor="monitoria-materia" className="block text-sm font-medium text-ink">
            Matéria
          </label>
          <select
            id="monitoria-materia"
            name="materiaId"
            defaultValue={monitoria?.materia_id ?? ""}
            className="input-4k mt-1.5"
          >
            <option value="">Geral (todas as matérias)</option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="monitoria-turma" className="block text-sm font-medium text-ink">
            Turma
          </label>
          <select
            id="monitoria-turma"
            name="turmaId"
            defaultValue={monitoria?.turma_id ?? ""}
            className="input-4k mt-1.5"
          >
            <option value="">Todas as turmas</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="monitoria-titulo" className="block text-sm font-medium text-ink">
            Título
          </label>
          <input
            id="monitoria-titulo"
            name="titulo"
            type="text"
            defaultValue={monitoria?.titulo ?? ""}
            placeholder="Monitoria"
            className="input-4k mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="monitoria-descricao" className="block text-sm font-medium text-ink">
            Descrição
          </label>
          <textarea
            id="monitoria-descricao"
            name="descricao"
            rows={2}
            defaultValue={monitoria?.descricao ?? ""}
            className="input-4k mt-1.5 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="monitoria-data" className="block text-sm font-medium text-ink">
              Data e hora
            </label>
            <input
              id="monitoria-data"
              name="dataHora"
              type="datetime-local"
              required
              defaultValue={
                monitoria ? paraDatetimeLocalBrasilia(monitoria.data_hora) : ""
              }
              className="input-4k mt-1.5"
            />
          </div>
          <div>
            <label htmlFor="monitoria-duracao" className="block text-sm font-medium text-ink">
              Duração (min)
            </label>
            <input
              id="monitoria-duracao"
              name="duracaoMin"
              type="number"
              min={1}
              defaultValue={monitoria?.duracao_min ?? 50}
              className="input-4k mt-1.5"
            />
          </div>
          <div>
            <label htmlFor="monitoria-vagas" className="block text-sm font-medium text-ink">
              Vagas
            </label>
            <input
              id="monitoria-vagas"
              name="vagas"
              type="number"
              min={1}
              required
              defaultValue={monitoria?.vagas ?? 6}
              className="input-4k mt-1.5"
            />
          </div>
        </div>

        <div>
          <label htmlFor="monitoria-local" className="block text-sm font-medium text-ink">
            Local ou link
          </label>
          <input
            id="monitoria-local"
            name="localOuLink"
            type="text"
            defaultValue={monitoria?.local_ou_link ?? ""}
            placeholder="Sala 3 ou link da chamada"
            className="input-4k mt-1.5"
          />
        </div>

        {"erro" in estado && estado.erro && (
          <p className="caixa-revisar flex items-start gap-2" role="alert">
            <IconAlertTriangle className="mt-0.5 size-4 shrink-0" stroke={1.75} />
            {estado.erro}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <button type="button" onClick={onFechar} className="btn btn-contorno">
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className="btn btn-verde disabled:opacity-60">
            {enviando ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </form>
    </ModalFormulario>
  );
}
