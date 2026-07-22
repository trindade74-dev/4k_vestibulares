import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  normalizarAlternativas,
  normalizarTipo,
  type Aviso,
  type Desempenho,
  type HistoricoQuiz,
  type ItemEspelho,
  type Material,
  type MinhaMonitoria,
  type MonitoriaDisponivel,
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

/** Nome/cor de uma matéria pelo id (cabeçalho do hub de matéria). */
export async function buscarMateria(
  materiaId: string,
): Promise<{ id: string; nome: string; cor: string | null } | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materias")
    .select("id, nome, cor")
    .eq("id", materiaId)
    .single();
  if (error || !data) return null;
  return data;
}

/** Questões de prática de uma matéria específica (mesma seleção do modo "praticar"). */
export async function buscarQuestoesMateria(
  materiaId: string,
  limite = 5,
): Promise<QuestaoSegura[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("quiz_do_dia_seguro", {
    p_limite: limite,
    p_praticar: true,
    p_materia_id: materiaId,
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

/** Material enviado pelo professor para uma matéria (RLS filtra publicado + turma). */
export async function buscarMateriaisDaMateria(
  materiaId: string,
): Promise<Material[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materiais")
    .select("id, titulo, descricao, tipo, url, corpo, criado_em")
    .eq("materia_id", materiaId)
    .order("criado_em", { ascending: false });
  if (error || !data) return [];
  return data as Material[];
}

/** Monitorias abertas para uma matéria (ou gerais), com vagas calculadas. */
export async function buscarMonitoriasDaMateria(
  materiaId: string,
): Promise<MonitoriaDisponivel[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("monitorias_da_materia", {
    p_materia_id: materiaId,
  });
  if (error || !data) return [];
  return data;
}

/** Reservas do aluno (histórico, opcionalmente filtrado por matéria). */
export async function buscarMinhasMonitorias(
  materiaId?: string,
): Promise<MinhaMonitoria[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("minhas_monitorias", {
    p_materia_id: materiaId ?? undefined,
  });
  if (error || !data) return [];
  return data;
}

/** Avisos visíveis ao aluno (turma dele ou gerais), mais recentes primeiro. */
export async function buscarAvisos(limite = 20): Promise<Aviso[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("meus_avisos", {
    p_limite: limite,
  });
  if (error || !data) return [];
  return data;
}

/** Contagem de avisos não lidos (badge do sino). */
export async function buscarAvisosNaoLidos(): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("avisos_nao_lidos_count");
  if (error || data == null) return 0;
  return data;
}
