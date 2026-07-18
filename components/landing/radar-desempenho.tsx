"use client";

import { useEffect, useRef } from "react";

/** Centro do radar no viewBox 120×110. */
const CENTRO_X = 60;
const CENTRO_Y = 55;

/** Vértices reais — valores distintos por matéria (polígono irregular). */
const VERTICES: ReadonlyArray<readonly [number, number]> = [
  [60, 19],
  [98.1, 33],
  [83.4, 68.5],
  [60, 87.5],
  [29.7, 72.5],
  [34, 40],
];

/** Duração da animação de CADA vértice. */
const DURACAO_MS = 450;
/** Atraso escalonado entre um vértice e o próximo (stagger). */
const ATRASO_MS = 100;
/** Fração mínima: os vértices nascem perto do centro, nunca do nada. */
const ESCALA_INICIAL = 0.08;

/** Progresso 0→1 vira escala geométrica (nunca colapsa a zero). */
function escalaDe(progresso: number): number {
  return ESCALA_INICIAL + (1 - ESCALA_INICIAL) * progresso;
}

/** Interpola cada vértice do centro até seu valor real, com progresso próprio. */
function pontosDe(progressos: readonly number[]): string {
  return VERTICES.map(([x, y], i) => {
    const s = escalaDe(progressos[i]);
    return `${(CENTRO_X + (x - CENTRO_X) * s).toFixed(2)},${(
      CENTRO_Y +
      (y - CENTRO_Y) * s
    ).toFixed(2)}`;
  }).join(" ");
}

/**
 * Radar "Desempenho por matéria" do preview do app.
 *
 * Animação por vértice (stagger assíncrono): cada um dos 6 vértices tem
 * progresso próprio, com ~100ms de atraso entre eles e ~450ms de duração
 * (ease-out cúbico) — o polígono cresce de forma visivelmente assíncrona.
 *
 * Gatilho: dispara na ABERTURA da página (se o radar estiver visível) e
 * a cada entrada/saída da viewport ao rolar, nos dois sentidos.
 *
 * Bidirecional: entrar na viewport → vértices crescem do centro; sair →
 * encolhem de volta (stagger reverso). Interrupções partem do progresso
 * atual de cada vértice, sem saltos.
 *
 * SSR e reduced-motion renderizam direto o estado final.
 */
export function RadarDesempenho() {
  const svgRef = useRef<SVGSVGElement>(null);
  const poligonoRef = useRef<SVGPolygonElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const poligono = poligonoRef.current;
    if (!svg || !poligono) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // SSR renderiza o estado final; com motion permitido, recolhemos
    // antes do primeiro frame para a entrada animar já na abertura.
    const progresso = VERTICES.map(() => 0);
    let raf = 0;

    const aplicar = () => {
      poligono.setAttribute("points", pontosDe(progresso));
    };

    /**
     * Anima todos os vértices até `alvo` (1 = cresce, 0 = encolhe),
     * partindo do progresso ATUAL de cada um — interromper no meio não
     * salta. Crescendo, o vértice 0 começa primeiro; encolhendo, o
     * stagger é reverso (o último a crescer é o primeiro a recuar).
     */
    const animarPara = (alvo: 0 | 1) => {
      cancelAnimationFrame(raf);
      const partida = [...progresso];
      const atrasos = VERTICES.map(
        (_, i) => (alvo === 1 ? i : VERTICES.length - 1 - i) * ATRASO_MS,
      );
      const inicio = performance.now();
      const passo = (agora: number) => {
        let pendente = false;
        for (let i = 0; i < progresso.length; i++) {
          const t = (agora - inicio - atrasos[i]) / DURACAO_MS;
          if (t < 0) {
            pendente = true; // ainda no atraso: segura o valor de partida
            continue;
          }
          const clampado = Math.min(1, t);
          const suave = 1 - Math.pow(1 - clampado, 3); // ease-out cúbico
          progresso[i] = partida[i] + (alvo - partida[i]) * suave;
          if (clampado < 1) pendente = true;
        }
        aplicar();
        if (pendente) raf = requestAnimationFrame(passo);
      };
      raf = requestAnimationFrame(passo);
    };

    // Recolhe antes do primeiro frame; o observer decide o resto.
    aplicar();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Visível (na abertura ou rolando em qualquer sentido) →
          // cresce; fora da viewport → encolhe de volta ao centro.
          animarPara(entry.isIntersecting ? 1 : 0);
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(svg);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 120 110"
      className="h-20 w-auto shrink-0 sm:h-24"
    >
      {/* Trama de fundo do radar (estática) */}
      <polygon
        points="60,5 103.3,30 103.3,80 60,105 16.7,80 16.7,30"
        fill="none"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <polygon
        points="60,23 87.7,39 87.7,71 60,87 32.3,71 32.3,39"
        fill="none"
        stroke="var(--border)"
        strokeWidth="1"
      />
      {/* Polígono de desempenho: cresce do centro até os valores reais */}
      <polygon
        ref={poligonoRef}
        points={pontosDe(VERTICES.map(() => 1))}
        fill="var(--roxo-4k)"
        fillOpacity={0.22}
        stroke="var(--roxo-4k)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
