import type { Metadata } from "next";
import { IconBell, IconStar } from "@tabler/icons-react";
import { buscarAvisos } from "@/lib/aluno/queries";
import { marcarAvisosVistos } from "@/lib/aluno/actions";
import { Entrada } from "@/components/aluno/entrada";
import type { Aviso } from "@/lib/aluno/tipos";

export const metadata: Metadata = {
  title: "Avisos — 4K Vestibulares",
  description: "Comunicados da coordenação e dos professores.",
};

const FORMATADOR_DATA = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export default async function AvisosPage() {
  // Marca como vistos ANTES de listar: zera o badge do sino ao abrir a tela.
  await marcarAvisosVistos();
  const avisos = await buscarAvisos(20);

  return (
    <main id="conteudo" className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Entrada className="flex flex-col gap-6">
        <header data-entrada>
          <p className="text-sm font-medium text-muted">Plataforma 4K</p>
          <h1 className="titulo-impacto mt-1 text-3xl text-ink sm:text-4xl">
            Avisos
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
            Comunicados da coordenação e dos professores.
          </p>
        </header>

        {avisos.length === 0 ? (
          <VazioAvisos />
        ) : (
          <ul className="flex flex-col gap-3" data-entrada>
            {avisos.map((a) => (
              <li key={a.id}>
                <CartaoAviso aviso={a} />
              </li>
            ))}
          </ul>
        )}
      </Entrada>
    </main>
  );
}

/** Aviso importante ganha borda roxa reforçada — verde é reservado a ação/acerto. */
function CartaoAviso({ aviso }: { aviso: Aviso }) {
  return (
    <div
      className={
        aviso.importante
          ? "rounded-xl border-2 border-roxo bg-surface p-5"
          : "rounded-xl border border-border bg-surface p-5"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-ink">{aviso.titulo}</h2>
        {aviso.importante && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-roxo">
            <IconStar className="size-3.5" stroke={1.75} />
            Importante
          </span>
        )}
      </div>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">
        {aviso.corpo}
      </p>
      <p className="mt-3 text-xs text-muted">
        {FORMATADOR_DATA.format(new Date(aviso.publicado_em))}
      </p>
    </div>
  );
}

function VazioAvisos() {
  return (
    <div
      data-entrada
      className="rounded-xl border border-border bg-surface p-10 text-center"
    >
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface-alt text-roxo">
        <IconBell className="size-7" stroke={1.5} />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-ink">
        Nenhum aviso por enquanto
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Quando a coordenação ou um professor publicar um aviso, ele aparece
        aqui.
      </p>
    </div>
  );
}
