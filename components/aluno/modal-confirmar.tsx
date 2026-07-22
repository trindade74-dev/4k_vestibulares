"use client";

import { useEffect, useId, useRef } from "react";

type Props = {
  aberto: boolean;
  titulo: string;
  descricao: string;
  rotuloConfirmar: string;
  rotuloCancelar: string;
  confirmando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

/**
 * Modal de confirmação acessível (role=dialog, aria-modal). Escape e clique
 * no backdrop cancelam; o foco vai para o botão cancelar ao abrir. Modais
 * abrem do centro (transform-origin center). Animação sob reduced-motion
 * é neutralizada pelo CSS global das transições.
 */
export function ModalConfirmar({
  aberto,
  titulo,
  descricao,
  rotuloConfirmar,
  rotuloCancelar,
  confirmando = false,
  onConfirmar,
  onCancelar,
}: Props) {
  const tituloId = useId();
  const descId = useId();
  const cancelarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;
    cancelarRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancelar();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aberto, onCancelar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={tituloId}
      aria-describedby={descId}
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="Fechar"
        tabIndex={-1}
        onClick={onCancelar}
        className="modal-scrim absolute inset-0 cursor-default bg-obsidian/60"
      />

      <div className="modal-cartao relative w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-2xl">
        <h2 id={tituloId} className="text-lg font-semibold text-ink">
          {titulo}
        </h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-muted">
          {descricao}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelarRef}
            type="button"
            onClick={onCancelar}
            className="btn btn-contorno"
          >
            {rotuloCancelar}
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={confirmando}
            className="btn btn-roxo disabled:opacity-60"
          >
            {rotuloConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
