"use server";

import { createClient } from "@/lib/supabase/server";
import { buscarQuestoes, buscarStreak } from "@/lib/aluno/queries";
import type { QuestaoSegura, ResultadoResposta } from "@/lib/aluno/tipos";

const RESPOSTAS_VALIDAS = new Set(["a", "b", "c", "d", "e"]);

/**
 * Registra e corrige a resposta do aluno no servidor.
 * O gabarito só volta ao cliente por aqui, depois da resposta enviada.
 */
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

/** Puxa mais questões avulsas (modo praticar) para continuar no mesmo dia. */
export async function buscarMaisQuestoes(): Promise<QuestaoSegura[]> {
  return buscarQuestoes(true, 5);
}

/** Streak atualizado (para o resumo do quiz, após responder). */
export async function buscarStreakAtual(): Promise<number> {
  return buscarStreak();
}
