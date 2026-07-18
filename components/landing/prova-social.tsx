import { IconCircleCheck } from "@tabler/icons-react";
import { Reveal } from "@/components/reveal";
import { WHATSAPP_URL } from "@/lib/links";

export function ProvaSocial() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 text-center md:px-8 md:py-28">
      <Reveal>
        <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Quem estuda na 4K, passa.
        </h2>
      </Reveal>

      <Reveal delay={80}>
        {/* Caixa de acerto (estilo original, sem grid — decisão do cliente):
            tokens de feedback "acerto" do DESIGN.md. */}
        <div className="mx-auto mt-8 max-w-lg rounded-xl border border-[var(--acerto-border)] bg-[var(--acerto-bg)] p-6">
          <p className="flex items-center justify-center gap-2.5 text-xl font-semibold text-[var(--acerto-text)] sm:text-2xl">
            <IconCircleCheck
              className="size-7 shrink-0 text-verde"
              aria-hidden
            />
            Mais de 120 aprovados na UnB
          </p>
          <p className="mt-1.5 text-xs text-[var(--acerto-text)] opacity-80">
            resultado comprovado e registrado em cartório
          </p>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <p className="mx-auto mt-6 max-w-lg text-base text-muted">
          Todo ano, dezenas de alunos da 4K conquistam a
          tão concorrida vaga na Universidade de Brasília.
        </p>
      </Reveal>

      <Reveal delay={200}>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-roxo mt-10 w-full sm:w-auto"
        >
          Fale com um orientador
        </a>
      </Reveal>
    </section>
  );
}
