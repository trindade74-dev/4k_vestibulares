import type { Metadata } from "next";
import { createElement } from "react";
import {
  IconAlertTriangle,
  IconChartRadar,
} from "@tabler/icons-react";
import { buscarDesempenho } from "@/lib/aluno/queries";
import { iconeDaMateria } from "@/lib/aluno/materia-icones";
import { Entrada } from "@/components/aluno/entrada";
import { RadarDesempenho } from "@/components/aluno/radar-desempenho";
import type { Desempenho } from "@/lib/aluno/tipos";

export const metadata: Metadata = {
  title: "Desempenho — 4K Vestibulares",
  description: "Seu percentual de acerto por matéria no radar e na lista.",
};

/** Limiar de atenção: matéria com base suficiente e acerto baixo. */
function precisaAtencao(m: Desempenho): boolean {
  return m.total >= 3 && m.percentual < 60;
}

export default async function DesempenhoPage() {
  const desempenho = await buscarDesempenho();
  const semDados = desempenho.every((m) => m.total === 0);

  return (
    <main id="conteudo" className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Entrada className="flex flex-col gap-6">
        <header data-entrada>
          <p className="text-sm font-medium text-muted">Plataforma 4K</p>
          <h1 className="titulo-impacto mt-1 text-3xl text-ink sm:text-4xl">
            Desempenho
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
            Seu percentual de acerto por matéria, somando quiz e simulados.
          </p>
        </header>

        {semDados ? (
          <VazioDesempenho />
        ) : (
          <>
            {/* Radar */}
            <section
              data-entrada
              aria-labelledby="titulo-radar"
              className="rounded-xl border border-border bg-surface p-5 sm:p-6"
            >
              <h2
                id="titulo-radar"
                className="flex items-center gap-2 text-lg font-semibold text-ink"
              >
                <IconChartRadar className="size-5 text-muted" stroke={1.75} />
                Radar por matéria
              </h2>
              <div className="mx-auto mt-4 aspect-square w-full max-w-[320px]">
                <RadarDesempenho valores={desempenho} />
              </div>
            </section>

            {/* Lista por matéria */}
            <section data-entrada aria-label="Detalhe por matéria">
              <h2 className="mb-3 text-lg font-semibold text-ink">
                Por matéria
              </h2>
              <ul className="flex flex-col gap-3">
                {desempenho.map((m) => (
                  <li key={m.materia_id}>
                    <LinhaMateria materia={m} />
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </Entrada>
    </main>
  );
}

function LinhaMateria({ materia }: { materia: Desempenho }) {
  const Icone = iconeDaMateria(materia.materia_nome);
  const pct = Math.round(materia.percentual);
  const atencao = precisaAtencao(materia);

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-roxo">
          {createElement(Icone, {
            className: "size-5 text-on-dark",
            stroke: 1.75,
          })}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-ink">
              {materia.materia_nome}
            </p>
            <p className="shrink-0 text-sm font-semibold text-ink">{pct}%</p>
          </div>
          <p className="text-xs text-muted">
            {materia.acertos}/{materia.total} questões
          </p>
        </div>
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-surface-alt">
        <div
          className="h-full rounded-full bg-verde"
          style={{ width: `${pct}%` }}
        />
      </div>

      {atencao && (
        <div className="mt-3 flex flex-col gap-2 rounded-lg border border-[var(--revisar-border)] bg-[var(--revisar-bg)] p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--revisar-text)]">
            <IconAlertTriangle className="size-4 shrink-0" stroke={1.75} />
            Precisa de atenção
          </p>
          {/* Monitoria entra na próxima fase — CTA desabilitado por ora. */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Em breve"
            className="cursor-not-allowed rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted opacity-70"
          >
            Marcar monitoria de {materia.materia_nome}{" "}
            <span className="text-[10px] uppercase">· em breve</span>
          </button>
        </div>
      )}
    </div>
  );
}

function VazioDesempenho() {
  return (
    <div
      data-entrada
      className="rounded-xl border border-border bg-surface p-10 text-center"
    >
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface-alt text-roxo">
        <IconChartRadar className="size-7" stroke={1.5} />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-ink">
        Ainda sem desempenho
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Responda quizzes e simulados para o radar começar a mostrar seus
        acertos por matéria.
      </p>
    </div>
  );
}
