"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Envolve o conteúdo do dashboard e faz a entrada em cascata (fade + rise)
 * dos filhos marcados com `data-entrada`. Sob prefers-reduced-motion nada
 * roda: os elementos ficam no estado final. GSAP só toca transform/opacity.
 */
export function Entrada({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-entrada]", {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
