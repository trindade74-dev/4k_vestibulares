"use client";

import { createElement, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  IconArrowLeft,
  IconCircleCheck,
  IconCircleX,
  IconFlag,
} from "@tabler/icons-react";
import { iconeDaMateria } from "@/lib/aluno/materia-icones";
import type { ItemEspelho } from "@/lib/aluno/tipos";
import { QuestaoView } from "@/components/aluno/questao-view";
import { RecursoModal } from "@/components/aluno/recurso-modal";

gsap.registerPlugin(useGSAP);

type ResumoMateria = {
  materia_id: string;
  materia_nome: string;
  total: number;
  acertos: number;
  pct: number;
};

export function Espelho({
  tentativaId,
  itens,
}: {
  tentativaId: string;
  itens: ItemEspelho[];
}) {
  const raizRef = useRef<HTMLElement>(null);
  const [modalQuestao, setModalQuestao] = useState<string | null>(null);
  const [enviados, setEnviados] = useState<Set<string>>(new Set());

  const total = itens.length;
  const acertos = itens.filter((i) => i.acertou === true).length;
  const pctGeral = total > 0 ? Math.round((acertos / total) * 100) : 0;

  const porMateria = useMemo<ResumoMateria[]>(() => {
    const mapa = new Map<string, ResumoMateria>();
    for (const it of itens) {
      const atual = mapa.get(it.materia_id) ?? {
        materia_id: it.materia_id,
        materia_nome: it.materia_nome,
        total: 0,
        acertos: 0,
        pct: 0,
      };
      atual.total += 1;
      if (it.acertou === true) atual.acertos += 1;
      mapa.set(it.materia_id, atual);
    }
    return Array.from(mapa.values()).map((m) => ({
      ...m,
      pct: m.total > 0 ? Math.round((m.acertos / m.total) * 100) : 0,
    }));
  }, [itens]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-esp]", {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.06,
        });
      });
      return () => mm.revert();
    },
    { scope: raizRef },
  );

  return (
    <main
      ref={raizRef}
      id="conteudo"
      className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10"
    >
      <div data-esp>
        <Link
          href="/aluno/simulados"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          <IconArrowLeft className="size-4" stroke={1.75} />
          Voltar aos simulados
        </Link>
      </div>

      {/* Placar geral */}
      <section
        data-esp
        aria-label="Placar"
        className="mt-4 rounded-xl border border-border bg-surface p-6"
      >
        <p className="text-sm font-medium text-muted">Resultado do simulado</p>
        <div className="mt-2 flex items-end gap-3">
          <p className="titulo-impacto text-4xl text-ink">
            {acertos}
            <span className="text-muted">/{total}</span>
          </p>
          <p className="mb-1 text-sm text-muted">
            {pctGeral}% de acerto
          </p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-surface-alt">
          <div
            className="h-full rounded-full bg-verde"
            style={{ width: `${pctGeral}%` }}
          />
        </div>
      </section>

      {/* Placar por matéria */}
      {porMateria.length > 1 && (
        <section
          data-esp
          aria-label="Desempenho por matéria"
          className="mt-4 rounded-xl border border-border bg-surface p-6"
        >
          <h2 className="text-sm font-semibold text-ink">Por matéria</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {porMateria.map((m) => (
              <li key={m.materia_id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink">{m.materia_nome}</span>
                  <span className="text-muted">
                    {m.acertos}/{m.total}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-surface-alt">
                  <div
                    className="h-full rounded-full bg-verde"
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Espelho: cada questão com gabarito */}
      <ol className="mt-4 flex flex-col gap-4">
        {itens.map((it) => {
          const Icone = iconeDaMateria(it.materia_nome);
          const enviado = enviados.has(it.questao_id);
          return (
            <li
              key={it.questao_id}
              data-esp
              className="rounded-xl border border-border bg-surface p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-roxo">
                    {createElement(Icone, {
                      className: "size-5 text-on-dark",
                      stroke: 1.75,
                    })}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      Questão {it.ordem}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {it.materia_nome}
                    </p>
                  </div>
                </div>
                <StatusQuestao acertou={it.acertou} />
              </div>

              <div className="mt-4">
                <QuestaoView
                  contexto={it.contexto}
                  tipo_questao={it.tipo_questao}
                  enunciado={it.enunciado}
                  alternativas={it.alternativas}
                  escolha={it.resposta_aluno}
                  modo="revisao"
                  resultado={{
                    gabarito: it.gabarito,
                    resposta_aluno: it.resposta_aluno,
                    acertou: it.acertou,
                  }}
                />
              </div>

              {it.resposta_aluno === null && (
                <p className="mt-3 text-xs font-medium text-muted">
                  Você não respondeu esta questão.
                </p>
              )}

              <div className="mt-4">
                {enviado ? (
                  <p className="inline-flex items-center gap-1.5 text-sm font-medium text-verde-ink">
                    <IconCircleCheck className="size-4" stroke={2} />
                    Recurso enviado
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setModalQuestao(it.questao_id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-roxo transition-colors hover:opacity-80"
                  >
                    <IconFlag className="size-4" stroke={1.75} />
                    Pedir recurso
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {modalQuestao && (
        <RecursoModal
          questaoId={modalQuestao}
          tentativaId={tentativaId}
          onFechar={() => setModalQuestao(null)}
          onEnviado={(qid) => {
            setEnviados((prev) => new Set(prev).add(qid));
            setModalQuestao(null);
          }}
        />
      )}
    </main>
  );
}

/** Selo de acerto/erro da questão. Verde só no acerto. */
function StatusQuestao({ acertou }: { acertou: boolean | null }) {
  if (acertou === true) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--acerto-border)] bg-[var(--acerto-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--acerto-text)]">
        <IconCircleCheck className="size-3.5" stroke={2} />
        Acertou
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--revisar-border)] bg-[var(--revisar-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--revisar-text)]">
      <IconCircleX className="size-3.5" stroke={2} />
      Revisar
    </span>
  );
}
