import {
  IconClipboardCheck,
  IconSchool,
  IconTrophy,
  IconUserCheck,
  IconUsersGroup,
  IconWriting,
} from "@tabler/icons-react";
import { Reveal } from "@/components/reveal";
import { WHATSAPP_URL } from "@/lib/links";

const PILARES = [
  {
    icone: IconTrophy,
    titulo: "Maior índice de aprovação na UnB",
    texto:
      "O método existe para um único fim: colocar o seu nome na lista de aprovados.",
  },
  {
    icone: IconUsersGroup,
    titulo: "Turmas segmentadas",
    texto: "PAS, ENEM e MED: cada turma estuda exatamente o que a prova cobra.",
  },
  {
    icone: IconSchool,
    titulo: "Professores especialistas",
    texto: "Time que domina as bancas e ensina o caminho mais curto até a vaga.",
  },
  {
    icone: IconWriting,
    titulo: "Correções ilimitadas de redação",
    texto: "Escreva quantas vezes precisar. Cada texto volta corrigido e comentado.",
  },
  {
    icone: IconClipboardCheck,
    titulo: "Simulados semanais",
    texto: "Treino no ritmo da prova real, com resultado publicado toda semana.",
  },
  {
    icone: IconUserCheck,
    titulo: "Acompanhamento personalizado",
    texto: "Seu desempenho é acompanhado de perto, matéria por matéria.",
  },
];

export function Metodo() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            A fórmula da aprovação tem método. A 4K te apresenta ela agora:
          </h2>
        </Reveal>

        {/* Grade 3×2: seis cards da MESMA família, todos theme-aware. */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILARES.map((pilar, i) => (
            <Reveal key={pilar.titulo} delay={60 * i}>
              <div className="h-full rounded-xl border border-border bg-bg p-7 transition-transform duration-200 ease-out hover:-translate-y-0.5">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-roxo">
                  <pilar.icone
                    className="size-5 text-on-dark"
                    stroke={1.75}
                    aria-hidden
                  />
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">
                  {pilar.titulo}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{pilar.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-12 flex justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-contorno w-full sm:w-auto"
            >
              Quero estudar na 4K
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
