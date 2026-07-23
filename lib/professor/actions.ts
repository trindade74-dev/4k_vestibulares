"use server";

import { createClient } from "@/lib/supabase/server";
import type { ResultadoAcao } from "@/lib/professor/tipos";

function texto(formData: FormData, campo: string): string {
  return String(formData.get(campo) ?? "").trim();
}

/** Campo de select opcional (matéria/turma): "" no form vira null no banco ("todas"/geral). */
function opcional(formData: FormData, campo: string): string | null {
  const v = texto(formData, campo);
  return v === "" ? null : v;
}

/** input type="datetime-local" (sem fuso) interpretado como horário de Brasília (UTC-3, sem DST). */
function dataHoraBrasilia(valor: string): string {
  return `${valor}:00-03:00`;
}

// ---------- Materiais ----------

export async function criarMaterial(
  _prev: ResultadoAcao,
  formData: FormData,
): Promise<ResultadoAcao> {
  const materiaId = texto(formData, "materiaId");
  const titulo = texto(formData, "titulo");
  const tipo = texto(formData, "tipo");
  const url = texto(formData, "url");
  const corpo = texto(formData, "corpo");
  const publicado = formData.get("publicado") === "on";

  if (!materiaId) return { erro: "Selecione a matéria." };
  if (!titulo || titulo.length < 2) return { erro: "Informe um título." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { erro: "Sessão expirada." };

  const { data: material, error } = await supabase
    .from("materiais")
    .insert({
      materia_id: materiaId,
      turma_id: opcional(formData, "turmaId"),
      titulo,
      descricao: opcional(formData, "descricao"),
      tipo,
      url: url || null,
      corpo: corpo || null,
      publicado,
    })
    .select("id, titulo")
    .single();

  if (error || !material) return { erro: "Não foi possível criar o material." };

  if (publicado) {
    await avisarNovoMaterial(material.id, material.titulo, materiaId, opcional(formData, "turmaId"));
  }

  return { ok: true };
}

export async function atualizarMaterial(
  materialId: string,
  _prev: ResultadoAcao,
  formData: FormData,
): Promise<ResultadoAcao> {
  const materiaId = texto(formData, "materiaId");
  const titulo = texto(formData, "titulo");
  const tipo = texto(formData, "tipo");
  const url = texto(formData, "url");
  const corpo = texto(formData, "corpo");
  const publicado = formData.get("publicado") === "on";
  const turmaId = opcional(formData, "turmaId");

  if (!materiaId) return { erro: "Selecione a matéria." };
  if (!titulo || titulo.length < 2) return { erro: "Informe um título." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("materiais")
    .update({
      materia_id: materiaId,
      turma_id: turmaId,
      titulo,
      descricao: opcional(formData, "descricao"),
      tipo,
      url: url || null,
      corpo: corpo || null,
      publicado,
    })
    .eq("id", materialId);

  if (error) return { erro: "Não foi possível salvar o material." };

  if (publicado) {
    const { data: avisoExistente } = await supabase
      .from("avisos")
      .select("id")
      .eq("material_id", materialId)
      .maybeSingle();
    if (!avisoExistente) {
      await avisarNovoMaterial(materialId, titulo, materiaId, turmaId);
    }
  }

  return { ok: true };
}

export async function excluirMaterial(materialId: string): Promise<ResultadoAcao> {
  const supabase = await createClient();
  const { error } = await supabase.from("materiais").delete().eq("id", materialId);
  if (error) return { erro: "Não foi possível excluir o material." };
  return { ok: true };
}

/** Cria o aviso de "novo material" — nunca duplica (checagem já feita por quem chama). */
async function avisarNovoMaterial(
  materialId: string,
  titulo: string,
  materiaId: string,
  turmaId: string | null,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: materia } = await supabase
    .from("materias")
    .select("nome")
    .eq("id", materiaId)
    .single();

  await supabase.from("avisos").insert({
    titulo: `Novo material: ${titulo}`,
    corpo: `Um novo material de ${materia?.nome ?? "uma matéria"} foi publicado. Confira na área de Matérias.`,
    turma_id: turmaId,
    material_id: materialId,
    importante: false,
    autor_id: user?.id ?? null,
  });
}

// ---------- Monitorias ----------

export async function criarMonitoria(
  _prev: ResultadoAcao,
  formData: FormData,
): Promise<ResultadoAcao> {
  const titulo = texto(formData, "titulo") || "Monitoria";
  const dataHora = texto(formData, "dataHora");
  const duracaoMin = Number(texto(formData, "duracaoMin") || "50");
  const vagas = Number(texto(formData, "vagas") || "6");

  if (!dataHora) return { erro: "Informe a data e hora." };
  if (!Number.isFinite(vagas) || vagas < 1) return { erro: "Informe um número de vagas válido." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("monitorias").insert({
    materia_id: opcional(formData, "materiaId"),
    turma_id: opcional(formData, "turmaId"),
    professor_id: user?.id ?? null,
    titulo,
    descricao: opcional(formData, "descricao"),
    data_hora: dataHoraBrasilia(dataHora),
    duracao_min: duracaoMin,
    vagas,
    local_ou_link: opcional(formData, "localOuLink"),
    status: "aberta",
  });

  if (error) return { erro: "Não foi possível criar a monitoria." };
  return { ok: true };
}

export async function atualizarMonitoria(
  monitoriaId: string,
  _prev: ResultadoAcao,
  formData: FormData,
): Promise<ResultadoAcao> {
  const titulo = texto(formData, "titulo") || "Monitoria";
  const dataHora = texto(formData, "dataHora");
  const duracaoMin = Number(texto(formData, "duracaoMin") || "50");
  const vagas = Number(texto(formData, "vagas") || "6");

  if (!dataHora) return { erro: "Informe a data e hora." };
  if (!Number.isFinite(vagas) || vagas < 1) return { erro: "Informe um número de vagas válido." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("monitorias")
    .update({
      materia_id: opcional(formData, "materiaId"),
      turma_id: opcional(formData, "turmaId"),
      titulo,
      descricao: opcional(formData, "descricao"),
      data_hora: dataHoraBrasilia(dataHora),
      duracao_min: duracaoMin,
      vagas,
      local_ou_link: opcional(formData, "localOuLink"),
    })
    .eq("id", monitoriaId);

  if (error) return { erro: "Não foi possível salvar a monitoria." };
  return { ok: true };
}

/** Cancela (não exclui — pode ter reservas vinculadas). */
export async function cancelarMonitoria(monitoriaId: string): Promise<ResultadoAcao> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("monitorias")
    .update({ status: "cancelada" })
    .eq("id", monitoriaId);
  if (error) return { erro: "Não foi possível cancelar a monitoria." };
  return { ok: true };
}

// ---------- Avisos ----------

export async function criarAviso(
  _prev: ResultadoAcao,
  formData: FormData,
): Promise<ResultadoAcao> {
  const titulo = texto(formData, "titulo");
  const corpo = texto(formData, "corpo");
  const importante = formData.get("importante") === "on";

  if (!titulo || titulo.length < 2) return { erro: "Informe um título." };
  if (!corpo || corpo.length < 2) return { erro: "Informe o corpo do aviso." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("avisos").insert({
    titulo,
    corpo,
    turma_id: opcional(formData, "turmaId"),
    importante,
    autor_id: user?.id ?? null,
  });

  if (error) return { erro: "Não foi possível publicar o aviso." };
  return { ok: true };
}

export async function atualizarAviso(
  avisoId: string,
  _prev: ResultadoAcao,
  formData: FormData,
): Promise<ResultadoAcao> {
  const titulo = texto(formData, "titulo");
  const corpo = texto(formData, "corpo");
  const importante = formData.get("importante") === "on";

  if (!titulo || titulo.length < 2) return { erro: "Informe um título." };
  if (!corpo || corpo.length < 2) return { erro: "Informe o corpo do aviso." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("avisos")
    .update({
      titulo,
      corpo,
      turma_id: opcional(formData, "turmaId"),
      importante,
    })
    .eq("id", avisoId);

  if (error) return { erro: "Não foi possível salvar o aviso." };
  return { ok: true };
}

/** Arquiva (não exclui — preserva histórico de comunicados). */
export async function arquivarAviso(avisoId: string): Promise<ResultadoAcao> {
  const supabase = await createClient();
  const { error } = await supabase.from("avisos").update({ ativo: false }).eq("id", avisoId);
  if (error) return { erro: "Não foi possível arquivar o aviso." };
  return { ok: true };
}
