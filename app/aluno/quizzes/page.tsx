import type { Metadata } from "next";
import Link from "next/link";
import {
  IconCircleCheck,
  IconArrowRight,
  IconFlame,
  IconHistory,
} from "@tabler/icons-react";
import { buscarHistoricoQuiz, buscarStreak } from "@/lib/aluno/queries";
import { Entrada } from "@/components/aluno/entrada";
import type { HistoricoQuiz } from "@/lib/aluno/tipos";

export const metadata: Metadata = {
  title: "Quizzes — 4K Vestibulares",
  description: "Sua sequência de estudos e o histórico do quiz diário.",
};

const FUSO = "America/Sao_Paulo";

/** Chave de dia (YYYY-MM-DD) no fuso de Brasília para agrupar. */
function chaveDia(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

/** Rótulo humano do dia: Hoje, Ontem ou "21 de julho". */
function rotuloDia(chave: string): string {
  const hoje = chaveDia(new Date().toISOString());
  const ontem = chaveDia(new Date(Date.now() - 86_400_000).toISOString());
  if (chave === hoje) return "Hoje";
  if (chave === ontem) return "Ontem";
  const [ano, mes, dia] = chave.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
  }).format(new Date(ano, mes - 1, dia));
}

/** Hora no fuso de Brasília (HH:mm). */
function hora(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: FUSO,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

type Grupo = { chave: string; rotulo: string; itens: HistoricoQuiz[] };

/** Agrupa o histórico por dia, preservando a ordem recebida (mais recente 1º). */
function agrupar(historico: HistoricoQuiz[]): Grupo[] {
  const grupos: Grupo[] = [];
  for (const item of historico) {
    const chave = chaveDia(item.respondido_em);
    let grupo = grupos.at(-1);
    if (!grupo || grupo.chave !== chave) {
      grupo = { chave, rotulo: rotuloDia(chave), itens: [] };
      grupos.push(grupo);
    }
    grupo.itens.push(item);
  }
  return grupos;
}

export default async function QuizzesPage() {
  const [streak, historico] = await Promise.all([
    buscarStreak(),
    buscarHistoricoQuiz(30),
  ]);
  const grupos = agrupar(historico);

  return (
    <main id="conteudo" className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Entrada className="flex flex-col gap-6">
        <header data-entrada>
          <p className="text-sm font-medium text-muted">Plataforma 4K</p>
          <h1 className="titulo-impacto mt-1 text-3xl text-ink sm:text-4xl">
            Quizzes
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
            Sua sequência de estudos e o histórico das questões que você já
            respondeu.
          </p>
        </header>

        {/* Streak em destaque */}
        <section
          data-entrada
          aria-label="Sequência de estudos"
          className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5"
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
          <Link href="/aluno/quiz" className="btn btn-verde shrink-0">
            Fazer quiz do dia
          </Link>
        </section>

        {/* Histórico */}
        {grupos.length === 0 ? (
          <VazioHistorico />
        ) : (
          <section data-entrada aria-label="Histórico do quiz">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-ink">
              <IconHistory className="size-5 text-muted" stroke={1.75} />
              Histórico
            </h2>
            <div className="flex flex-col gap-5">
              {grupos.map((grupo) => (
                <div key={grupo.chave}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    {grupo.rotulo}
                  </h3>
                  <ul className="overflow-hidden rounded-xl border border-border bg-surface">
                    {grupo.itens.map((item, i) => (
                      <li
                        key={item.id}
                        className={`flex items-center gap-3 px-4 py-3 ${
                          i > 0 ? "border-t border-border" : ""
                        }`}
                      >
                        <StatusHistorico acertou={item.acertou} />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                          {item.materia_nome}
                        </span>
                        <span className="shrink-0 text-xs text-muted">
                          {hora(item.respondido_em)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </Entrada>
    </main>
  );
}

/** Ícone de acerto/erro de cada linha. Verde só no acerto. */
function StatusHistorico({ acertou }: { acertou: boolean }) {
  return acertou ? (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-verde text-verde-ink">
      <IconCircleCheck className="size-4" stroke={2} />
    </span>
  ) : (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-alt text-roxo">
      <IconArrowRight className="size-4" stroke={2} />
    </span>
  );
}

function VazioHistorico() {
  return (
    <div
      data-entrada
      className="rounded-xl border border-border bg-surface p-10 text-center"
    >
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface-alt text-roxo">
        <IconHistory className="size-7" stroke={1.5} />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-ink">
        Nada por aqui ainda
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Responda o quiz do dia para começar a construir seu histórico e sua
        sequência.
      </p>
      <Link href="/aluno/quiz" className="btn btn-verde mt-6 inline-flex">
        Fazer quiz do dia
      </Link>
    </div>
  );
}
