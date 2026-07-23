"use client";

import { useEffect, useId } from "react";

type Props = {
  aberto: boolean;
  titulo: string;
  onFechar: () => void;
  children: React.ReactNode;
};

/**
 * Casca visual de um modal de formulário — scrim + card centralizado,
 * mesmo estilo de components/modal-confirmar.tsx, mas com espaço pro
 * conteúdo do form (mais largo, com scroll interno em telas baixas) em
 * vez de um par de botões fixo. Escape e clique no backdrop fecham.
 */
export function ModalFormulario({ aberto, titulo, onFechar, children }: Props) {
  const tituloId = useId();

  useEffect(() => {
    if (!aberto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={tituloId}
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="Fechar"
        tabIndex={-1}
        onClick={onFechar}
        className="modal-scrim absolute inset-0 cursor-default bg-obsidian/60"
      />

      <div className="modal-cartao relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-surface p-6 shadow-2xl">
        <h2 id={tituloId} className="text-lg font-semibold text-ink">
          {titulo}
        </h2>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
