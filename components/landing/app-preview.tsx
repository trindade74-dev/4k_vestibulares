import {
  IconAtom,
  IconChartRadar,
  IconFlame,
  IconHome,
  IconMathFunction,
  IconPencil,
  IconTargetArrow,
} from "@tabler/icons-react";
import { RadarDesempenho } from "@/components/landing/radar-desempenho";

const MATERIAS = [
  { icone: IconMathFunction, nome: "Matemática", acerto: 72 },
  { icone: IconPencil, nome: "Redação", acerto: 88 },
  { icone: IconAtom, nome: "Física", acerto: 54 },
];

/* Semana do streak: 5 dias cumpridos (verde = acerto), hoje (roxo), 1 futuro */
const DIAS = ["S", "T", "Q", "Q", "S", "S", "D"];

/**
 * Mock estático da futura plataforma do aluno, construído 100% com os
 * tokens do DESIGN.md. Decorativo no contexto da landing (aria-hidden),
 * com descrição textual para leitores de tela.
 */
export function AppPreview() {
  return (
    <div className="relative">
      <p className="sr-only">
        Prévia da plataforma do aluno 4K: painel com saudação, sequência de
        estudos de 7 dias, desempenho por matéria e gráfico radar.
      </p>

      <div
        aria-hidden
        className="app-preview-frame overflow-hidden border border-b-0 border-border bg-surface"
      >
        {/* Barra de navegador */}
        <div className="flex items-center gap-3 border-b border-border bg-surface-alt px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </span>
          <span className="mx-auto w-full max-w-xs truncate rounded-full bg-bg px-3.5 py-1 text-center text-[11px] text-muted sm:max-w-sm">
            plataforma.4kvestibulares.com.br
          </span>
          <span className="hidden w-9 sm:block" />
        </div>

        {/* Corpo do app */}
        <div className="grid grid-cols-[44px_1fr] sm:grid-cols-[56px_1fr]">
          {/* Sidebar fina */}
          <aside className="flex flex-col items-center gap-1.5 border-r border-border py-4">
            <span className="mb-2 flex size-8 items-center justify-center rounded-xl bg-roxo text-[11px] font-bold text-on-dark">
              4K
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-surface-alt text-roxo">
              <IconHome className="size-4" stroke={1.75} />
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl text-muted">
              <IconTargetArrow className="size-4" stroke={1.75} />
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl text-muted">
              <IconChartRadar className="size-4" stroke={1.75} />
            </span>
          </aside>

          {/* Painel principal */}
          <div className="p-4 sm:p-6">
            <p className="text-lg font-bold text-ink sm:text-xl">
              Bom dia, Ana
            </p>
            <p className="mt-0.5 text-xs text-muted sm:text-sm">
              Seu quiz diário de hoje já está pronto.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.2fr] sm:gap-4">
              {/* Streak: verde marca a sequência mantida (acerto/ação) */}
              <div className="rounded-xl border border-border bg-bg p-3.5 sm:p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-verde text-verde-ink">
                    <IconFlame className="size-5" stroke={1.75} />
                  </span>
                  <div>
                    <p className="text-xl font-extrabold leading-none text-ink">
                      7 dias
                    </p>
                    <p className="mt-1 text-[11px] text-muted">
                      de estudo seguidos
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-1.5">
                  {DIAS.map((dia, i) => (
                    <span
                      key={i}
                      className={`flex size-6 items-center justify-center rounded-full text-[9px] font-semibold ${
                        i < 5
                          ? "bg-verde text-verde-ink"
                          : i === 5
                            ? "bg-roxo text-on-dark"
                            : "border border-border text-muted"
                      }`}
                    >
                      {dia}
                    </span>
                  ))}
                </div>
              </div>

              {/* Radar de desempenho: polígono cresce do centro ao entrar em cena */}
              <div className="flex items-center gap-3 rounded-xl border border-border bg-bg p-3.5 sm:p-4">
                <RadarDesempenho />
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Desempenho por matéria
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    Radar atualizado a cada simulado
                  </p>
                </div>
              </div>
            </div>

            {/* Cards de matéria: superfície de destaque theme-aware —
            clara no claro, obsidian no escuro; grid nos dois temas com
            a linha de cada modo (DESIGN.md regra 3) */}
            <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
              {MATERIAS.map((materia) => (
                <div
                  key={materia.nome}
                  className="surface-destaque grid-surface rounded-xl p-2.5 sm:p-4"
                >
                  <span className="flex size-7 items-center justify-center rounded-lg bg-roxo sm:size-9 sm:rounded-xl">
                    <materia.icone
                      className="size-4 text-on-dark sm:size-5"
                      stroke={1.75}
                    />
                  </span>
                  <p className="mt-2 truncate text-xs font-semibold text-destaque-ink sm:mt-3 sm:text-sm">
                    {materia.nome}
                  </p>
                  <p className="text-[10px] text-destaque-muted sm:text-xs">
                    {materia.acerto}% de acerto
                  </p>
                  {/* Barra verde = indicador de acerto (permitido) */}
                  <div className="mt-2 h-1.5 rounded-full bg-[var(--destaque-track)]">
                    <div
                      className="h-full rounded-full bg-verde"
                      style={{ width: `${materia.acerto}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
