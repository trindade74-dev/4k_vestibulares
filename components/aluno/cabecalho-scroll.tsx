"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Envolve o cabeçalho de saudação do dashboard do aluno com uma profundidade
 * sutil ao rolar: leve fade + translate conforme o bloco sai por cima da
 * tela. Não há hero tradicional aqui, então isso funciona como "sticky-ish
 * depth" em vez de parallax de imagem. Só roda em >=768px e
 * prefers-reduced-motion: no-preference; não interfere na entrada em
 * cascata do <Entrada> (propriedades animadas aqui só entram em jogo depois
 * que o usuário rola, a entrada já terminou nesse ponto).
 */
export function CabecalhoScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const tween = gsap.to(el, {
            y: -18,
            opacity: 0.7,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
