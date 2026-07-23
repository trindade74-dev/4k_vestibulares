export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      avisos: {
        Row: {
          ativo: boolean
          autor_id: string | null
          corpo: string
          id: string
          importante: boolean
          material_id: string | null
          publicado_em: string
          titulo: string
          turma_id: string | null
        }
        Insert: {
          ativo?: boolean
          autor_id?: string | null
          corpo: string
          id?: string
          importante?: boolean
          material_id?: string | null
          publicado_em?: string
          titulo: string
          turma_id?: string | null
        }
        Update: {
          ativo?: boolean
          autor_id?: string | null
          corpo?: string
          id?: string
          importante?: boolean
          material_id?: string | null
          publicado_em?: string
          titulo?: string
          turma_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avisos_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avisos_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avisos_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      inscricoes: {
        Row: {
          aceite_lgpd: boolean
          aceite_lgpd_em: string
          como_conheceu: string
          como_conheceu_outro: string | null
          criado_em: string
          curso_outro: string | null
          curso_pretendido: string
          data_nascimento: string
          email: string
          endereco: string
          escola_origem: string
          id: string
          ja_fez_cursinho: boolean
          nome: string
          serie_status: string
          status: string
          telefone: string
          turno_desejado: string
          vestibular_outro: string | null
          vestibulares_alvo: string[]
        }
        Insert: {
          aceite_lgpd: boolean
          aceite_lgpd_em?: string
          como_conheceu: string
          como_conheceu_outro?: string | null
          criado_em?: string
          curso_outro?: string | null
          curso_pretendido: string
          data_nascimento: string
          email: string
          endereco: string
          escola_origem: string
          id?: string
          ja_fez_cursinho: boolean
          nome: string
          serie_status: string
          status?: string
          telefone: string
          turno_desejado: string
          vestibular_outro?: string | null
          vestibulares_alvo: string[]
        }
        Update: {
          aceite_lgpd?: boolean
          aceite_lgpd_em?: string
          como_conheceu?: string
          como_conheceu_outro?: string | null
          criado_em?: string
          curso_outro?: string | null
          curso_pretendido?: string
          data_nascimento?: string
          email?: string
          endereco?: string
          escola_origem?: string
          id?: string
          ja_fez_cursinho?: boolean
          nome?: string
          serie_status?: string
          status?: string
          telefone?: string
          turno_desejado?: string
          vestibular_outro?: string | null
          vestibulares_alvo?: string[]
        }
        Relationships: []
      }
      materiais: {
        Row: {
          corpo: string | null
          criado_em: string
          descricao: string | null
          id: string
          materia_id: string
          publicado: boolean
          tipo: string
          titulo: string
          turma_id: string | null
          url: string | null
        }
        Insert: {
          corpo?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          materia_id: string
          publicado?: boolean
          tipo?: string
          titulo: string
          turma_id?: string | null
          url?: string | null
        }
        Update: {
          corpo?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          materia_id?: string
          publicado?: boolean
          tipo?: string
          titulo?: string
          turma_id?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materiais_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "materias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiais_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      materias: {
        Row: {
          cor: string | null
          criado_em: string
          id: string
          nome: string
          ordem: number
        }
        Insert: {
          cor?: string | null
          criado_em?: string
          id?: string
          nome: string
          ordem?: number
        }
        Update: {
          cor?: string | null
          criado_em?: string
          id?: string
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      monitoria_reservas: {
        Row: {
          aluno_id: string
          criado_em: string
          id: string
          monitoria_id: string
          status: string
        }
        Insert: {
          aluno_id: string
          criado_em?: string
          id?: string
          monitoria_id: string
          status?: string
        }
        Update: {
          aluno_id?: string
          criado_em?: string
          id?: string
          monitoria_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitoria_reservas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitoria_reservas_monitoria_id_fkey"
            columns: ["monitoria_id"]
            isOneToOne: false
            referencedRelation: "monitorias"
            referencedColumns: ["id"]
          },
        ]
      }
      monitorias: {
        Row: {
          criado_em: string
          data_hora: string
          descricao: string | null
          duracao_min: number
          id: string
          local_ou_link: string | null
          materia_id: string | null
          professor_id: string | null
          status: string
          titulo: string
          turma_id: string | null
          vagas: number
        }
        Insert: {
          criado_em?: string
          data_hora: string
          descricao?: string | null
          duracao_min?: number
          id?: string
          local_ou_link?: string | null
          materia_id?: string | null
          professor_id?: string | null
          status?: string
          titulo?: string
          turma_id?: string | null
          vagas?: number
        }
        Update: {
          criado_em?: string
          data_hora?: string
          descricao?: string | null
          duracao_min?: number
          id?: string
          local_ou_link?: string | null
          materia_id?: string | null
          professor_id?: string | null
          status?: string
          titulo?: string
          turma_id?: string | null
          vagas?: number
        }
        Relationships: [
          {
            foreignKeyName: "monitorias_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "materias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitorias_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitorias_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      questoes: {
        Row: {
          alternativas: Json
          assunto: string | null
          ativa: boolean
          contexto: string | null
          criado_em: string
          dificuldade: number
          enunciado: string
          gabarito: string
          id: string
          materia_id: string
          origem: string | null
          quiz_rapido: boolean
          tipo_questao: string
        }
        Insert: {
          alternativas: Json
          assunto?: string | null
          ativa?: boolean
          contexto?: string | null
          criado_em?: string
          dificuldade?: number
          enunciado: string
          gabarito: string
          id?: string
          materia_id: string
          origem?: string | null
          quiz_rapido?: boolean
          tipo_questao?: string
        }
        Update: {
          alternativas?: Json
          assunto?: string | null
          ativa?: boolean
          contexto?: string | null
          criado_em?: string
          dificuldade?: number
          enunciado?: string
          gabarito?: string
          id?: string
          materia_id?: string
          origem?: string | null
          quiz_rapido?: boolean
          tipo_questao?: string
        }
        Relationships: [
          {
            foreignKeyName: "questoes_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "materias"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_historico: {
        Row: {
          acertou: boolean
          aluno_id: string
          id: string
          materia_id: string
          questao_id: string
          respondido_em: string
          resposta_aluno: string | null
        }
        Insert: {
          acertou: boolean
          aluno_id: string
          id?: string
          materia_id: string
          questao_id: string
          respondido_em?: string
          resposta_aluno?: string | null
        }
        Update: {
          acertou?: boolean
          aluno_id?: string
          id?: string
          materia_id?: string
          questao_id?: string
          respondido_em?: string
          resposta_aluno?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_historico_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_historico_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "materias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_historico_questao_id_fkey"
            columns: ["questao_id"]
            isOneToOne: false
            referencedRelation: "questoes"
            referencedColumns: ["id"]
          },
        ]
      }
      recursos: {
        Row: {
          aluno_id: string
          criado_em: string
          id: string
          questao_id: string
          respondido_em: string | null
          resposta_professor: string | null
          status: string
          tentativa_id: string | null
          texto: string
        }
        Insert: {
          aluno_id: string
          criado_em?: string
          id?: string
          questao_id: string
          respondido_em?: string | null
          resposta_professor?: string | null
          status?: string
          tentativa_id?: string | null
          texto: string
        }
        Update: {
          aluno_id?: string
          criado_em?: string
          id?: string
          questao_id?: string
          respondido_em?: string | null
          resposta_professor?: string | null
          status?: string
          tentativa_id?: string | null
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "recursos_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recursos_questao_id_fkey"
            columns: ["questao_id"]
            isOneToOne: false
            referencedRelation: "questoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recursos_tentativa_id_fkey"
            columns: ["tentativa_id"]
            isOneToOne: false
            referencedRelation: "tentativas"
            referencedColumns: ["id"]
          },
        ]
      }
      respostas: {
        Row: {
          acertou: boolean
          assunto: string | null
          id: string
          materia_id: string
          questao_id: string
          respondido_em: string
          resposta_aluno: string | null
          tentativa_id: string
        }
        Insert: {
          acertou: boolean
          assunto?: string | null
          id?: string
          materia_id: string
          questao_id: string
          respondido_em?: string
          resposta_aluno?: string | null
          tentativa_id: string
        }
        Update: {
          acertou?: boolean
          assunto?: string | null
          id?: string
          materia_id?: string
          questao_id?: string
          respondido_em?: string
          resposta_aluno?: string | null
          tentativa_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "respostas_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "materias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_questao_id_fkey"
            columns: ["questao_id"]
            isOneToOne: false
            referencedRelation: "questoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_tentativa_id_fkey"
            columns: ["tentativa_id"]
            isOneToOne: false
            referencedRelation: "tentativas"
            referencedColumns: ["id"]
          },
        ]
      }
      simulado_questoes: {
        Row: {
          ordem: number
          questao_id: string
          simulado_id: string
        }
        Insert: {
          ordem?: number
          questao_id: string
          simulado_id: string
        }
        Update: {
          ordem?: number
          questao_id?: string
          simulado_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulado_questoes_questao_id_fkey"
            columns: ["questao_id"]
            isOneToOne: false
            referencedRelation: "questoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulado_questoes_simulado_id_fkey"
            columns: ["simulado_id"]
            isOneToOne: false
            referencedRelation: "simulados"
            referencedColumns: ["id"]
          },
        ]
      }
      simulados: {
        Row: {
          criado_em: string
          descricao: string | null
          id: string
          publicado: boolean
          titulo: string
          turma_id: string | null
        }
        Insert: {
          criado_em?: string
          descricao?: string | null
          id?: string
          publicado?: boolean
          titulo: string
          turma_id?: string | null
        }
        Update: {
          criado_em?: string
          descricao?: string | null
          id?: string
          publicado?: boolean
          titulo?: string
          turma_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simulados_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      tentativas: {
        Row: {
          aluno_id: string
          criado_em: string
          finalizado_em: string | null
          id: string
          iniciado_em: string
          simulado_id: string
        }
        Insert: {
          aluno_id: string
          criado_em?: string
          finalizado_em?: string | null
          id?: string
          iniciado_em?: string
          simulado_id: string
        }
        Update: {
          aluno_id?: string
          criado_em?: string
          finalizado_em?: string | null
          id?: string
          iniciado_em?: string
          simulado_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tentativas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tentativas_simulado_id_fkey"
            columns: ["simulado_id"]
            isOneToOne: false
            referencedRelation: "simulados"
            referencedColumns: ["id"]
          },
        ]
      }
      turmas: {
        Row: {
          ativa: boolean
          criado_em: string
          id: string
          nome: string
        }
        Insert: {
          ativa?: boolean
          criado_em?: string
          id?: string
          nome: string
        }
        Update: {
          ativa?: boolean
          criado_em?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          avisos_vistos_em: string | null
          criado_em: string
          id: string
          nome: string
          tipo: string
          turma_id: string | null
        }
        Insert: {
          avisos_vistos_em?: string | null
          criado_em?: string
          id: string
          nome: string
          tipo?: string
          turma_id?: string | null
        }
        Update: {
          avisos_vistos_em?: string | null
          criado_em?: string
          id?: string
          nome?: string
          tipo?: string
          turma_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      avisos_nao_lidos_count: { Args: never; Returns: number }
      cancelar_reserva: { Args: { p_reserva_id: string }; Returns: undefined }
      enviar_inscricao: {
        Args: {
          p_aceite_lgpd: boolean
          p_como_conheceu: string
          p_como_conheceu_outro: string
          p_curso_outro: string
          p_curso_pretendido: string
          p_data_nascimento: string
          p_email: string
          p_endereco: string
          p_escola_origem: string
          p_ja_fez_cursinho: boolean
          p_nome: string
          p_serie_status: string
          p_telefone: string
          p_turno_desejado: string
          p_vestibular_outro: string
          p_vestibulares_alvo: string[]
        }
        Returns: undefined
      }
      finalizar_simulado: {
        Args: { p_tentativa_id: string }
        Returns: {
          acertou: boolean
          alternativas: Json
          contexto: string
          enunciado: string
          gabarito: string
          materia_id: string
          materia_nome: string
          ordem: number
          questao_id: string
          resposta_aluno: string
          tipo_questao: string
        }[]
      }
      iniciar_simulado: { Args: { p_simulado_id: string }; Returns: string }
      marcar_avisos_vistos: { Args: never; Returns: undefined }
      meu_desempenho: {
        Args: never
        Returns: {
          acertos: number
          materia_cor: string
          materia_id: string
          materia_nome: string
          percentual: number
          total: number
        }[]
      }
      meu_historico_quiz: {
        Args: { p_limite?: number }
        Returns: {
          acertou: boolean
          id: string
          materia_cor: string
          materia_nome: string
          respondido_em: string
        }[]
      }
      meu_streak: { Args: never; Returns: number }
      meu_tipo: { Args: never; Returns: string }
      meus_avisos: {
        Args: { p_limite?: number }
        Returns: {
          corpo: string
          id: string
          importante: boolean
          nao_lido: boolean
          publicado_em: string
          titulo: string
        }[]
      }
      meus_simulados: {
        Args: never
        Returns: {
          acertos: number
          descricao: string
          finalizada: boolean
          id: string
          iniciados_na_semana: number
          n_questoes: number
          tentativa_id: string
          titulo: string
          total_respondido: number
        }[]
      }
      minha_turma: { Args: never; Returns: string }
      minhas_monitorias: {
        Args: { p_materia_id?: string }
        Returns: {
          data_hora: string
          descricao: string
          duracao_min: number
          local_ou_link: string
          materia_id: string
          monitoria_id: string
          reserva_id: string
          reserva_status: string
          titulo: string
        }[]
      }
      monitorias_da_materia: {
        Args: { p_materia_id?: string }
        Returns: {
          data_hora: string
          descricao: string
          duracao_min: number
          id: string
          local_ou_link: string
          materia_id: string
          minha_reserva_id: string
          minha_reserva_status: string
          titulo: string
          vagas: number
          vagas_ocupadas: number
          vagas_restantes: number
        }[]
      }
      questoes_do_simulado: {
        Args: { p_tentativa_id: string }
        Returns: {
          alternativas: Json
          contexto: string
          enunciado: string
          id: string
          materia_id: string
          materia_nome: string
          ordem: number
          resposta_atual: string
          tipo_questao: string
        }[]
      }
      quiz_do_dia: {
        Args: { p_limite?: number }
        Returns: {
          alternativas: Json
          assunto: string | null
          ativa: boolean
          contexto: string | null
          criado_em: string
          dificuldade: number
          enunciado: string
          gabarito: string
          id: string
          materia_id: string
          origem: string | null
          quiz_rapido: boolean
          tipo_questao: string
        }[]
        SetofOptions: {
          from: "*"
          to: "questoes"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      quiz_do_dia_seguro: {
        Args: { p_limite?: number; p_materia_id?: string; p_praticar?: boolean }
        Returns: {
          alternativas: Json
          assunto: string
          contexto: string
          dificuldade: number
          enunciado: string
          id: string
          materia_cor: string
          materia_id: string
          materia_nome: string
          tipo_questao: string
        }[]
      }
      reservar_monitoria: { Args: { p_monitoria_id: string }; Returns: string }
      reservas_da_monitoria: {
        Args: { p_monitoria_id: string }
        Returns: {
          aluno_nome: string
          criado_em: string
          reserva_id: string
          status: string
        }[]
      }
      responder_quiz: {
        Args: { p_questao_id: string; p_resposta: string }
        Returns: {
          acertou: boolean
          gabarito: string
        }[]
      }
      responder_simulado: {
        Args: {
          p_questao_id: string
          p_resposta: string
          p_tentativa_id: string
        }
        Returns: undefined
      }
      resultado_simulado: {
        Args: { p_tentativa_id: string }
        Returns: {
          acertou: boolean
          alternativas: Json
          contexto: string
          enunciado: string
          gabarito: string
          materia_id: string
          materia_nome: string
          ordem: number
          questao_id: string
          resposta_aluno: string
          tipo_questao: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
