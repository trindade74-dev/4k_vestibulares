import type { Metadata } from "next";
import { IconClipboardText, IconInfoCircle } from "@tabler/icons-react";
import { buscarMeusSimulados } from "@/lib/aluno/queries";
import { Entrada } from "@/components/aluno/entrada";
import { SimuladoCardAcoes } from "@/components/aluno/simulado-card-acoes";
import type { SimuladoLista } from "@/lib/aluno/tipos";

export const metadata: Metadata = {
  title: "Simulados — 4K Vestibulares",
  description: "Seus simulados: inicie, continue e revise os resultados.",
};

const COTA_SEMANAL = 7;

export default async function SimuladosPage() {
  const simulados = await buscarMeusSimulados();
  const iniciados = simulados[0]?.iniciados_na_semana ?? 0;
  const cotaAtingida = iniciados >= COTA_SEMANAL;

  return (
    <main id="conteudo" className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Entrada className="flex flex-col gap-6">
        <header data-entrada>
          <p className="text-sm font-medium text-muted">Plataforma 4K</p>
          <h1 className="titulo-impacto mt-1 text-3xl text-ink sm:text-4xl">
            Simulados
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
            Provas completas com correção e espelho ao final. Você pode iniciar
            até {COTA_SEMANAL} por semana.
          </p>
        </header>

        {/* Cota semanal */}
        <div
          data-entrada
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            cotaAtingida
              ? "caixa-revisar"
              : "border-border bg-surface text-muted"
          }`}
        >
          <IconInfoCircle className="mt-0.5 size-5 shrink-0" stroke={1.75} />
          <div>
            <p className="font-medium">
              {iniciados}/{COTA_SEMANAL} simulados iniciados nesta semana
            </p>
            {cotaAtingida && (
              <p className="mt-0.5">
                Limite semanal atingido — novos liberam na segunda.
              </p>
            )}
          </div>
        </div>

        {simulados.length === 0 ? (
          <VazioSimulados />
        ) : (
          <ul className="flex flex-col gap-4" data-entrada>
            {simulados.map((s) => (
              <li key={s.id}>
                <CartaoSimulado simulado={s} cotaAtingida={cotaAtingida} />
              </li>
            ))}
          </ul>
        )}
      </Entrada>
    </main>
  );
}

function CartaoSimulado({
  simulado,
  cotaAtingida,
}: {
  simulado: SimuladoLista;
  cotaAtingida: boolean;
}) {
  const tentativaId = simulado.tentativa_id ?? null;
  const status = statusDe(simulado);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-ink">{simulado.titulo}</h2>
          {simulado.descricao && (
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {simulado.descricao}
            </p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-muted">
          {simulado.n_questoes} questões
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-ink">{status}</p>

      <SimuladoCardAcoes
        simuladoId={simulado.id}
        tentativaId={tentativaId}
        finalizada={simulado.finalizada}
        cotaAtingida={cotaAtingida}
      />
    </div>
  );
}

/** Texto de status derivado do estado da tentativa. */
function statusDe(s: SimuladoLista): string {
  if (!s.tentativa_id) return "Não iniciado";
  if (!s.finalizada) return "Em andamento";
  return `Concluído · ${s.acertos}/${s.n_questoes} acertos`;
}

function VazioSimulados() {
  return (
    <div
      data-entrada
      className="rounded-xl border border-border bg-surface p-10 text-center"
    >
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface-alt text-roxo">
        <IconClipboardText className="size-7" stroke={1.5} />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-ink">
        Nenhum simulado por enquanto
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Quando a coordenação publicar um simulado, ele aparece aqui para você
        fazer.
      </p>
    </div>
  );
}
