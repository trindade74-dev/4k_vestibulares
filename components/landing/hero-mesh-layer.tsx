"use client";

import { useParallaxRef } from "@/components/scroll-parallax";

/**
 * Camada real do mesh do hero (antes era `.hero-mesh::before`, pseudo-elemento
 * estático — comentário original em globals.css explicava isso por
 * performance). Precisa ser um nó DOM de verdade para receber `transform`
 * via GSAP: aqui ela se desloca mais devagar que o conteúdo enquanto a
 * seção rola, dando profundidade de fundo (parallax clássico). O véu
 * `.hero-mesh::after` continua estático em pseudo-elemento — não precisa
 * de camada própria.
 */
export function HeroMeshLayer() {
  const ref = useParallaxRef({ speed: 0.1 });
  return <div ref={ref} aria-hidden className="hero-mesh-layer" />;
}
