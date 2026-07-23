"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconArchive, IconPencil, IconSpeakerphone } from "@tabler/icons-react";
import { arquivarAviso } from "@/lib/professor/actions";
import type { AvisoProfessor, OpcaoSelect } from "@/lib/professor/tipos";
import { ModalConfirmar } from "@/components/modal-confirmar";
import { AvisoFormModal } from "@/components/professor/aviso-form-modal";

const FORMATADOR_DATA = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

type Props = {
  avisos: AvisoProfessor[];
  turmas: OpcaoSelect[];
};

export function AvisosLista({ avisos, turmas }: Props) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<AvisoProfessor | null>(null);
  const [arquivando, setArquivando] = useState<AvisoProfessor | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  function turmaNome(turmaId: string | null): string {
    if (!turmaId) return "Todas as turmas";
    return turmas.find((t) => t.id === turmaId)?.nome ?? "Turma removida";
  }

  function abrirNovo() {
    setEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(aviso: AvisoProfessor) {
    setEditando(aviso);
    setModalAberto(true);
  }

  function confirmarArquivamento() {
    if (!arquivando) return;
    setErro(null);
    iniciar(async () => {
      const r = await arquivarAviso(arquivando.id);
      if ("erro" in r) {
        setErro(r.erro);
        setArquivando(null);
        return;
      }
      setArquivando(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="titulo-impacto text-2xl text-ink sm:text-3xl">AVISOS</h1>
        <button type="button" onClick={abrirNovo} className="btn btn-verde">
          <IconSpeakerphone className="size-5" stroke={1.75} />
          Novo aviso
        </button>
      </div>

      {erro && (
        <p className="caixa-revisar" role="alert">
          {erro}
        </p>
      )}

      {avisos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
          Nenhum aviso publicado ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {avisos.map((aviso) => (
            <li key={aviso.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{aviso.titulo}</h3>
                    {aviso.importante && (
                      <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-roxo">
                        Importante
                      </span>
                    )}
                    {!aviso.ativo && (
                      <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-roxo">
                        Arquivado
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{aviso.corpo}</p>
                  <p className="mt-2 text-xs text-muted">
                    {FORMATADOR_DATA.format(new Date(aviso.publicado_em))} · {turmaNome(aviso.turma_id)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => abrirEdicao(aviso)}
                    className="btn btn-contorno"
                  >
                    <IconPencil className="size-4" stroke={1.75} />
                    Editar
                  </button>
                  {aviso.ativo && (
                    <button
                      type="button"
                      onClick={() => setArquivando(aviso)}
                      className="btn btn-contorno"
                    >
                      <IconArchive className="size-4" stroke={1.75} />
                      Arquivar
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AvisoFormModal
        key={editando?.id ?? "novo"}
        aberto={modalAberto}
        aviso={editando ?? undefined}
        turmas={turmas}
        onFechar={() => setModalAberto(false)}
        onSucesso={() => {
          setModalAberto(false);
          router.refresh();
        }}
      />

      <ModalConfirmar
        aberto={arquivando !== null}
        titulo="Arquivar aviso?"
        descricao={
          arquivando
            ? `"${arquivando.titulo}" deixa de aparecer para os alunos, mas o histórico é preservado.`
            : ""
        }
        rotuloConfirmar="Arquivar"
        rotuloCancelar="Cancelar"
        confirmando={pendente}
        onConfirmar={confirmarArquivamento}
        onCancelar={() => setArquivando(null)}
      />
    </div>
  );
}
