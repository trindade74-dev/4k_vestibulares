import type { Database } from "@/lib/database.types";

/** Tipo de questão suportado. */
export type TipoQuestao = "multipla_escolha" | "certo_errado";

/** Uma alternativa — o que o aluno vê. Nunca inclui o gabarito. */
export type Alternativa = { id: string; texto: string };

/**
 * Questão do quiz diário entregue pelo RPC `quiz_do_dia_seguro`.
 * NÃO contém `gabarito`. Para `certo_errado`, `alternativas` vem vazio.
 */
export type QuestaoSegura = {
  id: string;
  materia_id: string;
  materia_nome: string;
  materia_cor: string | null;
  assunto: string | null;
  tipo_questao: TipoQuestao;
  contexto: string | null;
  enunciado: string;
  alternativas: Alternativa[];
  dificuldade: number;
};

/** Questão de um simulado em andamento (sem gabarito), com a resposta já salva. */
export type QuestaoSimulado = {
  id: string;
  materia_id: string;
  materia_nome: string;
  tipo_questao: TipoQuestao;
  contexto: string | null;
  enunciado: string;
  alternativas: Alternativa[];
  ordem: number;
  resposta_atual: string | null;
};

/** Item do espelho (resultado) — já com gabarito, prova encerrada. */
export type ItemEspelho = {
  questao_id: string;
  ordem: number;
  materia_id: string;
  materia_nome: string;
  tipo_questao: TipoQuestao;
  contexto: string | null;
  enunciado: string;
  alternativas: Alternativa[];
  resposta_aluno: string | null;
  acertou: boolean | null;
  gabarito: string;
};

/** Linha da lista de simulados (RPC `meus_simulados`). */
export type SimuladoLista =
  Database["public"]["Functions"]["meus_simulados"]["Returns"][number];

/** Linha de desempenho por matéria. */
export type Desempenho =
  Database["public"]["Functions"]["meu_desempenho"]["Returns"][number];

/** Registro do histórico de quiz. */
export type HistoricoQuiz =
  Database["public"]["Functions"]["meu_historico_quiz"]["Returns"][number];

/** Resultado devolvido por `responder_quiz` APÓS o aluno responder. */
export type ResultadoResposta = { acertou: boolean; gabarito: string };

/** Material enviado pelo professor para uma matéria (select direto, RLS cuida do filtro). */
export type Material = {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: "link" | "pdf" | "video" | "texto";
  url: string | null;
  corpo: string | null;
  criado_em: string;
};

/** Monitoria disponível para reserva (RPC `monitorias_da_materia`). */
export type MonitoriaDisponivel =
  Database["public"]["Functions"]["monitorias_da_materia"]["Returns"][number];

/** Reserva do aluno, com dados da monitoria (RPC `minhas_monitorias`). */
export type MinhaMonitoria =
  Database["public"]["Functions"]["minhas_monitorias"]["Returns"][number];

/** Aviso/notificação (RPC `meus_avisos`). */
export type Aviso = Database["public"]["Functions"]["meus_avisos"]["Returns"][number];

/** Converte a coluna `alternativas` (Json) para o tipo do cliente. */
export function normalizarAlternativas(valor: unknown): Alternativa[] {
  if (!Array.isArray(valor)) return [];
  return valor
    .filter(
      (a): a is { id: unknown; texto: unknown } =>
        typeof a === "object" && a !== null,
    )
    .map((a) => ({ id: String(a.id ?? ""), texto: String(a.texto ?? "") }));
}

/** Normaliza o campo tipo_questao vindo do banco. */
export function normalizarTipo(valor: unknown): TipoQuestao {
  return valor === "certo_errado" ? "certo_errado" : "multipla_escolha";
}
