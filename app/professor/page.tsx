import type { Metadata } from "next";
import Link from "next/link";
import {
  IconCalendarEvent,
  IconChevronRight,
  IconFiles,
  IconSpeakerphone,
  type Icon,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/server";
import { buscarContadoresDashboard } from "@/lib/professor/queries";

export const metadata: Metadata = {
  title: "Ambiente do professor — 4K Vestibulares",
  description: "Ambiente do professor na Plataforma 4K.",
};

/** Saudação pela hora de Brasília (renderiza no servidor). */
function saudacaoBrasilia() {
  const hora = Number(
    new Intl.DateTimeFormat("pt-BR", {
      hour: "numeric",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    }).format(new Date()),
  );
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function ProfessorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: perfil }, contadores] = await Promise.all([
    supabase.from("usuarios").select("nome").eq("id", user!.id).single(),
    buscarContadoresDashboard(),
  ]);

  const primeiroNome = (perfil?.nome ?? "professor").trim().split(/\s+/)[0];

  return (
    <main id="conteudo" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-6">
        {/* Saudação */}
        <header>
          <p className="text-sm font-medium text-muted">Plataforma 4K</p>
          <h1 className="titulo-impacto mt-1 text-3xl text-ink sm:text-4xl">
            {saudacaoBrasilia()}, <span className="text-roxo">{primeiroNome}</span>
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
            Publique materiais, abra monitorias e mantenha os alunos avisados.
          </p>
        </header>

        {/* Contadores */}
        <section aria-label="Resumo" className="grid grid-cols-3 gap-3">
          <Contador
            Icone={IconFiles}
            valor={contadores.materiaisPublicados}
            rotulo="Materiais publicados"
          />
          <Contador
            Icone={IconCalendarEvent}
            valor={contadores.monitoriasAbertas}
            rotulo="Monitorias abertas"
          />
          <Contador
            Icone={IconSpeakerphone}
            valor={contadores.avisosAtivos}
            rotulo="Avisos ativos"
          />
        </section>

        {/* Atalhos */}
        <section aria-label="Gerenciar conteúdo" className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">Publicar conteúdo</h2>
          <ItemAtalho
            href="/professor/materiais"
            Icone={IconFiles}
            titulo="Materiais"
            descricao="Links, PDFs, vídeos e textos para as matérias."
          />
          <ItemAtalho
            href="/professor/monitorias"
            Icone={IconCalendarEvent}
            titulo="Monitorias"
            descricao="Abra horários e veja quem reservou vaga."
          />
          <ItemAtalho
            href="/professor/avisos"
            Icone={IconSpeakerphone}
            titulo="Avisos"
            descricao="Comunicados para todos os alunos ou por turma."
          />
        </section>
      </div>
    </main>
  );
}

function Contador({
  Icone,
  valor,
  rotulo,
}: {
  Icone: Icon;
  valor: number;
  rotulo: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface px-3 py-5 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl bg-surface-alt text-roxo">
        <Icone className="size-5" stroke={1.75} />
      </span>
      <p className="text-2xl font-extrabold leading-none text-ink">{valor}</p>
      <p className="text-xs leading-tight text-muted">{rotulo}</p>
    </div>
  );
}

function ItemAtalho({
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
        <p className="mt-0.5 text-sm leading-relaxed text-muted">{descricao}</p>
      </div>
      <IconChevronRight
        className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
        stroke={1.75}
      />
    </Link>
  );
}
