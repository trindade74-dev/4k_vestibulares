"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconAlertTriangle } from "@tabler/icons-react";
import { iniciarSimulado } from "@/lib/aluno/actions";

type Props = {
  simuladoId: string;
  tentativaId: string | null;
  finalizada: boolean;
  /** Cota semanal esgotada (≥7): bloqueia iniciar/refazer. */
  cotaAtingida: boolean;
};

/**
 * Botões de ação de um cartão de simulado. Iniciar/Refazer criam (ou
 * recriam) a tentativa via `iniciarSimulado` e navegam para a prova;
 * Continuar apenas navega para a tentativa aberta. Ver resultado é link.
 */
export function SimuladoCardAcoes({
  simuladoId,
  tentativaId,
  finalizada,
  cotaAtingida,
}: Props) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function comecar() {
    if (pendente) return;
    setErro(null);
    iniciar(async () => {
      const r = await iniciarSimulado(simuladoId);
      if ("erro" in r) {
        setErro(r.erro);
        return;
      }
      router.push(`/aluno/simulados/${r.tentativaId}`);
    });
  }

  const emAndamento = tentativaId !== null && !finalizada;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {tentativaId === null && (
          <button
            type="button"
            onClick={comecar}
            disabled={pendente || cotaAtingida}
            className="btn btn-roxo flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pendente ? "Abrindo…" : "Iniciar"}
          </button>
        )}

        {emAndamento && (
          <Link
            href={`/aluno/simulados/${tentativaId}`}
            className="btn btn-roxo flex-1"
          >
            Continuar
          </Link>
        )}

        {finalizada && (
          <>
            <Link
              href={`/aluno/simulados/${tentativaId}/resultado`}
              className="btn btn-contorno flex-1"
            >
              Ver resultado
            </Link>
            <button
              type="button"
              onClick={comecar}
              disabled={pendente || cotaAtingida}
              className="btn btn-roxo flex-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pendente ? "Abrindo…" : "Refazer"}
            </button>
          </>
        )}
      </div>

      {erro && (
        <p className="caixa-revisar mt-3 flex items-start gap-2" role="alert">
          <IconAlertTriangle className="mt-0.5 size-4 shrink-0" stroke={1.75} />
          {erro}
        </p>
      )}
    </div>
  );
}
