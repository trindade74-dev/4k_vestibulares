import type { Database } from "@/lib/database.types";

export type TipoMaterial = "link" | "pdf" | "video" | "texto";
export type StatusMonitoria = "aberta" | "cancelada";
export type StatusInscricao = "novo" | "contatado" | "matriculado" | "descartado";

export const ROTULO_TIPO_MATERIAL: Record<TipoMaterial, string> = {
  link: "Link",
  pdf: "PDF",
  video: "Vídeo",
  texto: "Texto",
};

/** Matéria/turma para preencher os selects dos formulários. */
export type OpcaoSelect = { id: string; nome: string };

export type MaterialProfessor = Database["public"]["Tables"]["materiais"]["Row"] & {
  materia_nome: string;
};

export type MonitoriaProfessor = Database["public"]["Tables"]["monitorias"]["Row"] & {
  materia_nome: string | null;
};

export type AvisoProfessor = Database["public"]["Tables"]["avisos"]["Row"];

export type ReservaMonitoria =
  Database["public"]["Functions"]["reservas_da_monitoria"]["Returns"][number];

export type ContadoresDashboard = {
  materiaisPublicados: number;
  monitoriasAbertas: number;
  avisosAtivos: number;
};

export type ResultadoAcao = { ok: true } | { erro: string };
