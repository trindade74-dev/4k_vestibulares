import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft, IconCalendarEvent } from "@tabler/icons-react";
import {
  buscarMateria,
  buscarMinhasMonitorias,
  buscarMonitoriasDaMateria,
} from "@/lib/aluno/queries";
import { Entrada } from "@/components/aluno/entrada";
import { MinhaMonitoriaCard, MonitoriaCard } from "@/components/aluno/monitoria-card";
import type { MinhaMonitoria } from "@/lib/aluno/tipos";

type Params = { materiaId: string };

/** Reservas confirmadas cuja monitoria ainda não aconteceu. */
function monitoriasFuturasConfirmadas(minhas: MinhaMonitoria[]): MinhaMonitoria[] {
  const agora = Date.now();
  return minhas.filter(
    (m) => m.reserva_status === "confirmada" && new Date(m.data_hora).getTime() >= agora,
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { materiaId } = await params;
  const materia = await buscarMateria(materiaId);
  return {
    title: materia
      ? `Monitoria de ${materia.nome} — 4K Vestibulares`
      : "Monitoria — 4K Vestibulares",
    description: "Veja horários disponíveis e reserve sua vaga na monitoria.",
  };
}

export default async function MonitoriaDaMateriaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { materiaId } = await params;
  const materia = await buscarMateria(materiaId);
  if (!materia) notFound();

  const [disponiveis, minhas] = await Promise.all([
    buscarMonitoriasDaMateria(materiaId),
    buscarMinhasMonitorias(materiaId),
  ]);

  const marcadas = monitoriasFuturasConfirmadas(minhas);

  return (
    <main id="conteudo" className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Entrada className="flex flex-col gap-6">
        <div data-entrada>
          <Link
            href={`/aluno/materias/${materiaId}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <IconArrowLeft className="size-4" stroke={1.75} />
            Voltar a {materia.nome}
          </Link>
        </div>

        <header data-entrada>
          <p className="text-sm font-medium text-muted">{materia.nome}</p>
          <h1 className="titulo-impacto mt-1 text-3xl text-ink sm:text-4xl">
            Monitoria
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
            Reserve sua vaga nos horários disponíveis com o monitor da
            matéria.
          </p>
        </header>

        {marcadas.length > 0 && (
          <section aria-label="Suas monitorias marcadas" data-entrada>
            <h2 className="mb-3 text-lg font-semibold text-ink">
              Suas monitorias marcadas
            </h2>
            <ul className="flex flex-col gap-3">
              {marcadas.map((m) => (
                <li key={m.reserva_id}>
                  <MinhaMonitoriaCard reserva={m} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-label="Monitorias disponíveis" data-entrada>
          <h2 className="mb-3 text-lg font-semibold text-ink">
            Horários disponíveis
          </h2>
          {disponiveis.length === 0 ? (
            <VazioMonitoria materiaNome={materia.nome} />
          ) : (
            <ul className="flex flex-col gap-3">
              {disponiveis.map((m) => (
                <li key={m.id}>
                  <MonitoriaCard monitoria={m} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </Entrada>
    </main>
  );
}

function VazioMonitoria({ materiaNome }: { materiaNome: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-10 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface-alt text-roxo">
        <IconCalendarEvent className="size-7" stroke={1.5} />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-ink">
        Nenhuma monitoria de {materiaNome} aberta agora
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Quando um horário for aberto, ele aparece aqui para você reservar.
      </p>
    </div>
  );
}
