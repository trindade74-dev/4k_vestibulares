import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft, IconFiles } from "@tabler/icons-react";
import { buscarMateria, buscarMateriaisDaMateria } from "@/lib/aluno/queries";
import { Entrada } from "@/components/aluno/entrada";
import { MaterialCard } from "@/components/aluno/material-card";

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
      ? `Material de ${materia.nome} — 4K Vestibulares`
      : "Material do professor — 4K Vestibulares",
    description: "Links, PDFs, vídeos e textos publicados pelo professor.",
  };
}

export default async function MaterialDaMateriaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { materiaId } = await params;
  const materia = await buscarMateria(materiaId);
  if (!materia) notFound();

  const materiais = await buscarMateriaisDaMateria(materiaId);

  return (
    <main id="conteudo" className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Entrada className="flex flex-col gap-6">
        <div data-entrada>
          <Link
            href={`/aluno/materias/${materiaId}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <IconArrowLeft className="size-4" stroke={1.75} />
            Voltar a {materia.nome}
          </Link>
        </div>

        <header data-entrada>
          <p className="text-sm font-medium text-muted">{materia.nome}</p>
          <h1 className="titulo-impacto mt-1 text-3xl text-ink sm:text-4xl">
            Material do professor
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
            Conteúdo complementar publicado pelo professor desta matéria.
          </p>
        </header>

        {materiais.length === 0 ? (
          <VazioMaterial />
        ) : (
          <ul className="flex flex-col gap-3" data-entrada>
            {materiais.map((m) => (
              <li key={m.id}>
                <MaterialCard material={m} />
              </li>
            ))}
          </ul>
        )}
      </Entrada>
    </main>
  );
}

function VazioMaterial() {
  return (
    <div
      data-entrada
      className="rounded-xl border border-border bg-surface p-10 text-center"
    >
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface-alt text-roxo">
        <IconFiles className="size-7" stroke={1.5} />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-ink">
        Nenhum material publicado ainda
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Quando o professor publicar material desta matéria, ele aparece
        aqui.
      </p>
    </div>
  );
}
