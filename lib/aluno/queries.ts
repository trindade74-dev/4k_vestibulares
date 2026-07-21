import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Alternativa, Desempenho, QuestaoSegura } from "@/lib/aluno/tipos";

/** Normaliza a coluna `alternativas` (Json) para o tipo do cliente. */
function normalizarAlternativas(valor: unknown): Alternativa[] {
  if (!Array.isArray(valor)) return [];
  return valor
    .filter(
      (a): a is { id: unknown; texto: unknown } =>
        typeof a === "object" && a !== null,
    )
    .map((a) => ({ id: String(a.id ?? ""), texto: String(a.texto ?? "") }));
}

/**
 * Busca as questões do quiz para o aluno atual, SEM gabarito.
 * @param praticar false = quiz do dia (só quiz rápido, exclui últimas 20h);
 *                 true = modo praticar (qualquer questão ativa, sem janela).
 */
export async function buscarQuestoes(
  praticar = false,
  limite = 5,
): Promise<QuestaoSegura[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("quiz_do_dia_seguro", {
    p_limite: limite,
    p_praticar: praticar,
  });
  if (error || !data) return [];
  return data.map((q) => ({
    id: q.id,
    materia_id: q.materia_id,
    materia_nome: q.materia_nome,
    materia_cor: q.materia_cor,
    assunto: q.assunto,
    enunciado: q.enunciado,
    alternativas: normalizarAlternativas(q.alternativas),
    dificuldade: q.dificuldade,
  }));
}

/** Desempenho por matéria (todas as matérias em ordem) do aluno atual. */
export async function buscarDesempenho(): Promise<Desempenho[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("meu_desempenho");
  if (error || !data) return [];
  return data;
}

/** Dias consecutivos de estudo do aluno atual. */
export async function buscarStreak(): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("meu_streak");
  if (error || data == null) return 0;
  return data;
}
