"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Atraso em ms para escalonar entradas (30 a 150ms entre irmãos). */
  delay?: number;
  className?: string;
};

/**
 * Entrada por IntersectionObserver: fade + translate curto.
 * O CSS (.reveal) desliga tudo sob prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
