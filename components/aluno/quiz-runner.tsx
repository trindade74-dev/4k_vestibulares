"use client";

import { createElement, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  IconArrowRight,
  IconCircleCheck,
  IconFlame,
  IconTargetArrow,
} from "@tabler/icons-react";
import {
  buscarMaisQuestoes,
  buscarStreakAtual,
  responder,
} from "@/lib/aluno/actions";
import { iconeDaMateria } from "@/lib/aluno/materia-icones";
import type { QuestaoSegura } from "@/lib/aluno/tipos";

gsap.registerPlugin(useGSAP);

type Resultado = { escolha: string; acertou: boolean; gabarito: string };
type Fase = "respondendo" | "feedback" | "resumo";

export function QuizRunner({
  questoesIniciais,
}: {
  questoesIniciais: QuestaoSegura[];
}) {
  const [questoes, setQuestoes] = useState<QuestaoSegura[]>(questoesIniciais);
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [resultados, setResultados] = useState<Record<string, Resultado>>({});
  const [fase, setFase] = useState<Fase>("respondendo");
  const [erro, setErro] = useState<string | null>(null);
  const [streakFinal, setStreakFinal] = useState<number | null>(null);
  const [semMaisPratica, setSemMaisPratica] = useState(false);
  const [pendente, iniciar] = useTransition();

  const cenaRef = useRef<HTMLDivElement>(null);
  const questaoAtual = questoes[indice];
  const total = questoes.length;
  const respondidas = Object.keys(resultados).length;
  const acertos = Object.values(resultados).filter((r) => r.acertou).length;
  const resultadoAtual = questaoAtual ? resultados[questaoAtual.id] : undefined;

  // Animações de cena: entrada da questão, "pop" no acerto, entrada do resumo.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (fase === "respondendo") {
          gsap.from(".quiz-cena", {
            opacity: 0,
            y: 20,
            duration: 0.45,
            ease: "power3.out",
          });
        } else if (fase === "feedback") {
          gsap.fromTo(
            ".alt-correta",
            { scale: 0.94 },
            { scale: 1, duration: 0.4, ease: "back.out(2)" },
          );
          gsap.from(".quiz-banner", {
            opacity: 0,
            y: 10,
            duration: 0.35,
            ease: "power2.out",
          });
        } else if (fase === "resumo") {
          gsap.from(".quiz-resumo", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power3.out",
          });
        }
      });
      return () => mm.revert();
    },
    { scope: cenaRef, dependencies: [fase, indice] },
  );

  function enviarResposta() {
    if (!escolha || !questaoAtual || pendente) return;
    setErro(null);
    iniciar(async () => {
      const r = await responder(questaoAtual.id, escolha);
      if ("erro" in r) {
        setErro(r.erro);
        return;
      }
      setResultados((prev) => ({
        ...prev,
        [questaoAtual.id]: { escolha, acertou: r.acertou, gabarito: r.gabarito },
      }));
      setFase("feedback");
    });
  }

  function proxima() {
    if (indice + 1 >= total) {
      setFase("resumo");
      iniciar(async () => {
        const s = await buscarStreakAtual();
        setStreakFinal(s);
      });
    } else {
      setIndice((i) => i + 1);
      setEscolha(null);
      setErro(null);
      setFase("respondendo");
    }
  }

  function continuarPraticando() {
    if (pendente) return;
    setSemMaisPratica(false);
    iniciar(async () => {
      const novas = await buscarMaisQuestoes();
      if (novas.length === 0) {
        setSemMaisPratica(true);
        return;
      }
      setIndice(questoes.length);
      setQuestoes((prev) => [...prev, ...novas]);
      setEscolha(null);
      setErro(null);
      setStreakFinal(null);
      setFase("respondendo");
    });
  }

  // Estado inicial vazio: quiz do dia já concluído.
  if (total === 0) {
    return (
      <Casca>
        <div className="quiz-resumo rounded-xl border border-border bg-surface p-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-verde text-verde-ink">
            <IconCircleCheck className="size-7" stroke={1.75} />
          </span>
          <h2 className="titulo-impacto mt-4 text-2xl text-ink">
            Quiz do dia concluído!
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Você já respondeu o quiz de hoje. Quer continuar treinando com mais
            questões?
          </p>
          {semMaisPratica ? (
            <p className="mt-6 text-sm font-medium text-muted">
              Você já revisou tudo por hoje 🎉
            </p>
          ) : (
            <button
              type="button"
              onClick={continuarPraticando}
              disabled={pendente}
              className="btn btn-verde mt-6 disabled:opacity-60"
            >
              {pendente ? "Carregando…" : "Praticar mesmo assim"}
            </button>
          )}
          <div className="mt-3">
            <Link href="/aluno" className="btn btn-contorno">
              Voltar ao início
            </Link>
          </div>
        </div>
      </Casca>
    );
  }

  // Resumo final.
  if (fase === "resumo") {
    return (
      <Casca>
        <div
          ref={cenaRef}
          className="quiz-resumo rounded-xl border border-border bg-surface p-8 text-center"
        >
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-verde text-verde-ink">
            <IconFlame className="size-7" stroke={1.75} />
          </span>
          <h2 className="titulo-impacto mt-4 text-2xl text-ink">
            {acertos} de {respondidas} certas
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {acertos === respondidas
              ? "Gabaritou! Sequência mantida."
              : "Bom trabalho. Cada questão revisada conta."}
          </p>

          {streakFinal !== null && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface-alt px-4 py-1.5 text-sm font-semibold text-roxo">
              <IconFlame className="size-4" stroke={2} />
              {streakFinal} {streakFinal === 1 ? "dia" : "dias"} de sequência
            </p>
          )}

          <div className="mt-7 flex flex-col items-center gap-3">
            {semMaisPratica ? (
              <p className="text-sm font-medium text-muted">
                Você já revisou tudo por hoje 🎉
              </p>
            ) : (
              <button
                type="button"
                onClick={continuarPraticando}
                disabled={pendente}
                className="btn btn-verde disabled:opacity-60"
              >
                {pendente ? "Carregando…" : "Continuar praticando"}
              </button>
            )}
            <Link href="/aluno" className="btn btn-contorno">
              Voltar ao início
            </Link>
          </div>
        </div>
      </Casca>
    );
  }

  // Fluxo de resposta.
  const iconeMateria = iconeDaMateria(questaoAtual.materia_nome);
  const progresso = ((indice + (fase === "feedback" ? 1 : 0)) / total) * 100;

  return (
    <Casca>
      {/* Faixa de destaque com progresso (barra roxa — verde é reservado a acerto) */}
      <div className="surface-destaque grid-surface rounded-xl border border-[var(--destaque-border)] p-4">
        <div className="flex items-center justify-between text-xs font-medium text-destaque-muted">
          <span className="inline-flex items-center gap-1.5">
            <IconTargetArrow className="size-4" stroke={1.75} />
            Quiz do dia
          </span>
          <span>
            Questão {indice + 1} de {total}
          </span>
        </div>
        <div
          className="mt-2.5 h-2 rounded-full bg-[var(--destaque-track)]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={indice + (fase === "feedback" ? 1 : 0)}
          aria-label="Progresso do quiz"
        >
          <div
            className="h-full rounded-full bg-roxo transition-[width] duration-300 ease-out"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      <div ref={cenaRef}>
        <div className="quiz-cena mt-4 rounded-xl border border-border bg-surface p-5 sm:p-6">
          {/* Cabeçalho da questão (matéria) */}
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-roxo">
              {createElement(iconeMateria, {
                className: "size-5 text-on-dark",
                stroke: 1.75,
              })}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {questaoAtual.materia_nome}
              </p>
              {questaoAtual.assunto && (
                <p className="truncate text-xs text-muted">
                  {questaoAtual.assunto}
                </p>
              )}
            </div>
          </div>

          {/* Enunciado (texto de estudo: superfície limpa, sem grid) */}
          <p className="mt-4 text-base leading-relaxed text-ink">
            {questaoAtual.enunciado}
          </p>

          {/* Alternativas */}
          <div
            role="radiogroup"
            aria-label="Alternativas"
            className="mt-5 flex flex-col gap-2.5"
          >
            {questaoAtual.alternativas.map((alt) => {
              const estado = classeAlternativa(alt.id, escolha, resultadoAtual);
              const ehFeedback = fase === "feedback";
              const correta = resultadoAtual?.gabarito === alt.id;
              return (
                <button
                  key={alt.id}
                  type="button"
                  role="radio"
                  aria-checked={escolha === alt.id}
                  disabled={ehFeedback || pendente}
                  onClick={() => setEscolha(alt.id)}
                  className={`${correta ? "alt-correta " : ""}flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${estado.classe}`}
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold uppercase ${estado.badge}`}
                  >
                    {estado.icone ?? alt.id}
                  </span>
                  <span className="pt-0.5 text-sm leading-relaxed">
                    {alt.texto}
                  </span>
                </button>
              );
            })}
          </div>

          {erro && (
            <p className="caixa-revisar mt-4" role="alert">
              {erro}
            </p>
          )}

          {/* Banner de feedback */}
          {fase === "feedback" && resultadoAtual && (
            <p
              className={`quiz-banner mt-4 flex items-center gap-2 ${
                resultadoAtual.acertou ? "caixa-acerto" : "caixa-revisar"
              }`}
              role="status"
            >
              {resultadoAtual.acertou ? (
                <IconCircleCheck className="size-5 shrink-0" stroke={1.75} />
              ) : (
                <IconArrowRight className="size-5 shrink-0" stroke={1.75} />
              )}
              {resultadoAtual.acertou
                ? "Acertou! Resposta correta."
                : `Resposta correta: alternativa ${resultadoAtual.gabarito.toUpperCase()}.`}
            </p>
          )}

          {/* Ação */}
          <div className="mt-6">
            {fase === "respondendo" ? (
              <button
                type="button"
                onClick={enviarResposta}
                disabled={!escolha || pendente}
                className="btn btn-verde w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {pendente ? "Verificando…" : "Responder"}
              </button>
            ) : (
              <button
                type="button"
                onClick={proxima}
                disabled={pendente}
                className="btn btn-roxo w-full disabled:opacity-60 sm:w-auto"
              >
                {indice + 1 >= total ? "Ver resumo" : "Próxima"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Casca>
  );
}

/** Casca comum: título + container centralizado. */
function Casca({ children }: { children: React.ReactNode }) {
  return (
    <main id="conteudo" className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      {children}
    </main>
  );
}

/** Classes da alternativa conforme fase e resultado (verde só no acerto). */
function classeAlternativa(
  altId: string,
  escolha: string | null,
  resultado: Resultado | undefined,
): { classe: string; badge: string; icone: React.ReactNode } {
  // Feedback: destaca a correta; se errou, marca a escolhida como "revisar".
  if (resultado) {
    if (resultado.gabarito === altId) {
      return {
        classe:
          "border-[var(--acerto-border)] bg-[var(--acerto-bg)] text-[var(--acerto-text)]",
        badge: "bg-verde text-verde-ink",
        icone: <IconCircleCheck className="size-4" stroke={2} />,
      };
    }
    if (resultado.escolha === altId && !resultado.acertou) {
      return {
        classe:
          "border-[var(--revisar-border)] bg-[var(--revisar-bg)] text-[var(--revisar-text)]",
        badge: "bg-roxo text-on-dark",
        icone: <IconArrowRight className="size-4" stroke={2} />,
      };
    }
    return {
      classe: "border-border bg-surface text-muted opacity-60",
      badge: "bg-surface-alt text-muted",
      icone: null,
    };
  }

  // Respondendo: seleção em roxo.
  if (escolha === altId) {
    return {
      classe: "border-roxo bg-surface-alt text-ink",
      badge: "bg-roxo text-on-dark",
      icone: null,
    };
  }
  return {
    classe: "border-border bg-surface text-ink hover:border-roxo",
    badge: "bg-surface-alt text-muted",
    icone: null,
  };
}
