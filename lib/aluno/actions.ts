"use server";

import { createClient } from "@/lib/supabase/server";
import { buscarQuestoes, buscarStreak } from "@/lib/aluno/queries";
import type { QuestaoSegura, ResultadoResposta } from "@/lib/aluno/tipos";

const RESPOSTAS_VALIDAS = new Set(["a", "b", "c", "d", "e"]);

/** Corrige e registra a resposta do quiz diário no servidor. */
export async function responder(
  questaoId: string,
  resposta: string,
): Promise<ResultadoResposta | { erro: string }> {
  const escolha = resposta.trim().toLowerCase();
  if (!RESPOSTAS_VALIDAS.has(escolha)) {
    return { erro: "Resposta inválida." };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("responder_quiz", {
    p_questao_id: questaoId,
    p_resposta: escolha,
  });
  if (error || !data || data.length === 0) {
    return { erro: "Não foi possível registrar a resposta." };
  }
  return { acertou: data[0].acertou, gabarito: data[0].gabarito };
}

/** Puxa mais questões avulsas (modo praticar). */
export async function buscarMaisQuestoes(): Promise<QuestaoSegura[]> {
  return buscarQuestoes(true, 5);
}

/** Streak atualizado (para o resumo do quiz). */
export async function buscarStreakAtual(): Promise<number> {
  return buscarStreak();
}

/** Inicia (ou retoma) uma tentativa de simulado. Aplica o limite semanal. */
export async function iniciarSimulado(
  simuladoId: string,
): Promise<{ tentativaId: string } | { erro: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("iniciar_simulado", {
    p_simulado_id: simuladoId,
  });
  if (error) {
    if (error.message.includes("limite semanal")) {
      return {
        erro: "Você já iniciou 7 simulados nesta semana. Novos liberam na segunda-feira.",
      };
    }
    return { erro: "Não foi possível iniciar o simulado." };
  }
  return { tentativaId: data as string };
}

/** Salva a resposta de uma questão do simulado (sem revelar gabarito). */
export async function responderSimulado(
  tentativaId: string,
  questaoId: string,
  resposta: string,
): Promise<{ ok: true } | { erro: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("responder_simulado", {
    p_tentativa_id: tentativaId,
    p_questao_id: questaoId,
    p_resposta: resposta.trim().toLowerCase(),
  });
  if (error) return { erro: "Não foi possível salvar a resposta." };
  return { ok: true };
}

/** Finaliza a prova. O espelho é lido depois via resultado_simulado. */
export async function finalizarSimulado(
  tentativaId: string,
): Promise<{ ok: true } | { erro: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("finalizar_simulado", {
    p_tentativa_id: tentativaId,
  });
  if (error) return { erro: "Não foi possível finalizar o simulado." };
  return { ok: true };
}

/** Abre um recurso (contestação de questão). */
export async function pedirRecurso(
  questaoId: string,
  tentativaId: string | null,
  texto: string,
): Promise<{ ok: true } | { erro: string }> {
  const motivo = texto.trim();
  if (motivo.length < 10) {
    return { erro: "Descreva o problema em pelo menos 10 caracteres." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { erro: "Sessão expirada." };

  const { error } = await supabase.from("recursos").insert({
    aluno_id: user.id,
    questao_id: questaoId,
    tentativa_id: tentativaId,
    texto: motivo,
  });
  if (error) return { erro: "Não foi possível enviar o recurso." };
  return { ok: true };
}
