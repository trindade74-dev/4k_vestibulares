import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  AvisoProfessor,
  ContadoresDashboard,
  MaterialProfessor,
  MonitoriaProfessor,
  OpcaoSelect,
  ReservaMonitoria,
} from "@/lib/professor/tipos";

/** Matérias pra preencher selects — leitura liberada a qualquer autenticado. */
export async function buscarMateriasParaSelect(): Promise<OpcaoSelect[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materias")
    .select("id, nome")
    .order("ordem");
  if (error || !data) return [];
  return data;
}

/** Turmas pra preencher selects — leitura liberada a qualquer autenticado. */
export async function buscarTurmasParaSelect(): Promise<OpcaoSelect[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("turmas")
    .select("id, nome")
    .eq("ativa", true)
    .order("nome");
  if (error || !data) return [];
  return data;
}

/** Todos os materiais (RLS: professor/admin enxergam tudo, não só publicado). */
export async function buscarMateriaisProfessor(): Promise<MaterialProfessor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materiais")
    .select("*, materias(nome)")
    .order("criado_em", { ascending: false });
  if (error || !data) return [];
  return data.map((m) => ({
    ...m,
    materia_nome: (m.materias as { nome: string } | null)?.nome ?? "—",
  }));
}

/** Todas as monitorias (abertas e canceladas), mais recentes primeiro. */
export async function buscarMonitoriasProfessor(): Promise<MonitoriaProfessor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("monitorias")
    .select("*, materias(nome)")
    .order("data_hora", { ascending: false });
  if (error || !data) return [];
  return data.map((m) => ({
    ...m,
    materia_nome: (m.materias as { nome: string } | null)?.nome ?? null,
  }));
}

/** Todos os avisos (ativos e arquivados), mais recentes primeiro. */
export async function buscarAvisosProfessor(): Promise<AvisoProfessor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("avisos")
    .select("*")
    .order("publicado_em", { ascending: false });
  if (error || !data) return [];
  return data;
}

/** Quem reservou uma monitoria (só via RPC — a tabela não tem policy direta). */
export async function buscarReservasDaMonitoria(
  monitoriaId: string,
): Promise<ReservaMonitoria[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("reservas_da_monitoria", {
    p_monitoria_id: monitoriaId,
  });
  if (error || !data) return [];
  return data;
}

/** Contadores do dashboard do professor. */
export async function buscarContadoresDashboard(): Promise<ContadoresDashboard> {
  const supabase = await createClient();
  const [materiais, monitorias, avisos] = await Promise.all([
    supabase
      .from("materiais")
      .select("id", { count: "exact", head: true })
      .eq("publicado", true),
    supabase
      .from("monitorias")
      .select("id", { count: "exact", head: true })
      .eq("status", "aberta"),
    supabase
      .from("avisos")
      .select("id", { count: "exact", head: true })
      .eq("ativo", true),
  ]);
  return {
    materiaisPublicados: materiais.count ?? 0,
    monitoriasAbertas: monitorias.count ?? 0,
    avisosAtivos: avisos.count ?? 0,
  };
}
