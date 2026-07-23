"use client";

import { useActionState, useEffect } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { atualizarAviso, criarAviso } from "@/lib/professor/actions";
import type { AvisoProfessor, OpcaoSelect, ResultadoAcao } from "@/lib/professor/tipos";
import { ModalFormulario } from "@/components/professor/modal-formulario";

/** Estado neutro: nem "ok" nem "erro" presentes, então nada dispara sozinho. */
const ESTADO_INICIAL = {} as ResultadoAcao;

type Props = {
  aberto: boolean;
  aviso?: AvisoProfessor;
  turmas: OpcaoSelect[];
  onFechar: () => void;
  onSucesso: () => void;
};

/**
 * Modal de criar/editar aviso. `aviso` presente = edição (usa
 * `.bind(null, aviso.id)` na action de update); ausente = criação.
 */
export function AvisoFormModal({ aberto, aviso, turmas, onFechar, onSucesso }: Props) {
  const editando = Boolean(aviso);
  const acao = aviso ? atualizarAviso.bind(null, aviso.id) : criarAviso;
  const [estado, executar, enviando] = useActionState(acao, ESTADO_INICIAL);

  useEffect(() => {
    if ("ok" in estado && estado.ok) onSucesso();
  }, [estado, onSucesso]);

  return (
    <ModalFormulario
      aberto={aberto}
      titulo={editando ? "Editar aviso" : "Novo aviso"}
      onFechar={onFechar}
    >
      <form action={executar} className="space-y-4">
        <div>
          <label htmlFor="aviso-titulo" className="block text-sm font-medium text-ink">
            Título
          </label>
          <input
            id="aviso-titulo"
            name="titulo"
            type="text"
            required
            defaultValue={aviso?.titulo ?? ""}
            placeholder="Ex.: Simulado geral no sábado"
            className="input-4k mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="aviso-corpo" className="block text-sm font-medium text-ink">
            Mensagem
          </label>
          <textarea
            id="aviso-corpo"
            name="corpo"
            rows={4}
            required
            defaultValue={aviso?.corpo ?? ""}
            className="input-4k mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="aviso-turma" className="block text-sm font-medium text-ink">
            Turma
          </label>
          <select
            id="aviso-turma"
            name="turmaId"
            defaultValue={aviso?.turma_id ?? ""}
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

        <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="importante"
            defaultChecked={aviso?.importante ?? false}
            className="size-4.5 shrink-0 accent-[var(--roxo-4k)]"
          />
          Marcar como importante
        </label>

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
            {enviando ? "Publicando…" : "Publicar"}
          </button>
        </div>
      </form>
    </ModalFormulario>
  );
}
