"use client";

import type { ReactNode } from "react";
import { useParallaxRef } from "@/components/scroll-parallax";

/**
 * A foto da seção Resultados se move mais devagar que o texto ao redor
 * conforme a seção passa pela tela (a foto "atrasa" em relação ao scroll).
 * Envolve o <figure> por dentro do <Reveal> existente — não substitui a
 * entrada, só adiciona o movimento contínuo por cima dela.
 */
export function ResultadosImagemParallax({ children }: { children: ReactNode }) {
  const ref = useParallaxRef({ speed: 0.15 });
  return <div ref={ref}>{children}</div>;
}
