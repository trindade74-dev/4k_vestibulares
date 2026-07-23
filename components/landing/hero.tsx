import Link from "next/link";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { Reveal } from "@/components/reveal";
import { AppPreview } from "@/components/landing/app-preview";
import { HeroMeshLayer } from "@/components/landing/hero-mesh-layer";
import { HeroPreviewParallax } from "@/components/landing/hero-preview-parallax";
import { WHATSAPP_URL } from "@/lib/links";

export function Hero() {
  return (
    <section className="hero-mesh">
      <HeroMeshLayer />
      {/* pt compensa a navbar fixa (h-16) */}
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-28 text-center md:px-8 md:pt-36">
        <Reveal>
          <h1 className="mx-auto max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-on-dark sm:text-5xl lg:text-[3.4rem]">
            O curso pré-vestibular com o maior número de aprovados na UnB está
            em Taguatinga.
          </h1>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/matricula" className="pill pill-verde w-full sm:w-auto">
              Matricular-se
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-glass w-full sm:w-auto"
            >
              <IconBrandWhatsapp className="size-5" aria-hidden />
              WhatsApp
            </a>
          </div>
        </Reveal>

        {/* Preview da plataforma, cortado pela dobra do hero */}
        <Reveal
          delay={180}
          className="-mb-4 mt-14 w-full max-w-4xl sm:-mb-5 md:mt-20"
        >
          <HeroPreviewParallax>
            <AppPreview />
          </HeroPreviewParallax>
        </Reveal>
      </div>
    </section>
  );
}
