"use client";

import { createElement, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  IconAlertTriangle,
  IconChevronLeft,
  IconChevronRight,
  IconClipboardText,
  IconLoader2,
} from "@tabler/icons-react";
import {
  finalizarSimulado,
  responderSimulado,
} from "@/lib/aluno/actions";
import { iconeDaMateria } from "@/lib/aluno/materia-icones";
import type { QuestaoSimulado } from "@/lib/aluno/tipos";
import { QuestaoView } from "@/components/aluno/questao-view";
import { ModalConfirmar } from "@/components/modal-confirmar";

gsap.registerPlugin(useGSAP);

export function SimuladoRunner({
  tentativaId,
  questoesIniciais,
}: {
  tentativaId: string;
  questoesIniciais: QuestaoSimulado[];
}) {
  const router = useRouter();
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>(() => {
    const inicial: Record<string, string> = {};
    for (const q of questoesIniciais) {
      if (q.resposta_atual) inicial[q.id] = q.resposta_atual;
    }
    return inicial;
  });
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [erroFinal, setErroFinal] = useState<string | null>(null);
  const [finalizando, finalizar] = useTransition();

  const cenaRef = useRef<HTMLDivElement>(null);
  const questoes = questoesIniciais;
  const total = questoes.length;
  const questaoAtual = questoes[indice];
  const respondidas = Object.keys(respostas).length;
  const progresso = total > 0 ? (respondidas / total) * 100 : 0;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".simulado-cena", {
          opacity: 0,
          y: 16,
          duration: 0.4,
          ease: "power3.out",
        });
      });
      return () => mm.revert();
    },
    { scope: cenaRef, dependencies: [indice] },
  );

  function escolher(id: string) {
    if (!questaoAtual) return;
    const anterior = respostas[questaoAtual.id];
    setErroSalvar(null);
    setRespostas((prev) => ({ ...prev, [questaoAtual.id]: id }));
    setSalvando(true);
    void responderSimulado(tentativaId, questaoAtual.id, id).then((r) => {
      setSalvando(false);
      if ("erro" in r) {
        setErroSalvar("Não foi possível salvar. Toque na opção de novo.");
        // Reverte para o valor anterior (ou remove se não havia).
        setRespostas((prev) => {
          const copia = { ...prev };
          if (anterior) copia[questaoAtual.id] = anterior;
          else delete copia[questaoAtual.id];
          return copia;
        });
      }
    });
  }

  function irPara(i: number) {
    if (i < 0 || i >= total) return;
    setIndice(i);
  }

  function confirmarFinalizar() {
    if (finalizando) return;
    setErroFinal(null);
    finalizar(async () => {
      const r = await finalizarSimulado(tentativaId);
      if ("erro" in r) {
        setErroFinal(r.erro);
        setModalAberto(false);
        return;
      }
      router.push(`/aluno/simulados/${tentativaId}/resultado`);
    });
  }

  if (!questaoAtual) return null;

  const iconeMateria = iconeDaMateria(questaoAtual.materia_nome);

  return (
    <main
      id="conteudo"
      className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10"
    >
      {/* Progresso — barra roxa (verde é reservado a acerto) */}
      <div className="surface-destaque grid-surface rounded-xl border border-[var(--destaque-border)] p-4">
        <div className="flex items-center justify-between text-xs font-medium text-destaque-muted">
          <span className="inline-flex items-center gap-1.5">
            <IconClipboardText className="size-4" stroke={1.75} />
            Simulado em andamento
          </span>
          <span>
            {respondidas} de {total} respondidas
          </span>
        </div>
        <div
          className="mt-2.5 h-2 rounded-full bg-[var(--destaque-track)]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={respondidas}
          aria-label="Questões respondidas"
        >
          <div
            className="h-full rounded-full bg-roxo transition-[width] duration-300 ease-out"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      {/* Mapa de questões */}
      <nav aria-label="Mapa de questões" className="mt-4">
        <div className="flex flex-wrap gap-2">
          {questoes.map((q, i) => {
            const respondida = respostas[q.id] !== undefined;
            const atual = i === indice;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => irPara(i)}
                aria-current={atual ? "true" : undefined}
                aria-label={`Questão ${i + 1}${respondida ? ", respondida" : ", pendente"}`}
                className={`size-9 rounded-lg border text-sm font-semibold transition-colors ${
                  respondida
                    ? "border-roxo bg-roxo text-on-dark"
                    : "border-border bg-surface text-muted hover:border-roxo"
                } ${atual ? "ring-2 ring-roxo ring-offset-2 ring-offset-bg" : ""}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </nav>

      <div ref={cenaRef}>
        <div className="simulado-cena mt-4 rounded-xl border border-border bg-surface p-5 sm:p-6">
          {/* Cabeçalho da questão */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-roxo">
                {createElement(iconeMateria, {
                  className: "size-5 text-on-dark",
                  stroke: 1.75,
                })}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {questaoAtual.materia_nome}
                </p>
                <p className="text-xs text-muted">
                  Questão {indice + 1} de {total}
                </p>
              </div>
            </div>
            {salvando && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                <IconLoader2 className="size-4 animate-spin" stroke={1.75} />
                Salvando
              </span>
            )}
          </div>

          {/* Questão — sem feedback durante a prova */}
          <div className="mt-4">
            <QuestaoView
              contexto={questaoAtual.contexto}
              tipo_questao={questaoAtual.tipo_questao}
              enunciado={questaoAtual.enunciado}
              alternativas={questaoAtual.alternativas}
              escolha={respostas[questaoAtual.id] ?? null}
              onEscolha={escolher}
              modo="respondendo"
            />
          </div>

          {erroSalvar && (
            <p className="caixa-revisar mt-4" role="alert">
              {erroSalvar}
            </p>
          )}

          {/* Navegação Anterior / Próxima */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => irPara(indice - 1)}
              disabled={indice === 0}
              className="btn btn-contorno disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconChevronLeft className="size-4" stroke={2} />
              Anterior
            </button>
            <button
              type="button"
              onClick={() => irPara(indice + 1)}
              disabled={indice + 1 >= total}
              className="btn btn-contorno disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
              <IconChevronRight className="size-4" stroke={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Finalizar */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="btn btn-roxo w-full"
        >
          Finalizar prova
        </button>
        {erroFinal && (
          <p className="caixa-revisar mt-3 flex items-start gap-2" role="alert">
            <IconAlertTriangle
              className="mt-0.5 size-4 shrink-0"
              stroke={1.75}
            />
            {erroFinal}
          </p>
        )}
      </div>

      <ModalConfirmar
        aberto={modalAberto}
        titulo="Finalizar prova?"
        descricao={
          respondidas < total
            ? `Você respondeu ${respondidas} de ${total} questões. Depois de finalizar não é possível alterar as respostas.`
            : "Depois de finalizar não é possível alterar as respostas."
        }
        rotuloConfirmar={finalizando ? "Finalizando…" : "Finalizar"}
        rotuloCancelar="Voltar à prova"
        confirmando={finalizando}
        onConfirmar={confirmarFinalizar}
        onCancelar={() => setModalAberto(false)}
      />
    </main>
  );
}
