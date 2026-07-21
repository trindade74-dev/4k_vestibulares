import type { Database } from "@/lib/database.types";

/** Uma alternativa de questão — o que o aluno vê. Nunca inclui o gabarito. */
export type Alternativa = { id: string; texto: string };

/**
 * Questão entregue ao cliente pelo RPC `quiz_do_dia_seguro`.
 * NÃO contém o campo `gabarito` — de propósito.
 */
export type QuestaoSegura = {
  id: string;
  materia_id: string;
  materia_nome: string;
  materia_cor: string | null;
  assunto: string | null;
  enunciado: string;
  alternativas: Alternativa[];
  dificuldade: number;
};

/** Linha de desempenho por matéria (RPC `meu_desempenho`). */
export type Desempenho =
  Database["public"]["Functions"]["meu_desempenho"]["Returns"][number];

/** Resultado devolvido por `responder_quiz` APÓS o aluno responder. */
export type ResultadoResposta = { acertou: boolean; gabarito: string };
