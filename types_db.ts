export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookmarked: {
        Row: {
          address: string
          coordX: number | null
          coordY: number | null
          created_at: string
          id: number
          menu: string | null
          name: string
          openWeekend: string | null
          openWeekly: string
          phoneNum: string | null
          photoUrl: string | null
          rating: number | null
          reviewCount: number | null
          userId: string
        }
        Insert: {
          address: string
          coordX?: number | null
          coordY?: number | null
          created_at?: string
          id?: number
          menu?: string | null
          name: string
          openWeekend?: string | null
          openWeekly: string
          phoneNum?: string | null
          photoUrl?: string | null
          rating?: number | null
          reviewCount?: number | null
          userId: string
        }
        Update: {
          address?: string
          coordX?: number | null
          coordY?: number | null
          created_at?: string
          id?: number
          menu?: string | null
          name?: string
          openWeekend?: string | null
          openWeekly?: string
          phoneNum?: string | null
          photoUrl?: string | null
          rating?: number | null
          reviewCount?: number | null
          userId?: string
        }
        Relationships: []
      }
      collected: {
        Row: {
          address: string
          comment: string
          concept: string | null
          cons: string | null
          coordX: number
          coordY: number
          created_at: string
          eaten: string
          id: number
          name: string
          photoUrl: string | null
          pros: string | null
          rating: number
          updated_at: string | null
          userId: string
        }
        Insert: {
          address: string
          comment: string
          concept?: string | null
          cons?: string | null
          coordX: number
          coordY: number
          created_at?: string
          eaten: string
          id?: number
          name?: string
          photoUrl?: string | null
          pros?: string | null
          rating: number
          updated_at?: string | null
          userId: string
        }
        Update: {
          address?: string
          comment?: string
          concept?: string | null
          cons?: string | null
          coordX?: number
          coordY?: number
          created_at?: string
          eaten?: string
          id?: number
          name?: string
          photoUrl?: string | null
          pros?: string | null
          rating?: number
          updated_at?: string | null
          userId?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
