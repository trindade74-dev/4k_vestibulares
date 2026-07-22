"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Primeiro (e único) lugar do projeto que registra o ScrollTrigger.
gsap.registerPlugin(useGSAP, ScrollTrigger);

type ParallaxTarget = RefObject<HTMLElement | null> | HTMLElement | string;

export type ParallaxOptions = {
  /**
   * Fração da altura da viewport que o elemento percorre entre o início e o
   * fim do trigger. Valores baixos (0.05–0.25) = parallax sutil (camadas de
   * fundo devem usar menos que camadas de meio-plano). Negativo inverte a
   * direção.
   */
  speed?: number;
  /** Elemento/seletor que define o intervalo de scroll. Padrão: o próprio alvo. */
  trigger?: ParallaxTarget;
  start?: string;
  end?: string;
  /** scrub do ScrollTrigger (true = acompanha 1:1; número = "atraso" em segundos). */
  scrub?: boolean | number;
  /**
   * Largura mínima para o parallax rodar (DESIGN.md: mobile tolera menos
   * movimento de scroll). Abaixo disso o elemento fica estático.
   */
  minWidth?: number;
};

function resolveTarget(target: ParallaxTarget | undefined, fallback: Element): Element | string {
  if (!target) return fallback;
  if (typeof target === "string") return target;
  if ("current" in target) return target.current ?? fallback;
  return target;
}

/**
 * Aplica um parallax vertical contínuo (scrub) a um elemento via
 * ScrollTrigger — camada ADICIONAL de profundidade por cima da entrada
 * IntersectionObserver do <Reveal>, não a substitui.
 *
 * Só roda quando `(min-width: minWidth)` E `prefers-reduced-motion:
 * no-preference` casam (gsap.matchMedia) — mobile e reduced-motion ficam
 * estáticos. Cleanup é escopado ao componente via mm.revert()/useGSAP, nunca
 * mata ScrollTriggers de outros componentes.
 *
 * Anima só `transform` (via `y`), nunca posição em pixel absoluto — seguro
 * mesmo com o `zoom: 1.1` global em >=768px (globals.css), já que o
 * ScrollTrigger lê o layout já escalado pelo navegador.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  {
    speed = 0.2,
    trigger,
    start = "top bottom",
    end = "bottom top",
    scrub = true,
    minWidth = 768,
  }: ParallaxOptions = {},
) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(
        `(min-width: ${minWidth}px) and (prefers-reduced-motion: no-preference)`,
        () => {
          const tween = gsap.to(el, {
            y: () => -window.innerHeight * speed,
            ease: "none",
            scrollTrigger: {
              trigger: resolveTarget(trigger, el),
              start,
              end,
              scrub,
              invalidateOnRefresh: true,
            },
          });

          // Cleanup específico deste tween/trigger — não afeta outros.
          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: ref, dependencies: [speed, start, end, scrub, minWidth] },
  );
}

/**
 * Variante para quando o alvo do parallax é o próprio nó raiz do componente
 * (evita duplicar `useRef` + `useParallax` nos casos simples).
 */
export function useParallaxRef(options?: ParallaxOptions) {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref, options);
  return ref;
}
