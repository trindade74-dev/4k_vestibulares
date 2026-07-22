"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { pedirRecurso } from "@/lib/aluno/actions";

type Props = {
  questaoId: string;
  tentativaId: string | null;
  onFechar: () => void;
  onEnviado: (questaoId: string) => void;
};

/** Modal com textarea para contestar uma questão do espelho. */
export function RecursoModal({
  questaoId,
  tentativaId,
  onFechar,
  onEnviado,
}: Props) {
  const tituloId = useId();
  const campoId = useId();
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, enviar] = useTransition();
  const campoRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    campoRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onFechar]);

  function submeter() {
    if (enviando) return;
    setErro(null);
    enviar(async () => {
      const r = await pedirRecurso(questaoId, tentativaId, texto);
      if ("erro" in r) {
        setErro(r.erro);
        return;
      }
      onEnviado(questaoId);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={tituloId}
    >
      <button
        type="button"
        aria-label="Fechar"
        tabIndex={-1}
        onClick={onFechar}
        className="modal-scrim absolute inset-0 cursor-default bg-obsidian/60"
      />

      <div className="modal-cartao relative w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl">
        <h2 id={tituloId} className="text-lg font-semibold text-ink">
          Pedir recurso
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Explique o que você acha incorreto nesta questão. A coordenação vai
          analisar.
        </p>

        <label htmlFor={campoId} className="sr-only">
          Descrição do recurso
        </label>
        <textarea
          id={campoId}
          ref={campoRef}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          placeholder="Descreva o problema em pelo menos 10 caracteres…"
          className="input-4k mt-4 resize-y"
        />

        {erro && (
          <p className="caixa-revisar mt-3" role="alert">
            {erro}
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onFechar} className="btn btn-contorno">
            Cancelar
          </button>
          <button
            type="button"
            onClick={submeter}
            disabled={enviando}
            className="btn btn-roxo disabled:opacity-60"
          >
            {enviando ? "Enviando…" : "Enviar recurso"}
          </button>
        </div>
      </div>
    </div>
  );
}
