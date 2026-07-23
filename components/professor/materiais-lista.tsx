"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconFilePlus, IconPencil, IconTrash } from "@tabler/icons-react";
import { excluirMaterial } from "@/lib/professor/actions";
import { ROTULO_TIPO_MATERIAL } from "@/lib/professor/tipos";
import type { MaterialProfessor, OpcaoSelect, TipoMaterial } from "@/lib/professor/tipos";
import { ModalConfirmar } from "@/components/modal-confirmar";
import { MaterialFormModal } from "@/components/professor/material-form-modal";

type Props = {
  materiais: MaterialProfessor[];
  materias: OpcaoSelect[];
  turmas: OpcaoSelect[];
};

export function MateriaisLista({ materiais, materias, turmas }: Props) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<MaterialProfessor | null>(null);
  const [excluindo, setExcluindo] = useState<MaterialProfessor | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  function turmaNome(turmaId: string | null): string {
    if (!turmaId) return "Todas as turmas";
    return turmas.find((t) => t.id === turmaId)?.nome ?? "Turma removida";
  }

  function abrirNovo() {
    setEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(material: MaterialProfessor) {
    setEditando(material);
    setModalAberto(true);
  }

  function confirmarExclusao() {
    if (!excluindo) return;
    setErro(null);
    iniciar(async () => {
      const r = await excluirMaterial(excluindo.id);
      if ("erro" in r) {
        setErro(r.erro);
        setExcluindo(null);
        return;
      }
      setExcluindo(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="titulo-impacto text-2xl text-ink sm:text-3xl">MATERIAIS</h1>
        <button type="button" onClick={abrirNovo} className="btn btn-verde">
          <IconFilePlus className="size-5" stroke={1.75} />
          Novo material
        </button>
      </div>

      {erro && (
        <p className="caixa-revisar" role="alert">
          {erro}
        </p>
      )}

      {materiais.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
          Nenhum material cadastrado ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {materiais.map((material) => (
            <li
              key={material.id}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{material.titulo}</h3>
                    <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-roxo">
                      {material.publicado ? "Publicado" : "Rascunho"}
                    </span>
                    <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-roxo">
                      {ROTULO_TIPO_MATERIAL[material.tipo as TipoMaterial] ?? material.tipo}
                    </span>
                  </div>
                  {material.descricao && (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {material.descricao}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    {material.materia_nome} · {turmaNome(material.turma_id)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => abrirEdicao(material)}
                    className="btn btn-contorno"
                  >
                    <IconPencil className="size-4" stroke={1.75} />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setExcluindo(material)}
                    className="btn btn-contorno"
                  >
                    <IconTrash className="size-4" stroke={1.75} />
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <MaterialFormModal
        key={editando?.id ?? "novo"}
        aberto={modalAberto}
        material={editando ?? undefined}
        materias={materias}
        turmas={turmas}
        onFechar={() => setModalAberto(false)}
        onSucesso={() => {
          setModalAberto(false);
          router.refresh();
        }}
      />

      <ModalConfirmar
        aberto={excluindo !== null}
        titulo="Excluir material?"
        descricao={
          excluindo
            ? `"${excluindo.titulo}" será removido definitivamente para os alunos.`
            : ""
        }
        rotuloConfirmar="Excluir"
        rotuloCancelar="Cancelar"
        confirmando={pendente}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExcluindo(null)}
      />
    </div>
  );
}
