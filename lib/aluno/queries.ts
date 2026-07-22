import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  normalizarAlternativas,
  normalizarTipo,
  type Desempenho,
  type HistoricoQuiz,
  type ItemEspelho,
  type QuestaoSegura,
  type QuestaoSimulado,
  type SimuladoLista,
} from "@/lib/aluno/tipos";

/**
 * Questões do quiz diário para o aluno atual, SEM gabarito.
 * @param praticar false = quiz do dia; true = modo praticar (qualquer ativa).
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
    tipo_questao: normalizarTipo(q.tipo_questao),
    contexto: q.contexto,
    enunciado: q.enunciado,
    alternativas: normalizarAlternativas(q.alternativas),
    dificuldade: q.dificuldade,
  }));
}

/** Desempenho por matéria (quiz + simulados combinados), todas em ordem. */
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

/** Histórico recente do quiz diário. */
export async function buscarHistoricoQuiz(
  limite = 30,
): Promise<HistoricoQuiz[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("meu_historico_quiz", {
    p_limite: limite,
  });
  if (error || !data) return [];
  return data;
}

/** Lista de simulados publicados com status e cota semanal. */
export async function buscarMeusSimulados(): Promise<SimuladoLista[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("meus_simulados");
  if (error || !data) return [];
  return data;
}

/** Espelho de uma tentativa finalizada (com gabarito). */
export async function buscarResultadoSimulado(
  tentativaId: string,
): Promise<ItemEspelho[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("resultado_simulado", {
    p_tentativa_id: tentativaId,
  });
  if (error || !data) return [];
  return data.map((r) => ({
    questao_id: r.questao_id,
    ordem: r.ordem,
    materia_id: r.materia_id,
    materia_nome: r.materia_nome,
    tipo_questao: normalizarTipo(r.tipo_questao),
    contexto: r.contexto,
    enunciado: r.enunciado,
    alternativas: normalizarAlternativas(r.alternativas),
    resposta_aluno: r.resposta_aluno,
    acertou: r.acertou,
    gabarito: r.gabarito,
  }));
}

/** Questões de um simulado em andamento (sem gabarito). */
export async function buscarQuestoesSimulado(
  tentativaId: string,
): Promise<QuestaoSimulado[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("questoes_do_simulado", {
    p_tentativa_id: tentativaId,
  });
  if (error || !data) return [];
  return data.map((q) => ({
    id: q.id,
    materia_id: q.materia_id,
    materia_nome: q.materia_nome,
    tipo_questao: normalizarTipo(q.tipo_questao),
    contexto: q.contexto,
    enunciado: q.enunciado,
    alternativas: normalizarAlternativas(q.alternativas),
    ordem: q.ordem,
    resposta_atual: q.resposta_atual,
  }));
}
