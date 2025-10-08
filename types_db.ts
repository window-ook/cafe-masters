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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin: {
        Row: {
          admin: boolean
          created_at: string
          user_id: string
        }
        Insert: {
          admin: boolean
          created_at?: string
          user_id: string
        }
        Update: {
          admin?: boolean
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookmark: {
        Row: {
          address: string
          coordX: number
          coordY: number
          created_at: string
          extra_images: string | null
          id: number
          image: string
          menus: string | null
          name: string
          opening_time: string | null
          phone_number: string | null
          user_id: string
        }
        Insert: {
          address: string
          coordX: number
          coordY: number
          created_at?: string
          extra_images?: string | null
          id?: number
          image: string
          menus?: string | null
          name: string
          opening_time?: string | null
          phone_number?: string | null
          user_id?: string
        }
        Update: {
          address?: string
          coordX?: number
          coordY?: number
          created_at?: string
          extra_images?: string | null
          id?: number
          image?: string
          menus?: string | null
          name?: string
          opening_time?: string | null
          phone_number?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cafe_details: {
        Row: {
          created_at: string
          extra_images: string | null
          id: number
          image: string | null
          opening_time: string | null
        }
        Insert: {
          created_at?: string
          extra_images?: string | null
          id?: number
          image?: string | null
          opening_time?: string | null
        }
        Update: {
          created_at?: string
          extra_images?: string | null
          id?: number
          image?: string | null
          opening_time?: string | null
        }
        Relationships: []
      }
      collection: {
        Row: {
          address: string
          categories: string | null
          comment: string
          cons: string
          coordX: number
          coordY: number
          created_at: string
          eaten_menus: string
          extra_images: string | null
          id: number
          image: string
          name: string
          opening_time: string | null
          phone_number: string | null
          pros: string
          ratings: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          categories?: string | null
          comment: string
          cons: string
          coordX: number
          coordY: number
          created_at?: string
          eaten_menus: string
          extra_images?: string | null
          id?: number
          image: string
          name?: string
          opening_time?: string | null
          phone_number?: string | null
          pros: string
          ratings: number
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          address?: string
          categories?: string | null
          comment?: string
          cons?: string
          coordX?: number
          coordY?: number
          created_at?: string
          eaten_menus?: string
          extra_images?: string | null
          id?: number
          image?: string
          name?: string
          opening_time?: string | null
          phone_number?: string | null
          pros?: string
          ratings?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      recommendation: {
        Row: {
          address: string
          categories: string
          coordX: number
          coordY: number
          created_at: string
          extra_images: string | null
          id: number
          image: string
          menus: string | null
          name: string
          opening_time: string | null
          phone_number: string | null
        }
        Insert: {
          address: string
          categories: string
          coordX: number
          coordY: number
          created_at?: string
          extra_images?: string | null
          id?: number
          image: string
          menus?: string | null
          name: string
          opening_time?: string | null
          phone_number?: string | null
        }
        Update: {
          address?: string
          categories?: string
          coordX?: number
          coordY?: number
          created_at?: string
          extra_images?: string | null
          id?: number
          image?: string
          menus?: string | null
          name?: string
          opening_time?: string | null
          phone_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
