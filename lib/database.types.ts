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
      questoes: {
        Row: {
          alternativas: Json
          assunto: string | null
          ativa: boolean
          criado_em: string
          dificuldade: number
          enunciado: string
          gabarito: string
          id: string
          materia_id: string
          origem: string | null
          quiz_rapido: boolean
        }
        Insert: {
          alternativas: Json
          assunto?: string | null
          ativa?: boolean
          criado_em?: string
          dificuldade?: number
          enunciado: string
          gabarito: string
          id?: string
          materia_id: string
          origem?: string | null
          quiz_rapido?: boolean
        }
        Update: {
          alternativas?: Json
          assunto?: string | null
          ativa?: boolean
          criado_em?: string
          dificuldade?: number
          enunciado?: string
          gabarito?: string
          id?: string
          materia_id?: string
          origem?: string | null
          quiz_rapido?: boolean
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
          criado_em: string
          id: string
          nome: string
          tipo: string
          turma_id: string | null
        }
        Insert: {
          criado_em?: string
          id: string
          nome: string
          tipo?: string
          turma_id?: string | null
        }
        Update: {
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
      meu_desempenho: {
        Args: Record<PropertyKey, never>
        Returns: {
          acertos: number
          materia_cor: string
          materia_id: string
          materia_nome: string
          percentual: number
          total: number
        }[]
      }
      meu_streak: { Args: Record<PropertyKey, never>; Returns: number }
      meu_tipo: { Args: Record<PropertyKey, never>; Returns: string }
      minha_turma: { Args: Record<PropertyKey, never>; Returns: string }
      quiz_do_dia: {
        Args: { p_limite?: number }
        Returns: {
          alternativas: Json
          assunto: string | null
          ativa: boolean
          criado_em: string
          dificuldade: number
          enunciado: string
          gabarito: string
          id: string
          materia_id: string
          origem: string | null
          quiz_rapido: boolean
        }[]
      }
      quiz_do_dia_seguro: {
        Args: { p_limite?: number; p_praticar?: boolean }
        Returns: {
          alternativas: Json
          assunto: string
          dificuldade: number
          enunciado: string
          id: string
          materia_cor: string
          materia_id: string
          materia_nome: string
        }[]
      }
      responder_quiz: {
        Args: { p_questao_id: string; p_resposta: string }
        Returns: {
          acertou: boolean
          gabarito: string
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
