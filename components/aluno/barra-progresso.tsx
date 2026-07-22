"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Barra de progresso do card de matéria: a largura final já reflete o
 * percentual (inline style, igual antes — mantém o valor correto mesmo
 * sem JS/SSR). A animação de "crescer" ao entrar na viewport é feita via
 * `scaleX` (transform, não `width`) para não disparar layout — GSAP anima
 * só transform/opacity. Dispara uma única vez (`once`), não é scrub.
 */
export function BarraProgresso({ percentual }: { percentual: number }) {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const barraRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const trilho = trilhoRef.current;
      const barra = barraRef.current;
      if (!trilho || !barra) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          barra,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: trilho,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: trilhoRef, dependencies: [percentual] },
  );

  return (
    <div
      ref={trilhoRef}
      className="mt-2.5 h-1.5 rounded-full bg-[var(--destaque-track)]"
    >
      <div
        ref={barraRef}
        className="h-full origin-left rounded-full bg-verde"
        style={{ width: `${percentual}%` }}
      />
    </div>
  );
}
