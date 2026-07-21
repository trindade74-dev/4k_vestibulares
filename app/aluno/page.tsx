import type { Metadata } from "next";
import Link from "next/link";
import { IconFlame } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/server";
import { buscarDesempenho, buscarStreak } from "@/lib/aluno/queries";
import { iconeDaMateria } from "@/lib/aluno/materia-icones";
import { Entrada } from "@/components/aluno/entrada";
import { RadarDesempenho } from "@/components/aluno/radar-desempenho";

export const metadata: Metadata = {
  title: "Ambiente do aluno — 4K Vestibulares",
  description: "Seu ambiente de estudos na Plataforma 4K.",
};

/** Saudação pela hora de Brasília (renderiza no servidor). */
function saudacaoBrasilia() {
  const hora = Number(
    new Intl.DateTimeFormat("pt-BR", {
      hour: "numeric",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    }).format(new Date()),
  );
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

/** Índice do dia atual (0 = Seg … 6 = Dom) no fuso de Brasília. */
function diaDaSemanaBrasilia(): number {
  const dia = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
  const mapa: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  return mapa[dia] ?? 0;
}

const LETRAS_DIAS = ["S", "T", "Q", "Q", "S", "S", "D"];

export default async function AlunoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: perfil }, streak, desempenho] = await Promise.all([
    supabase
      .from("usuarios")
      .select("nome")
      .eq("id", user!.id)
      .single(),
    buscarStreak(),
    buscarDesempenho(),
  ]);

  const primeiroNome = (perfil?.nome ?? "estudante").trim().split(/\s+/)[0];
  const hojeIdx = diaDaSemanaBrasilia();

  /** Estado honesto de cada dia da semana a partir só do número do streak. */
  function estadoDoDia(d: number): "cumprido" | "hoje" | "futuro" | "vazio" {
    if (d === hojeIdx) return "hoje";
    if (d > hojeIdx) return "futuro";
    return hojeIdx - d <= streak ? "cumprido" : "vazio";
  }

  return (
    <main id="conteudo" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Entrada className="flex flex-col gap-6">
        {/* Saudação */}
        <header data-entrada>
          <p className="text-sm font-medium text-muted">Plataforma 4K</p>
          <h1 className="titulo-impacto mt-1 text-3xl text-ink sm:text-4xl">
            {saudacaoBrasilia()}, <span className="text-roxo">{primeiroNome}</span>
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
            Seu quiz diário está pronto. Mantenha a sequência e acompanhe seu
            radar de desempenho.
          </p>
        </header>

        {/* Streak + CTA */}
        <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
          <section
            data-entrada
            aria-label="Sequência de estudos"
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-verde text-verde-ink">
                <IconFlame className="size-7" stroke={1.75} />
              </span>
              <div>
                <p className="text-2xl font-extrabold leading-none text-ink">
                  {streak} {streak === 1 ? "dia" : "dias"}
                </p>
                <p className="mt-1 text-sm text-muted">de estudo seguidos</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {LETRAS_DIAS.map((letra, d) => {
                const estado = estadoDoDia(d);
                return (
                  <span
                    key={d}
                    className={`flex size-8 flex-1 items-center justify-center rounded-full text-[11px] font-semibold ${
                      estado === "cumprido"
                        ? "bg-verde text-verde-ink"
                        : estado === "hoje"
                          ? "bg-roxo text-on-dark"
                          : "border border-border text-muted"
                    }`}
                  >
                    {letra}
                  </span>
                );
              })}
            </div>
          </section>

          {/* CTA principal — único verde de ação da tela */}
          <section
            data-entrada
            className="flex flex-col justify-center gap-3 rounded-xl border border-border bg-surface p-5"
          >
            <p className="text-sm font-medium text-ink">Quiz do dia</p>
            <p className="text-sm leading-relaxed text-muted">
              Poucas questões, correção na hora.
            </p>
            <Link href="/aluno/quiz" className="btn btn-verde mt-1 w-full">
              Fazer quiz do dia
            </Link>
          </section>
        </div>

        {/* Desempenho */}
        <section
          id="desempenho"
          data-entrada
          aria-labelledby="titulo-desempenho"
          className="rounded-xl border border-border bg-surface p-5 sm:p-6"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="mx-auto aspect-square w-full max-w-[300px] sm:mx-0 sm:max-w-[280px]">
              <RadarDesempenho valores={desempenho} />
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id="titulo-desempenho"
                className="text-lg font-semibold text-ink"
              >
                Desempenho por matéria
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Cada eixo é uma matéria; quanto mais longe do centro, maior seu
                percentual de acerto.
              </p>
              {/* Lista textual acessível */}
              <ul className="sr-only">
                {desempenho.map((m) => (
                  <li key={m.materia_id}>
                    {m.materia_nome}: {Math.round(m.percentual)}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Cards de matéria */}
        <section aria-label="Matérias" data-entrada>
          <h2 className="mb-3 text-lg font-semibold text-ink">Matérias</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {desempenho.map((materia) => {
              const Icone = iconeDaMateria(materia.materia_nome);
              const pct = Math.round(materia.percentual);
              return (
                <div
                  key={materia.materia_id}
                  className="surface-destaque grid-surface rounded-xl border border-[var(--destaque-border)] p-4"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-roxo">
                    <Icone className="size-5 text-on-dark" stroke={1.75} />
                  </span>
                  <p className="mt-3 truncate text-sm font-semibold text-destaque-ink">
                    {materia.materia_nome}
                  </p>
                  <p className="text-xs text-destaque-muted">{pct}% de acerto</p>
                  <div className="mt-2.5 h-1.5 rounded-full bg-[var(--destaque-track)]">
                    <div
                      className="h-full rounded-full bg-verde"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </Entrada>
    </main>
  );
}
