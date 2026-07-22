import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createElement } from "react";
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconChevronRight,
  IconFiles,
  IconTargetArrow,
  type Icon,
} from "@tabler/icons-react";
import { buscarDesempenho, buscarMateria } from "@/lib/aluno/queries";
import { iconeDaMateria } from "@/lib/aluno/materia-icones";
import { Entrada } from "@/components/aluno/entrada";
import { BarraProgresso } from "@/components/aluno/barra-progresso";

type Params = { materiaId: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { materiaId } = await params;
  const materia = await buscarMateria(materiaId);
  return {
    title: materia
      ? `${materia.nome} — 4K Vestibulares`
      : "Matéria — 4K Vestibulares",
    description:
      "Pratique questões, marque monitoria e acesse o material do professor.",
  };
}

/**
 * Hub da matéria: cabeçalho com desempenho + 3 sub-áreas (questões,
 * monitoria, material). O card de desempenho reaproveita a mesma
 * superfície de destaque do card de matéria no dashboard (grid nos
 * dois temas, DESIGN.md regra 3) — é a versão expandida daquele card.
 */
export default async function MateriaHubPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { materiaId } = await params;
  const [materia, desempenho] = await Promise.all([
    buscarMateria(materiaId),
    buscarDesempenho(),
  ]);
  if (!materia) notFound();

  const Icone = iconeDaMateria(materia.nome);
  const minhaLinha = desempenho.find((m) => m.materia_id === materiaId);
  const pct = minhaLinha ? Math.round(minhaLinha.percentual) : 0;

  return (
    <main id="conteudo" className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Entrada className="flex flex-col gap-6">
        <div data-entrada>
          <Link
            href="/aluno"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <IconArrowLeft className="size-4" stroke={1.75} />
            Voltar ao início
          </Link>
        </div>

        {/* Cabeçalho — versão expandida do card de matéria do dashboard */}
        <header
          data-entrada
          className="surface-destaque grid-surface flex items-center gap-4 rounded-xl border border-[var(--destaque-border)] p-5 sm:p-6"
        >
          <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-roxo">
            {createElement(Icone, { className: "size-8 text-on-dark", stroke: 1.75 })}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="titulo-impacto text-2xl text-destaque-ink sm:text-3xl">
              {materia.nome}
            </h1>
            <p className="mt-1 text-sm text-destaque-muted">
              {minhaLinha && minhaLinha.total > 0
                ? `${pct}% de acerto · ${minhaLinha.acertos}/${minhaLinha.total} questões`
                : "Ainda sem questões respondidas nesta matéria"}
            </p>
            <BarraProgresso percentual={pct} />
          </div>
        </header>

        {/* Sub-áreas */}
        <section
          aria-label={`Áreas de ${materia.nome}`}
          data-entrada
          className="flex flex-col gap-3"
        >
          <CardNav
            href={`/aluno/materias/${materiaId}/questoes`}
            Icone={IconTargetArrow}
            titulo="Praticar questões"
            descricao="Responda questões desta matéria com correção na hora."
          />
          <CardNav
            href={`/aluno/materias/${materiaId}/monitoria`}
            Icone={IconCalendarEvent}
            titulo="Monitoria"
            descricao="Veja horários disponíveis e reserve sua vaga."
          />
          <CardNav
            href={`/aluno/materias/${materiaId}/material`}
            Icone={IconFiles}
            titulo="Material do professor"
            descricao="Links, PDFs, vídeos e textos publicados pelo professor."
          />
        </section>
      </Entrada>
    </main>
  );
}

function CardNav({
  href,
  Icone,
  titulo,
  descricao,
}: {
  href: string;
  Icone: Icon;
  titulo: string;
  descricao: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-roxo"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-roxo">
        <Icone className="size-6" stroke={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{titulo}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted">
          {descricao}
        </p>
      </div>
      <IconChevronRight
        className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
        stroke={1.75}
      />
    </Link>
  );
}
