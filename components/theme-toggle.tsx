"use client";

import { useId } from "react";

/**
 * Alterna [data-theme] no <html> e persiste em localStorage.
 * O ícone é um único SVG que morfa entre lua (tema claro) e sol
 * (tema escuro): o disco central muda de escala, o recorte da
 * máscara desliza para formar o crescente e os raios giram com
 * opacity. Todo o estado visual vem do CSS via [data-theme],
 * evitando divergência de hidratação; sob prefers-reduced-motion
 * a troca é instantânea (ver globals.css).
 */
export function ThemeToggle() {
  const maskId = useId();

  function alternarTema() {
    const html = document.documentElement;
    const atual = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const proximo = atual === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", proximo);
    try {
      localStorage.setItem("theme", proximo);
    } catch {
      /* localStorage indisponível: só não persiste */
    }
  }

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label="Alternar entre tema claro e escuro"
      className="inline-flex size-11 items-center justify-center rounded-xl border border-border text-ink transition-colors hover:bg-surface-alt"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="theme-toggle-icon size-5"
        aria-hidden
      >
        <mask id={maskId}>
          <rect width="24" height="24" fill="#fff" />
          {/* Recorte do crescente: fora do quadro no sol, sobre o disco na lua */}
          <circle className="ttg-recorte" cx="18" cy="6" r="7.2" fill="#000" />
        </mask>
        {/* Disco central: sol pequeno ↔ lua cheia (escala via CSS) */}
        <circle
          className="ttg-nucleo"
          cx="12"
          cy="12"
          r="4.5"
          fill="currentColor"
          mask={`url(#${maskId})`}
        />
        {/* Raios do sol: 8 traços que giram/escalam com opacity */}
        <g
          className="ttg-raios"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        >
          <line x1="12" y1="5.2" x2="12" y2="2.8" />
          <line x1="16.81" y1="7.19" x2="18.51" y2="5.49" />
          <line x1="18.8" y1="12" x2="21.2" y2="12" />
          <line x1="16.81" y1="16.81" x2="18.51" y2="18.51" />
          <line x1="12" y1="18.8" x2="12" y2="21.2" />
          <line x1="7.19" y1="16.81" x2="5.49" y2="18.51" />
          <line x1="5.2" y1="12" x2="2.8" y2="12" />
          <line x1="7.19" y1="7.19" x2="5.49" y2="5.49" />
        </g>
      </svg>
    </button>
  );
}
