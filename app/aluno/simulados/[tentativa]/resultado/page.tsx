import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { buscarResultadoSimulado } from "@/lib/aluno/queries";
import { Espelho } from "@/components/aluno/espelho";

export const metadata: Metadata = {
  title: "Resultado do simulado — 4K Vestibulares",
  description: "Espelho da prova com gabarito e desempenho.",
};

export default async function ResultadoSimuladoPage({
  params,
}: {
  params: Promise<{ tentativa: string }>;
}) {
  const { tentativa } = await params;
  const itens = await buscarResultadoSimulado(tentativa);

  if (itens.length === 0) {
    return (
      <main
        id="conteudo"
        className="mx-auto max-w-md px-4 py-16 text-center sm:px-6"
      >
        <h1 className="text-lg font-semibold text-ink">
          Resultado indisponível
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Este resultado não pôde ser carregado. A prova pode não ter sido
          finalizada ou o link é inválido.
        </p>
        <Link
          href="/aluno/simulados"
          className="btn btn-contorno mt-6 inline-flex"
        >
          <IconArrowLeft className="size-4" stroke={1.75} />
          Voltar aos simulados
        </Link>
      </main>
    );
  }

  return <Espelho tentativaId={tentativa} itens={itens} />;
}
