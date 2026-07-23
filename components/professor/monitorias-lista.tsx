"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  IconCalendarEvent,
  IconCalendarPlus,
  IconChevronDown,
  IconChevronUp,
  IconClock,
  IconMapPin,
  IconPencil,
  IconUsers,
} from "@tabler/icons-react";
import { cancelarMonitoria } from "@/lib/professor/actions";
import type {
  MonitoriaProfessor,
  OpcaoSelect,
  ReservaMonitoria,
} from "@/lib/professor/tipos";
import { ModalConfirmar } from "@/components/modal-confirmar";
import { MonitoriaFormModal } from "@/components/professor/monitoria-form-modal";

const FORMATADOR_DATA = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

function formatarDataHora(dataHora: string): string {
  const texto = FORMATADOR_DATA.format(new Date(dataHora));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

type Props = {
  monitorias: MonitoriaProfessor[];
  materias: OpcaoSelect[];
  turmas: OpcaoSelect[];
  /** Server Action (definida em app/professor/monitorias/page.tsx) que busca as reservas sob demanda. */
  carregarReservas: (monitoriaId: string) => Promise<ReservaMonitoria[]>;
};

export function MonitoriasLista({ monitorias, materias, turmas, carregarReservas }: Props) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<MonitoriaProfessor | null>(null);
  const [cancelando, setCancelando] = useState<MonitoriaProfessor | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  function turmaNome(turmaId: string | null): string {
    if (!turmaId) return "Todas as turmas";
    return turmas.find((t) => t.id === turmaId)?.nome ?? "Turma removida";
  }

  function abrirNova() {
    setEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(monitoria: MonitoriaProfessor) {
    setEditando(monitoria);
    setModalAberto(true);
  }

  function confirmarCancelamento() {
    if (!cancelando) return;
    setErro(null);
    iniciar(async () => {
      const r = await cancelarMonitoria(cancelando.id);
      if ("erro" in r) {
        setErro(r.erro);
        setCancelando(null);
        return;
      }
      setCancelando(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="titulo-impacto text-2xl text-ink sm:text-3xl">MONITORIAS</h1>
        <button type="button" onClick={abrirNova} className="btn btn-verde">
          <IconCalendarPlus className="size-5" stroke={1.75} />
          Nova monitoria
        </button>
      </div>

      {erro && (
        <p className="caixa-revisar" role="alert">
          {erro}
        </p>
      )}

      {monitorias.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
          Nenhuma monitoria cadastrada ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {monitorias.map((monitoria) => (
            <MonitoriaItem
              key={monitoria.id}
              monitoria={monitoria}
              turmaNome={turmaNome(monitoria.turma_id)}
              carregarReservas={carregarReservas}
              onEditar={() => abrirEdicao(monitoria)}
              onCancelar={() => setCancelando(monitoria)}
            />
          ))}
        </ul>
      )}

      <MonitoriaFormModal
        key={editando?.id ?? "nova"}
        aberto={modalAberto}
        monitoria={editando ?? undefined}
        materias={materias}
        turmas={turmas}
        onFechar={() => setModalAberto(false)}
        onSucesso={() => {
          setModalAberto(false);
          router.refresh();
        }}
      />

      <ModalConfirmar
        aberto={cancelando !== null}
        titulo="Cancelar monitoria?"
        descricao={
          cancelando
            ? `"${cancelando.titulo}" será marcada como cancelada. Quem já reservou vaga será avisado por aqui.`
            : ""
        }
        rotuloConfirmar="Cancelar monitoria"
        rotuloCancelar="Manter monitoria"
        confirmando={pendente}
        onConfirmar={confirmarCancelamento}
        onCancelar={() => setCancelando(null)}
      />
    </div>
  );
}

function MonitoriaItem({
  monitoria,
  turmaNome,
  carregarReservas,
  onEditar,
  onCancelar,
}: {
  monitoria: MonitoriaProfessor;
  turmaNome: string;
  carregarReservas: (monitoriaId: string) => Promise<ReservaMonitoria[]>;
  onEditar: () => void;
  onCancelar: () => void;
}) {
  const [aberto, setAberto] = useState(false);
  const [carregando, iniciar] = useTransition();
  const [reservas, setReservas] = useState<ReservaMonitoria[] | null>(null);
  const aberta = monitoria.status === "aberta";

  function alternarInscritos() {
    const vaiAbrir = !aberto;
    setAberto(vaiAbrir);
    if (vaiAbrir && reservas === null) {
      iniciar(async () => {
        const r = await carregarReservas(monitoria.id);
        setReservas(r);
      });
    }
  }

  return (
    <li className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-ink">{monitoria.titulo}</h3>
            <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-roxo">
              {aberta ? "Aberta" : "Cancelada"}
            </span>
          </div>
          {monitoria.descricao && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{monitoria.descricao}</p>
          )}
          <dl className="mt-2.5 flex flex-col gap-1.5 text-sm text-muted">
            <div className="flex items-center gap-2">
              <IconCalendarEvent className="size-4 shrink-0" stroke={1.75} />
              <span>{formatarDataHora(monitoria.data_hora)}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconClock className="size-4 shrink-0" stroke={1.75} />
              <span>{monitoria.duracao_min} min</span>
            </div>
            {monitoria.local_ou_link && (
              <div className="flex items-center gap-2">
                <IconMapPin className="size-4 shrink-0" stroke={1.75} />
                <span>{monitoria.local_ou_link}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <IconUsers className="size-4 shrink-0" stroke={1.75} />
              <span>
                {monitoria.vagas} vagas · {monitoria.materia_nome ?? "Geral"} · {turmaNome}
              </span>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" onClick={onEditar} className="btn btn-contorno">
            <IconPencil className="size-4" stroke={1.75} />
            Editar
          </button>
          {aberta && (
            <button type="button" onClick={onCancelar} className="btn btn-contorno">
              Cancelar
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={alternarInscritos}
        aria-expanded={aberto}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-roxo hover:underline"
      >
        Ver inscritos
        {aberto ? (
          <IconChevronUp className="size-4" stroke={1.75} />
        ) : (
          <IconChevronDown className="size-4" stroke={1.75} />
        )}
      </button>

      {aberto && (
        <div className="mt-3 rounded-xl border border-border bg-surface-alt p-4">
          {carregando ? (
            <p className="text-sm text-muted">Carregando…</p>
          ) : !reservas || reservas.length === 0 ? (
            <p className="text-sm text-muted">Ninguém reservou vaga ainda.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {reservas.map((reserva) => (
                <li
                  key={reserva.reserva_id}
                  className="flex items-center justify-between gap-3 text-sm text-ink"
                >
                  <span className="truncate">{reserva.aluno_nome}</span>
                  <span className="shrink-0 text-xs text-muted">
                    {reserva.status === "confirmada" ? "Confirmada" : reserva.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}
