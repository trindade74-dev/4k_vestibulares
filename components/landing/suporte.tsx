import {
  IconClipboardCheck,
  IconUserCheck,
  IconWriting,
} from "@tabler/icons-react";
import { Reveal } from "@/components/reveal";
import { WHATSAPP_URL } from "@/lib/links";

const SUPORTES = [
  {
    icone: IconClipboardCheck,
    titulo: "Simulados semanais",
    texto: "Você chega no dia da prova já sabendo como ela funciona.",
  },
  {
    icone: IconWriting,
    titulo: "Correções ilimitadas de redação",
    texto: "Sem limite de envios até a sua nota chegar onde precisa.",
  },
  {
    icone: IconUserCheck,
    titulo: "Acompanhamento individualizado",
    texto: "Ninguém estuda sozinho: seu progresso tem nome e plano.",
  },
];

export function Suporte() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 text-center md:px-8 md:py-28">
      <Reveal>
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Todo suporte pedagógico para sua aprovação
        </h2>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-4xl gap-10 text-left sm:grid-cols-3 sm:gap-8">
        {SUPORTES.map((item, i) => (
          <Reveal key={item.titulo} delay={70 * i}>
            <div className="flex flex-col items-start sm:items-center sm:text-center">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-surface-alt text-roxo">
                <item.icone className="size-6" stroke={1.75} aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink">
                {item.titulo}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{item.texto}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={160}>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-verde mt-14 w-full sm:w-auto"
        >
          Quero garantir minha vaga
        </a>
      </Reveal>
    </section>
  );
}
