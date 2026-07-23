"use server";

import { createClient } from "@/lib/supabase/server";
import { linkWhatsApp } from "@/lib/links";
import {
  ROTULO_SERIE_STATUS,
  ROTULO_TURNO,
  ROTULO_VESTIBULAR,
  type EstadoMatricula,
  type SerieStatus,
  type TurnoDesejado,
  type VestibularAlvo,
} from "@/lib/matricula/tipos";

const SERIES_VALIDAS = new Set<SerieStatus>(["1_ano", "2_ano", "3_ano", "formado"]);
const TURNOS_VALIDOS = new Set<TurnoDesejado>(["matutino", "vespertino", "noturno"]);
const VESTIBULARES_VALIDOS = new Set<VestibularAlvo>(["pas_unb", "enem", "outro"]);

function texto(formData: FormData, campo: string): string {
  return String(formData.get(campo) ?? "").trim();
}

/** Formata uma data yyyy-mm-dd (input type="date") como dd/mm/aaaa, sem depender de fuso. */
function formatarDataBr(isoData: string): string {
  const [ano, mes, dia] = isoData.split("-");
  if (!ano || !mes || !dia) return isoData;
  return `${dia}/${mes}/${ano}`;
}

/**
 * Recebe os dados do formulário de pré-matrícula, valida no servidor (defesa
 * em profundidade — a RPC `enviar_inscricao` valida de novo, é a autoridade
 * final) e, em caso de sucesso, monta a mensagem pronta do WhatsApp. Nunca
 * loga nem ecoa os dados de volta além do que o próprio usuário digitou.
 */
export async function enviarInscricao(
  _prev: EstadoMatricula,
  formData: FormData,
): Promise<EstadoMatricula> {
  const nome = texto(formData, "nome");
  const dataNascimento = texto(formData, "dataNascimento");
  const email = texto(formData, "email");
  const telefone = texto(formData, "telefone");
  const endereco = texto(formData, "endereco");
  const escolaOrigem = texto(formData, "escolaOrigem");
  const serieStatus = texto(formData, "serieStatus") as SerieStatus;
  const vestibulares = formData.getAll("vestibulares").map(String) as VestibularAlvo[];
  const vestibularOutro = texto(formData, "vestibularOutro");
  const cursoPretendido = texto(formData, "cursoPretendido");
  const cursoOutro = texto(formData, "cursoOutro");
  const turnoDesejado = texto(formData, "turnoDesejado") as TurnoDesejado;
  const jaFezCursinho = texto(formData, "jaFezCursinho") === "sim";
  const comoConheceu = texto(formData, "comoConheceu");
  const comoConheceuOutro = texto(formData, "comoConheceuOutro");
  const aceiteLgpd = formData.get("aceiteLgpd") === "on";

  if (!nome || nome.length < 2) return { erro: "Informe seu nome completo." };
  if (!dataNascimento) return { erro: "Informe sua data de nascimento." };
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { erro: "Informe um e-mail válido." };
  }
  if (!telefone || telefone.replace(/\D/g, "").length < 10) {
    return { erro: "Informe um telefone válido, com DDD." };
  }
  if (!endereco || endereco.length < 3) return { erro: "Informe seu endereço." };
  if (!escolaOrigem || escolaOrigem.length < 2) {
    return { erro: "Informe sua escola de origem." };
  }
  if (!SERIES_VALIDAS.has(serieStatus)) {
    return { erro: "Selecione sua série ou se já concluiu o Ensino Médio." };
  }
  if (vestibulares.length === 0 || vestibulares.some((v) => !VESTIBULARES_VALIDOS.has(v))) {
    return { erro: "Selecione ao menos um vestibular-alvo." };
  }
  if (!cursoPretendido) return { erro: "Selecione o curso pretendido." };
  if (!TURNOS_VALIDOS.has(turnoDesejado)) {
    return { erro: "Selecione o turno desejado." };
  }
  if (!comoConheceu) return { erro: "Conte pra gente como conheceu o 4K." };
  if (!aceiteLgpd) {
    return { erro: "Você precisa aceitar os termos para continuar." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("enviar_inscricao", {
    p_nome: nome,
    p_data_nascimento: dataNascimento,
    p_email: email,
    p_telefone: telefone,
    p_endereco: endereco,
    p_escola_origem: escolaOrigem,
    p_serie_status: serieStatus,
    p_vestibulares_alvo: vestibulares,
    p_vestibular_outro: vestibularOutro,
    p_curso_pretendido: cursoPretendido === "Outro" ? cursoOutro || "Outro" : cursoPretendido,
    p_curso_outro: cursoPretendido === "Outro" ? cursoOutro : "",
    p_turno_desejado: turnoDesejado,
    p_ja_fez_cursinho: jaFezCursinho,
    p_como_conheceu: comoConheceu === "Outro" ? comoConheceuOutro || "Outro" : comoConheceu,
    p_como_conheceu_outro: comoConheceu === "Outro" ? comoConheceuOutro : "",
    p_aceite_lgpd: true,
  });

  if (error) {
    return { erro: "Não foi possível enviar sua pré-matrícula. Tente novamente." };
  }

  const linhasVestibular = vestibulares
    .map((v) => (v === "outro" && vestibularOutro ? `Outro: ${vestibularOutro}` : ROTULO_VESTIBULAR[v]))
    .join(", ");

  const mensagem = [
    "Olá! Quero me matricular na 4K",
    "",
    `Nome: ${nome}`,
    `Nascimento: ${formatarDataBr(dataNascimento)}`,
    `E-mail: ${email}`,
    `Telefone: ${telefone}`,
    `Endereço: ${endereco}`,
    "",
    `Escola: ${escolaOrigem} (${ROTULO_SERIE_STATUS[serieStatus]})`,
    `Já fez cursinho: ${jaFezCursinho ? "Sim" : "Não"}`,
    "",
    `Vestibular(es) alvo: ${linhasVestibular}`,
    `Curso pretendido: ${cursoPretendido === "Outro" && cursoOutro ? cursoOutro : cursoPretendido}`,
    `Turno desejado: ${ROTULO_TURNO[turnoDesejado]}`,
    "",
    `Como conheceu o 4K: ${comoConheceu === "Outro" && comoConheceuOutro ? comoConheceuOutro : comoConheceu}`,
  ].join("\n");

  return { sucesso: { whatsappUrl: linkWhatsApp(mensagem) } };
}
