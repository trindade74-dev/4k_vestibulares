"use client";

import { IconArrowRight, IconCircleCheck, IconX } from "@tabler/icons-react";
import type { Alternativa, TipoQuestao } from "@/lib/aluno/tipos";

/** Resultado revelado (só no modo revisão): gabarito + o que o aluno marcou. */
export type ResultadoQuestao = {
  gabarito: string;
  resposta_aluno: string | null;
  acertou: boolean | null;
};

type Props = {
  contexto: string | null;
  tipo_questao: TipoQuestao;
  enunciado: string;
  /** Vazio para `certo_errado` — o componente sintetiza Certo/Errado. */
  alternativas: Alternativa[];
  /** Opção marcada no momento (`a`…`e` ou `c`/`e` para certo/errado). */
  escolha: string | null;
  /** Chamado ao marcar uma opção. Ausente/omitido bloqueia interação. */
  onEscolha?: (id: string) => void;
  modo: "respondendo" | "revisao";
  resultado?: ResultadoQuestao;
  /** Desabilita as opções (ex.: enquanto salva). */
  desabilitado?: boolean;
};

/** Acima deste tamanho, o texto-base entra colapsável para não empurrar a questão. */
const LIMITE_CONTEXTO = 280;

const OPCOES_CE: Alternativa[] = [
  { id: "c", texto: "Certo" },
  { id: "e", texto: "Errado" },
];

/**
 * Renderizador de questão compartilhado entre quiz diário e simulado.
 * NUNCA recebe gabarito no modo "respondendo" — só no modo "revisao" via
 * `resultado`, quando a prova/questão já foi encerrada. Verde só no acerto.
 */
export function QuestaoView({
  contexto,
  tipo_questao,
  enunciado,
  alternativas,
  escolha,
  onEscolha,
  modo,
  resultado,
  desabilitado = false,
}: Props) {
  const opcoes = tipo_questao === "certo_errado" ? OPCOES_CE : alternativas;
  const revisao = modo === "revisao";
  const bloqueado = revisao || desabilitado || !onEscolha;

  return (
    <div>
      {contexto && <TextoBase contexto={contexto} />}

      {/* Enunciado — texto de estudo: superfície limpa, sem grid */}
      <p className="text-base leading-relaxed text-ink">{enunciado}</p>

      {tipo_questao === "certo_errado" ? (
        <div
          role="radiogroup"
          aria-label="Certo ou errado"
          className="mt-5 grid grid-cols-2 gap-3"
        >
          {opcoes.map((opt) => {
            const est = estiloOpcao(opt.id, escolha, revisao, resultado);
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={escolha === opt.id}
                disabled={bloqueado}
                onClick={() => onEscolha?.(opt.id)}
                className={`${est.marcaCorreta ? "alt-correta " : ""}flex flex-col items-center justify-center gap-1.5 rounded-xl border p-4 font-semibold transition-colors ${est.classe} ${bloqueado ? "" : "cursor-pointer"}`}
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-lg ${est.badge}`}
                >
                  {est.icone ??
                    (opt.id === "c" ? (
                      <IconCircleCheck className="size-5" stroke={1.75} />
                    ) : (
                      <IconX className="size-5" stroke={1.75} />
                    ))}
                </span>
                {opt.texto}
              </button>
            );
          })}
        </div>
      ) : (
        <div
          role="radiogroup"
          aria-label="Alternativas"
          className="mt-5 flex flex-col gap-2.5"
        >
          {opcoes.map((opt) => {
            const est = estiloOpcao(opt.id, escolha, revisao, resultado);
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={escolha === opt.id}
                disabled={bloqueado}
                onClick={() => onEscolha?.(opt.id)}
                className={`${est.marcaCorreta ? "alt-correta " : ""}flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${est.classe} ${bloqueado ? "" : "cursor-pointer"}`}
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold uppercase ${est.badge}`}
                >
                  {est.icone ?? opt.id.toUpperCase()}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed">
                  {opt.texto}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Bloco de texto-base: distinto, colapsável quando longo. Leitura → sem grid. */
function TextoBase({ contexto }: { contexto: string }) {
  const corpo = (
    <p className="mt-2 whitespace-pre-line text-sm italic leading-relaxed text-muted">
      {contexto}
    </p>
  );
  const rotulo = (
    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
      Texto-base
    </span>
  );

  if (contexto.length <= LIMITE_CONTEXTO) {
    return (
      <div className="mb-4 rounded-xl border border-border bg-surface-alt px-4 py-3">
        {rotulo}
        {corpo}
      </div>
    );
  }

  return (
    <details className="group mb-4 rounded-xl border border-border bg-surface-alt px-4 py-3">
      <summary className="flex cursor-pointer items-center justify-between gap-2 list-none">
        {rotulo}
        <span className="text-xs font-medium text-roxo group-open:hidden">
          Ler
        </span>
        <span className="hidden text-xs font-medium text-roxo group-open:inline">
          Recolher
        </span>
      </summary>
      {corpo}
    </details>
  );
}

type Estilo = {
  classe: string;
  badge: string;
  icone: React.ReactNode;
  /** Marca a opção correta (usada para animação de "pop" no modo revisão). */
  marcaCorreta: boolean;
};

/** Estilo de cada opção conforme modo e resultado. Verde só na correta. */
function estiloOpcao(
  id: string,
  escolha: string | null,
  revisao: boolean,
  resultado: ResultadoQuestao | undefined,
): Estilo {
  if (revisao && resultado) {
    // Alternativa correta → estilo acerto (verde só aqui).
    if (resultado.gabarito === id) {
      return {
        classe:
          "border-[var(--acerto-border)] bg-[var(--acerto-bg)] text-[var(--acerto-text)]",
        badge: "bg-verde text-verde-ink",
        icone: <IconCircleCheck className="size-4" stroke={2} />,
        marcaCorreta: true,
      };
    }
    // Aluno marcou esta e errou → estilo revisar (roxo).
    if (resultado.resposta_aluno === id && !resultado.acertou) {
      return {
        classe:
          "border-[var(--revisar-border)] bg-[var(--revisar-bg)] text-[var(--revisar-text)]",
        badge: "bg-roxo text-on-dark",
        icone: <IconArrowRight className="size-4" stroke={2} />,
        marcaCorreta: false,
      };
    }
    // Demais → apagadas.
    return {
      classe: "border-border bg-surface text-muted opacity-60",
      badge: "bg-surface-alt text-muted",
      icone: null,
      marcaCorreta: false,
    };
  }

  // Respondendo: seleção em roxo, sem revelar nada.
  if (escolha === id) {
    return {
      classe: "border-roxo bg-surface-alt text-ink",
      badge: "bg-roxo text-on-dark",
      icone: null,
      marcaCorreta: false,
    };
  }
  return {
    classe: "border-border bg-surface text-ink hover:border-roxo",
    badge: "bg-surface-alt text-muted",
    icone: null,
    marcaCorreta: false,
  };
}
