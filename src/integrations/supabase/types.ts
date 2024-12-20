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
      companies: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_approved: boolean | null
          name: string
          owner_email: string | null
          owner_name: string | null
          pending_approval: boolean | null
          phone: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          name: string
          owner_email?: string | null
          owner_name?: string | null
          pending_approval?: boolean | null
          phone?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          name?: string
          owner_email?: string | null
          owner_name?: string | null
          pending_approval?: boolean | null
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      company_users: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          company_id: string | null
          created_at: string
          customer_number: number
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          company_id?: string | null
          created_at?: string
          customer_number?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string | null
          created_at?: string
          customer_number?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      service_call_details: {
        Row: {
          completion_notes: string | null
          created_at: string
          customer_rating: number | null
          customer_signature: string | null
          id: string
          parts_used: string[] | null
          progress_notes: string | null
          service_call_id: string
        }
        Insert: {
          completion_notes?: string | null
          created_at?: string
          customer_rating?: number | null
          customer_signature?: string | null
          id?: string
          parts_used?: string[] | null
          progress_notes?: string | null
          service_call_id: string
        }
        Update: {
          completion_notes?: string | null
          created_at?: string
          customer_rating?: number | null
          customer_signature?: string | null
          id?: string
          parts_used?: string[] | null
          progress_notes?: string | null
          service_call_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_call_details_service_call_id_fkey"
            columns: ["service_call_id"]
            isOneToOne: false
            referencedRelation: "service_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      service_call_photos: {
        Row: {
          created_at: string
          id: string
          photo_url: string
          service_call_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          photo_url: string
          service_call_id: string
        }
        Update: {
          created_at?: string
          id?: string
          photo_url?: string
          service_call_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_call_photos_service_call_id_fkey"
            columns: ["service_call_id"]
            isOneToOne: false
            referencedRelation: "service_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      service_calls: {
        Row: {
          accepted_at: string | null
          actual_duration: unknown | null
          address: string | null
          company_id: string | null
          completed_at: string | null
          created_at: string
          customer_name: string
          description: string | null
          estimated_duration: unknown | null
          id: string
          job_card_number: string | null
          phone_number: string | null
          scheduled_date: string
          started_at: string | null
          status: string | null
          technician_id: string
        }
        Insert: {
          accepted_at?: string | null
          actual_duration?: unknown | null
          address?: string | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_name: string
          description?: string | null
          estimated_duration?: unknown | null
          id?: string
          job_card_number?: string | null
          phone_number?: string | null
          scheduled_date: string
          started_at?: string | null
          status?: string | null
          technician_id: string
        }
        Update: {
          accepted_at?: string | null
          actual_duration?: unknown | null
          address?: string | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_name?: string
          description?: string | null
          estimated_duration?: unknown | null
          id?: string
          job_card_number?: string | null
          phone_number?: string | null
          scheduled_date?: string
          started_at?: string | null
          status?: string | null
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_calls_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians: {
        Row: {
          approval_status: string | null
          availability_status: string | null
          company_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          skills: string[] | null
          specialty: string
          status: string | null
        }
        Insert: {
          approval_status?: string | null
          availability_status?: string | null
          company_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          skills?: string[] | null
          specialty: string
          status?: string | null
        }
        Update: {
          approval_status?: string | null
          availability_status?: string | null
          company_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          skills?: string[] | null
          specialty?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technicians_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "super_admin" | "admin" | "technician" | "customer"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
