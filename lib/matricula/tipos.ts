/** Série atual do aluno ou "já concluiu o ensino médio". */
export type SerieStatus = "1_ano" | "2_ano" | "3_ano" | "formado";

/** Turno em que o aluno pretende estudar no cursinho. */
export type TurnoDesejado = "matutino" | "vespertino" | "noturno";

/** Vestibular(es) que o aluno tem como alvo. Múltipla escolha. */
export type VestibularAlvo = "pas_unb" | "enem" | "outro";

export const ROTULO_SERIE_STATUS: Record<SerieStatus, string> = {
  "1_ano": "1º ano do Ensino Médio",
  "2_ano": "2º ano do Ensino Médio",
  "3_ano": "3º ano do Ensino Médio",
  formado: "Já concluí o Ensino Médio",
};

export const ROTULO_TURNO: Record<TurnoDesejado, string> = {
  matutino: "Matutino",
  vespertino: "Vespertino",
  noturno: "Noturno",
};

export const ROTULO_VESTIBULAR: Record<VestibularAlvo, string> = {
  pas_unb: "PAS/UnB",
  enem: "ENEM",
  outro: "Outro",
};

/** Lista genérica de cursos mais concorridos em vestibular; "Outro" abre campo livre. */
export const CURSOS_PRETENDIDOS = [
  "Medicina",
  "Direito",
  "Engenharia",
  "Administração",
  "Psicologia",
  "Odontologia",
  "Arquitetura e Urbanismo",
  "Ciências Contábeis",
  "Enfermagem",
  "Outro",
] as const;

/** Como o aluno soube do cursinho; "Outro" abre campo livre. */
export const COMO_CONHECEU_OPCOES = [
  "Instagram",
  "Indicação de amigo ou familiar",
  "Google / busca",
  "WhatsApp",
  "Panfleto / anúncio de rua",
  "Outro",
] as const;

export type EstadoMatricula = {
  erro?: string;
  sucesso?: { whatsappUrl: string };
};
