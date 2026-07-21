"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Desempenho } from "@/lib/aluno/tipos";

gsap.registerPlugin(useGSAP);

/** Geometria do radar (viewBox 240×240). */
const CX = 120;
const CY = 120;
const RAIO_MAX = 82;
const RAIO_ROTULO = 104;
/** Anéis de referência (fração do raio): 33% / 66% / 100%. */
const ANEIS = [1, 0.66, 0.33];

/** Abreviação curta e estável por matéria (fallback: 3 primeiras letras). */
const ABREV: Record<string, string> = {
  matematica: "Mat",
  portugues: "Port",
  biologia: "Bio",
  quimica: "Quí",
  fisica: "Fís",
  historia: "Hist",
  geografia: "Geo",
  redacao: "Red",
};

function abreviar(nome: string): string {
  const chave = nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
  return ABREV[chave] ?? nome.slice(0, 3);
}

/** Ângulo do eixo i (topo = -90°, sentido horário). */
function anguloDe(i: number, n: number): number {
  return (-90 + (i * 360) / n) * (Math.PI / 180);
}

function ponto(i: number, n: number, raio: number): [number, number] {
  const a = anguloDe(i, n);
  return [CX + raio * Math.cos(a), CY + raio * Math.sin(a)];
}

/** String de pontos do polígono de desempenho para uma lista de progressos 0→1. */
function pontosDesempenho(valores: Desempenho[], progressos: number[]): string {
  const n = valores.length;
  return valores
    .map((v, i) => {
      const raio = RAIO_MAX * (Math.max(0, Math.min(100, v.percentual)) / 100) * progressos[i];
      const [x, y] = ponto(i, n, raio);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function pontosAnel(n: number, fracao: number): string {
  return Array.from({ length: n }, (_, i) => {
    const [x, y] = ponto(i, n, RAIO_MAX * fracao);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

/**
 * Radar de desempenho por matéria — N eixos (aqui 8), por trigonometria.
 * O polígono cresce do centro até cada valor com stagger por vértice; sob
 * prefers-reduced-motion (ou SSR) já entra no estado final. Só tokens de cor.
 */
export function RadarDesempenho({ valores }: { valores: Desempenho[] }) {
  const raizRef = useRef<SVGSVGElement>(null);
  const poligonoRef = useRef<SVGPolygonElement>(null);
  const n = valores.length;

  useGSAP(
    () => {
      const poligono = poligonoRef.current;
      if (!poligono || n === 0) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const proxies = valores.map(() => ({ v: 0 }));
        const render = () => {
          poligono.setAttribute(
            "points",
            pontosDesempenho(valores, proxies.map((p) => p.v)),
          );
        };
        render(); // recolhe ao centro antes do primeiro frame
        gsap.to(proxies, {
          v: 1,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.06,
          onUpdate: render,
        });
      });

      return () => mm.revert();
    },
    { scope: raizRef, dependencies: [valores] },
  );

  const resumoA11y = valores
    .map((v) => `${v.materia_nome} ${Math.round(v.percentual)}%`)
    .join(", ");

  return (
    <svg
      ref={raizRef}
      viewBox="0 0 240 240"
      className="h-full w-full"
      role="img"
      aria-label={`Radar de desempenho por matéria: ${resumoA11y}.`}
    >
      {/* Anéis de referência */}
      {ANEIS.map((f) => (
        <polygon
          key={f}
          points={pontosAnel(n, f)}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}

      {/* Eixos radiais até cada vértice */}
      {valores.map((v, i) => {
        const [x, y] = ponto(i, n, RAIO_MAX);
        return (
          <line
            key={v.materia_id}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke="var(--border)"
            strokeWidth="1"
          />
        );
      })}

      {/* Polígono de desempenho (estado final no SSR/no-motion) */}
      <polygon
        ref={poligonoRef}
        points={pontosDesempenho(
          valores,
          valores.map(() => 1),
        )}
        fill="var(--roxo-4k)"
        fillOpacity={0.22}
        stroke="var(--roxo-4k)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Rótulos curtos das matérias nos vértices */}
      <g className="text-muted" fontSize="11" fontWeight={600}>
        {valores.map((v, i) => {
          const [x, y] = ponto(i, n, RAIO_ROTULO);
          const cos = Math.cos(anguloDe(i, n));
          const anchor = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
          return (
            <text
              key={v.materia_id}
              x={x.toFixed(1)}
              y={y.toFixed(1)}
              fill="currentColor"
              textAnchor={anchor}
              dominantBaseline="middle"
            >
              {abreviar(v.materia_nome)}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
