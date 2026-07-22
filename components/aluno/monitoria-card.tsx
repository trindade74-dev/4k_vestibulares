"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconClock,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";
import { cancelarReserva, reservarMonitoria } from "@/lib/aluno/actions";
import { ModalConfirmar } from "@/components/aluno/modal-confirmar";
import type { MinhaMonitoria, MonitoriaDisponivel } from "@/lib/aluno/tipos";

const FORMATADOR_DATA = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

/** Data/hora por extenso no fuso de Brasília, com a primeira letra maiúscula. */
function formatarDataHora(dataHora: string): string {
  const texto = FORMATADOR_DATA.format(new Date(dataHora));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Card de uma monitoria aberta para reserva. "Reservar" é a única ação
 * verde da tela (DESIGN.md: verde só em ação/acerto); cancelar é
 * contorno, com confirmação via modal antes de chamar o servidor.
 */
export function MonitoriaCard({
  monitoria,
}: {
  monitoria: MonitoriaDisponivel;
}) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const reservada = monitoria.minha_reserva_status === "confirmada";
  const lotada = monitoria.vagas_restantes <= 0;

  function reservar() {
    if (pendente) return;
    setErro(null);
    iniciar(async () => {
      const r = await reservarMonitoria(monitoria.id);
      if ("erro" in r) {
        setErro(r.erro);
        return;
      }
      router.refresh();
    });
  }

  function cancelar() {
    if (pendente || !monitoria.minha_reserva_id) return;
    setErro(null);
    iniciar(async () => {
      const r = await cancelarReserva(monitoria.minha_reserva_id);
      setModalAberto(false);
      if ("erro" in r) {
        setErro(r.erro);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-ink">{monitoria.titulo}</h3>
          {monitoria.descricao && (
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {monitoria.descricao}
            </p>
          )}
        </div>
        {reservada && (
          <span className="shrink-0 rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-roxo">
            Reservada
          </span>
        )}
      </div>

      <DetalhesMonitoria
        dataHora={monitoria.data_hora}
        duracaoMin={monitoria.duracao_min}
        localOuLink={monitoria.local_ou_link}
        vagasTexto={
          lotada
            ? "Lotada"
            : `${monitoria.vagas_ocupadas} de ${monitoria.vagas} vagas`
        }
      />

      <div className="mt-4">
        {reservada ? (
          <button
            type="button"
            onClick={() => setModalAberto(true)}
            disabled={pendente}
            className="btn btn-contorno disabled:opacity-60"
          >
            Cancelar reserva
          </button>
        ) : lotada ? (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="btn btn-contorno cursor-not-allowed opacity-60"
          >
            Lotada
          </button>
        ) : (
          <button
            type="button"
            onClick={reservar}
            disabled={pendente}
            className="btn btn-verde disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pendente ? "Reservando…" : "Reservar"}
          </button>
        )}
      </div>

      {erro && (
        <p className="caixa-revisar mt-3 flex items-start gap-2" role="alert">
          <IconAlertTriangle className="mt-0.5 size-4 shrink-0" stroke={1.75} />
          {erro}
        </p>
      )}

      <ModalConfirmar
        aberto={modalAberto}
        titulo="Cancelar reserva?"
        descricao={`Você vai perder sua vaga em "${monitoria.titulo}".`}
        rotuloConfirmar="Cancelar reserva"
        rotuloCancelar="Manter reserva"
        confirmando={pendente}
        onConfirmar={cancelar}
        onCancelar={() => setModalAberto(false)}
      />
    </div>
  );
}

/**
 * Card de uma reserva confirmada do aluno (seção "Suas monitorias
 * marcadas"). Sem contagem de vagas — só o compromisso e a ação de
 * cancelar.
 */
export function MinhaMonitoriaCard({ reserva }: { reserva: MinhaMonitoria }) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  function cancelar() {
    if (pendente) return;
    setErro(null);
    iniciar(async () => {
      const r = await cancelarReserva(reserva.reserva_id);
      setModalAberto(false);
      if ("erro" in r) {
        setErro(r.erro);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-ink">{reserva.titulo}</h3>
          {reserva.descricao && (
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {reserva.descricao}
            </p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-roxo">
          Reservada
        </span>
      </div>

      <DetalhesMonitoria
        dataHora={reserva.data_hora}
        duracaoMin={reserva.duracao_min}
        localOuLink={reserva.local_ou_link}
      />

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          disabled={pendente}
          className="btn btn-contorno disabled:opacity-60"
        >
          Cancelar reserva
        </button>
      </div>

      {erro && (
        <p className="caixa-revisar mt-3 flex items-start gap-2" role="alert">
          <IconAlertTriangle className="mt-0.5 size-4 shrink-0" stroke={1.75} />
          {erro}
        </p>
      )}

      <ModalConfirmar
        aberto={modalAberto}
        titulo="Cancelar reserva?"
        descricao={`Você vai perder sua vaga em "${reserva.titulo}".`}
        rotuloConfirmar="Cancelar reserva"
        rotuloCancelar="Manter reserva"
        confirmando={pendente}
        onConfirmar={cancelar}
        onCancelar={() => setModalAberto(false)}
      />
    </div>
  );
}

function DetalhesMonitoria({
  dataHora,
  duracaoMin,
  localOuLink,
  vagasTexto,
}: {
  dataHora: string;
  duracaoMin: number;
  localOuLink: string;
  vagasTexto?: string;
}) {
  return (
    <dl className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
      <div className="flex items-center gap-2">
        <IconCalendarEvent className="size-4 shrink-0" stroke={1.75} />
        <span>{formatarDataHora(dataHora)}</span>
      </div>
      <div className="flex items-center gap-2">
        <IconClock className="size-4 shrink-0" stroke={1.75} />
        <span>{duracaoMin} min</span>
      </div>
      <div className="flex items-center gap-2">
        <IconMapPin className="size-4 shrink-0" stroke={1.75} />
        <span>{localOuLink}</span>
      </div>
      {vagasTexto && (
        <div className="flex items-center gap-2">
          <IconUsers className="size-4 shrink-0" stroke={1.75} />
          <span>{vagasTexto}</span>
        </div>
      )}
    </dl>
  );
}
