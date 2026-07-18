"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { Reveal } from "@/components/reveal";

type Depoimento = {
  /** ID do vídeo no YouTube (Shorts, formato vertical 9:16). */
  id: string;
  /** Legenda opcional exibida sob o card. */
  legenda?: string;
};

/** Para adicionar depoimentos, basta incluir novos IDs aqui. */
const DEPOIMENTOS: Depoimento[] = [
  { id: "fbNBrsBzuWU" },
  { id: "srx8znrf37E" },
];

/**
 * Carrossel de depoimentos em vídeo (YouTube Shorts) com facade pattern:
 * o iframe só carrega depois do clique no play — antes disso o card é
 * apenas thumbnail + botão, sem custo de rede do player.
 */
export function Depoimentos() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [tocando, setTocando] = useState<Record<string, boolean>>({});

  /**
   * Marca o slide ativo e desmonta o player dos vídeos que saíram de cena:
   * ao navegar, só o vídeo ativo pode continuar tocando — os demais voltam
   * a thumbnail (o som para junto com o iframe).
   */
  const definirAtivo = (indice: number) => {
    setAtivo(indice);
    setTocando((atual) => {
      const idAtivo = DEPOIMENTOS[indice]?.id;
      const tocandoAgora = Object.keys(atual).filter((id) => atual[id]);
      if (tocandoAgora.length === 0) return atual;
      if (tocandoAgora.length === 1 && tocandoAgora[0] === idAtivo)
        return atual;
      return idAtivo && atual[idAtivo] ? { [idAtivo]: true } : {};
    });
  };

  const irPara = (indice: number) => {
    const track = trackRef.current;
    if (!track) return;
    const primeiro = track.children[0] as HTMLElement | undefined;
    const alvo = track.children[indice] as HTMLElement | undefined;
    if (!primeiro || !alvo) return;
    definirAtivo(indice);
    // scroll-behavior fica com o CSS (.carrossel-track), que respeita
    // prefers-reduced-motion.
    track.scrollTo({ left: alvo.offsetLeft - primeiro.offsetLeft });
  };

  const aoRolar = () => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return;
    const primeiro = track.children[0] as HTMLElement;
    const segundo = track.children[1] as HTMLElement;
    const passo = segundo.offsetLeft - primeiro.offsetLeft;
    if (passo <= 0) return;
    const indice = Math.min(
      DEPOIMENTOS.length - 1,
      Math.max(0, Math.round(track.scrollLeft / passo)),
    );
    if (indice !== ativo) definirAtivo(indice);
  };

  return (
    <section
      aria-label="Depoimentos em vídeo de alunos aprovados"
      className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28"
    >
      <Reveal>
        <h2 className="mx-auto max-w-2xl text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Quem passou, conta
        </h2>
      </Reveal>
      <Reveal delay={80}>
        <p className="mx-auto mt-4 max-w-lg text-center text-base text-muted">
          Depoimentos em vídeo de quem estudou na 4K até ver o nome na lista.
        </p>
      </Reveal>

      <Reveal delay={140}>
        {/* Trilho com a largura de UM card: em repouso só o vídeo ativo é
            visível — o vizinho fica fora do recorte até a navegação. */}
        <div className="relative mx-auto mt-12 w-full max-w-[340px]">
          <div
            ref={trackRef}
            onScroll={aoRolar}
            className="carrossel-track flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
          >
            {DEPOIMENTOS.map((depoimento, i) => (
              <figure
                key={depoimento.id}
                className="w-full shrink-0 snap-center"
              >
                <div className="card-depoimento relative aspect-[9/16]">
                  {tocando[depoimento.id] ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${depoimento.id}?autoplay=1&playsinline=1&rel=0`}
                      title={`Depoimento em vídeo ${i + 1} de aluno aprovado da 4K`}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 size-full border-0"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setTocando((atual) => ({
                          ...atual,
                          [depoimento.id]: true,
                        }))
                      }
                      aria-label={`Assistir depoimento ${i + 1} de aluno aprovado da 4K`}
                      className="group absolute inset-0 cursor-pointer"
                    >
                      <Image
                        src={`https://i.ytimg.com/vi/${depoimento.id}/oardefault.jpg`}
                        alt=""
                        fill
                        sizes="(min-width: 400px) 340px, 92vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                      <span
                        aria-hidden
                        className="card-depoimento-veu absolute inset-0"
                      />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="flex size-14 items-center justify-center rounded-full bg-roxo text-on-dark shadow-lg transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95">
                          <IconPlayerPlayFilled
                            className="size-6 translate-x-0.5"
                            aria-hidden
                          />
                        </span>
                      </span>
                    </button>
                  )}
                </div>
                {depoimento.legenda && (
                  <figcaption className="mt-3 text-center text-sm text-muted">
                    {depoimento.legenda}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>

          {/* Setas em todos os breakpoints (clique + swipe convivem). No
              mobile elas cavalgam a borda do card para não sair da tela.
              Loop infinito: do último volta ao primeiro e vice-versa (wrap
              via scrollTo para o extremo oposto), então nunca ficam
              disabled. */}
          <button
            type="button"
            onClick={() =>
              irPara((ativo - 1 + DEPOIMENTOS.length) % DEPOIMENTOS.length)
            }
            aria-label="Vídeo anterior"
            className="absolute -left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-ink shadow-md md:-left-6 lg:-left-16"
          >
            <IconChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => irPara((ativo + 1) % DEPOIMENTOS.length)}
            aria-label="Próximo vídeo"
            className="absolute -right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-ink shadow-md md:-right-6 lg:-right-16"
          >
            <IconChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </Reveal>

      {/* Indicadores de posição (alvo de toque 44px, ponto visual menor) */}
      <div className="mt-4 flex justify-center">
        {DEPOIMENTOS.map((depoimento, i) => (
          <button
            key={depoimento.id}
            type="button"
            onClick={() => irPara(i)}
            aria-label={`Ir para o vídeo ${i + 1}`}
            aria-current={ativo === i ? "true" : undefined}
            className="grid size-11 place-items-center"
          >
            <span
              className={`size-2 rounded-full transition-colors duration-200 ${
                ativo === i ? "bg-roxo" : "bg-border"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
