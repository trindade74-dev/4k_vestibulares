import Image from "next/image";
import { IconCircleCheck } from "@tabler/icons-react";
import { Reveal } from "@/components/reveal";
import { ResultadosImagemParallax } from "@/components/landing/resultados-imagem-parallax";

const CONQUISTAS = [
  "Mais de 120 aprovados na UnB em 2025",
  "A metodologia mais eficiente de Brasília",
  "Correções de redação e resultados de simulados publicados semanalmente",
];

export function Resultados() {
  return (
    <section className="surface-destaque grid-surface relative overflow-hidden">
      {/* Glow roxo-profundo só existe no tema escuro (token transparente no claro) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_0%_100%,var(--destaque-glow)_0%,transparent_60%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-destaque-ink sm:text-4xl">
              O pré-vestibular que mais aprova na UnB em Brasília
            </h2>
          </Reveal>
          <ul className="mt-8 space-y-4">
            {CONQUISTAS.map((item, i) => (
              <Reveal key={item} delay={80 * (i + 1)}>
                <li className="flex items-start gap-3">
                  {/* verde marca o acerto: aprovação conquistada */}
                  <IconCircleCheck
                    className="mt-0.5 size-6 shrink-0 text-verde"
                    aria-hidden
                  />
                  <span className="text-base text-destaque-muted">{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={120}>
          <ResultadosImagemParallax>
            <figure>
              <Image
                src="/images/imagem02.png"
                alt="Turma de aprovados da 4K com o nome do curso escrito nos braços em comemoração"
                width={676}
                height={412}
                sizes="(min-width: 1024px) 520px, 90vw"
                className="w-full rounded-xl border border-[var(--destaque-border)] object-cover"
              />
              <figcaption className="mt-3 text-sm text-destaque-muted">
                Aprovados da turma 2025 no dia do resultado da UnB.
              </figcaption>
            </figure>
          </ResultadosImagemParallax>
        </Reveal>
      </div>
    </section>
  );
}
