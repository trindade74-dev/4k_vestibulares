"use client";

import type { ReactNode } from "react";
import { useParallaxRef } from "@/components/scroll-parallax";

/**
 * Dá ao preview do app (dentro do <Reveal> existente) um deslocamento
 * vertical leve em ritmo diferente do texto do H1/CTAs conforme a seção
 * sai de cena — sutil de propósito, é área "above the fold". Não interfere
 * na entrada IntersectionObserver do Reveal: são dois nós DOM distintos
 * (este componente envolve o AppPreview por dentro do Reveal).
 */
export function HeroPreviewParallax({ children }: { children: ReactNode }) {
  const ref = useParallaxRef({ speed: 0.18 });
  return <div ref={ref}>{children}</div>;
}
