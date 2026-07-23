"use client";

import { useActionState, useEffect, useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { atualizarMaterial, criarMaterial } from "@/lib/professor/actions";
import { ROTULO_TIPO_MATERIAL } from "@/lib/professor/tipos";
import type {
  MaterialProfessor,
  OpcaoSelect,
  ResultadoAcao,
  TipoMaterial,
} from "@/lib/professor/tipos";
import { ModalFormulario } from "@/components/professor/modal-formulario";

/** Estado neutro: nem "ok" nem "erro" presentes, então nada dispara sozinho. */
const ESTADO_INICIAL = {} as ResultadoAcao;

type Props = {
  aberto: boolean;
  material?: MaterialProfessor;
  materias: OpcaoSelect[];
  turmas: OpcaoSelect[];
  onFechar: () => void;
  onSucesso: () => void;
};

/**
 * Modal de criar/editar material. `material` presente = edição (usa
 * `.bind(null, material.id)` na action de update); ausente = criação.
 */
export function MaterialFormModal({
  aberto,
  material,
  materias,
  turmas,
  onFechar,
  onSucesso,
}: Props) {
  const editando = Boolean(material);
  const acao = material ? atualizarMaterial.bind(null, material.id) : criarMaterial;
  const [estado, executar, enviando] = useActionState(acao, ESTADO_INICIAL);
  const [tipo, setTipo] = useState<TipoMaterial>(
    (material?.tipo as TipoMaterial) ?? "link",
  );
  const [publicado, setPublicado] = useState(material?.publicado ?? false);

  useEffect(() => {
    if ("ok" in estado && estado.ok) onSucesso();
  }, [estado, onSucesso]);

  return (
    <ModalFormulario
      aberto={aberto}
      titulo={editando ? "Editar material" : "Novo material"}
      onFechar={onFechar}
    >
      <form action={executar} className="space-y-4">
        <div>
          <label htmlFor="material-materia" className="block text-sm font-medium text-ink">
            Matéria
          </label>
          <select
            id="material-materia"
            name="materiaId"
            required
            defaultValue={material?.materia_id ?? ""}
            className="input-4k mt-1.5"
          >
            <option value="" disabled>
              Selecione
            </option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="material-turma" className="block text-sm font-medium text-ink">
            Turma
          </label>
          <select
            id="material-turma"
            name="turmaId"
            defaultValue={material?.turma_id ?? ""}
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
          <label htmlFor="material-titulo" className="block text-sm font-medium text-ink">
            Título
          </label>
          <input
            id="material-titulo"
            name="titulo"
            type="text"
            required
            defaultValue={material?.titulo ?? ""}
            placeholder="Ex.: Lista de exercícios — Funções"
            className="input-4k mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="material-descricao" className="block text-sm font-medium text-ink">
            Descrição
          </label>
          <textarea
            id="material-descricao"
            name="descricao"
            rows={2}
            defaultValue={material?.descricao ?? ""}
            className="input-4k mt-1.5 resize-none"
          />
        </div>

        <div>
          <label htmlFor="material-tipo" className="block text-sm font-medium text-ink">
            Tipo
          </label>
          <select
            id="material-tipo"
            name="tipo"
            required
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoMaterial)}
            className="input-4k mt-1.5"
          >
            {Object.entries(ROTULO_TIPO_MATERIAL).map(([valor, rotulo]) => (
              <option key={valor} value={valor}>
                {rotulo}
              </option>
            ))}
          </select>
        </div>

        {tipo === "texto" ? (
          <div>
            <label htmlFor="material-corpo" className="block text-sm font-medium text-ink">
              Texto
            </label>
            <textarea
              id="material-corpo"
              name="corpo"
              rows={5}
              defaultValue={material?.corpo ?? ""}
              className="input-4k mt-1.5"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="material-url" className="block text-sm font-medium text-ink">
              Link
            </label>
            <input
              id="material-url"
              name="url"
              type="text"
              defaultValue={material?.url ?? ""}
              placeholder="https://…"
              className="input-4k mt-1.5"
            />
          </div>
        )}

        <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="publicado"
            defaultChecked={material?.publicado ?? false}
            onChange={(e) => setPublicado(e.target.checked)}
            className="size-4.5 shrink-0 accent-[var(--roxo-4k)]"
          />
          Publicar para os alunos
        </label>
        {publicado && (
          <p className="text-xs leading-relaxed text-muted">
            Um aviso será enviado automaticamente aos alunos quando o material for publicado.
          </p>
        )}

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
