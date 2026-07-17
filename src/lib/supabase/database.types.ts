// 이 파일은 Supabase 프로젝트 스키마로부터 자동 생성되었습니다. 직접 수정하지 마세요.
// 재생성: Supabase MCP `generate_typescript_types` 또는 `supabase gen types typescript`

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
      availability_rules: {
        Row: {
          day_of_week: number
          end_time: string
          id: string
          photographer_id: string
          start_time: string
        }
        Insert: {
          day_of_week: number
          end_time: string
          id?: string
          photographer_id: string
          start_time: string
        }
        Update: {
          day_of_week?: number
          end_time?: string
          id?: string
          photographer_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_rules_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_times: {
        Row: {
          ends_at: string
          id: string
          photographer_id: string
          reason: string | null
          starts_at: string
        }
        Insert: {
          ends_at: string
          id?: string
          photographer_id: string
          reason?: string | null
          starts_at: string
        }
        Update: {
          ends_at?: string
          id?: string
          photographer_id?: string
          reason?: string | null
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_times_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_status_logs: {
        Row: {
          booking_id: string
          changed_by: string | null
          created_at: string
          id: string
          note: string | null
          status: Database["public"]["Enums"]["booking_status"]
        }
        Insert: {
          booking_id: string
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          status: Database["public"]["Enums"]["booking_status"]
        }
        Update: {
          booking_id?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Relationships: [
          {
            foreignKeyName: "booking_status_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_status_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_status_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          additional_fee_snapshot: number
          base_price_snapshot: number
          blocked_range: unknown
          buffer_after_minutes: number
          buffer_before_minutes: number
          created_at: string
          customer_id: string
          duration_minutes: number
          ends_at: string
          id: string
          location_address: string | null
          location_id: string | null
          location_label: string | null
          location_type: Database["public"]["Enums"]["booking_location_type"]
          participant_count: number
          photographer_id: string
          requests: string | null
          service_id: string
          service_title_snapshot: string
          starts_at: string
          status: Database["public"]["Enums"]["booking_status"]
          total_price_snapshot: number
          updated_at: string
        }
        Insert: {
          additional_fee_snapshot?: number
          base_price_snapshot: number
          blocked_range?: unknown
          buffer_after_minutes?: number
          buffer_before_minutes?: number
          created_at?: string
          customer_id: string
          duration_minutes: number
          ends_at: string
          id?: string
          location_address?: string | null
          location_id?: string | null
          location_label?: string | null
          location_type: Database["public"]["Enums"]["booking_location_type"]
          participant_count?: number
          photographer_id: string
          requests?: string | null
          service_id: string
          service_title_snapshot: string
          starts_at: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price_snapshot: number
          updated_at?: string
        }
        Update: {
          additional_fee_snapshot?: number
          base_price_snapshot?: number
          blocked_range?: unknown
          buffer_after_minutes?: number
          buffer_before_minutes?: number
          created_at?: string
          customer_id?: string
          duration_minutes?: number
          ends_at?: string
          id?: string
          location_address?: string | null
          location_id?: string | null
          location_label?: string | null
          location_type?: Database["public"]["Enums"]["booking_location_type"]
          participant_count?: number
          photographer_id?: string
          requests?: string | null
          service_id?: string
          service_title_snapshot?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price_snapshot?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "shooting_services"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          customer_id: string
          photographer_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          photographer_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          photographer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          area: string
          cover_image_path: string | null
          created_at: string
          description: string | null
          has_travel_fee: boolean
          id: string
          name: string
          photographer_id: string | null
        }
        Insert: {
          address?: string | null
          area: string
          cover_image_path?: string | null
          created_at?: string
          description?: string | null
          has_travel_fee?: boolean
          id?: string
          name: string
          photographer_id?: string | null
        }
        Update: {
          address?: string | null
          area?: string
          cover_image_path?: string | null
          created_at?: string
          description?: string | null
          has_travel_fee?: boolean
          id?: string
          name?: string
          photographer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      photographer_areas: {
        Row: {
          area: string
          id: string
          photographer_id: string
        }
        Insert: {
          area: string
          id?: string
          photographer_id: string
        }
        Update: {
          area?: string
          id?: string
          photographer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photographer_areas_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      photographer_profiles: {
        Row: {
          bio: string | null
          cancellation_policy: string | null
          contact_info: string | null
          created_at: string
          display_name: string
          headline: string | null
          id: string
          status: Database["public"]["Enums"]["photographer_status"]
          updated_at: string
        }
        Insert: {
          bio?: string | null
          cancellation_policy?: string | null
          contact_info?: string | null
          created_at?: string
          display_name: string
          headline?: string | null
          id: string
          status?: Database["public"]["Enums"]["photographer_status"]
          updated_at?: string
        }
        Update: {
          bio?: string | null
          cancellation_policy?: string | null
          contact_info?: string | null
          created_at?: string
          display_name?: string
          headline?: string | null
          id?: string
          status?: Database["public"]["Enums"]["photographer_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "photographer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photographer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      photographer_service_tags: {
        Row: {
          service_id: string
          tag_id: number
        }
        Insert: {
          service_id: string
          tag_id: number
        }
        Update: {
          service_id?: string
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "photographer_service_tags_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "shooting_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photographer_service_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "service_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_images: {
        Row: {
          created_at: string
          height: number | null
          id: string
          photographer_id: string
          sort_order: number
          storage_path: string
          width: number | null
        }
        Insert: {
          created_at?: string
          height?: number | null
          id?: string
          photographer_id: string
          sort_order?: number
          storage_path: string
          width?: number | null
        }
        Update: {
          created_at?: string
          height?: number | null
          id?: string
          photographer_id?: string
          sort_order?: number
          storage_path?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_images_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          nickname: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          nickname: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          nickname?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          content: string | null
          created_at: string
          customer_id: string
          id: string
          photographer_id: string
          rating: number
          updated_at: string
        }
        Insert: {
          booking_id: string
          content?: string | null
          created_at?: string
          customer_id: string
          id?: string
          photographer_id: string
          rating: number
          updated_at?: string
        }
        Update: {
          booking_id?: string
          content?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          photographer_id?: string
          rating?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_tags: {
        Row: {
          category: Database["public"]["Enums"]["tag_category"]
          id: number
          label: string
        }
        Insert: {
          category: Database["public"]["Enums"]["tag_category"]
          id?: never
          label: string
        }
        Update: {
          category?: Database["public"]["Enums"]["tag_category"]
          id?: never
          label?: string
        }
        Relationships: []
      }
      shooting_services: {
        Row: {
          allows_outfit_change: boolean | null
          areas: string[]
          buffer_after_minutes: number
          buffer_before_minutes: number
          cover_image_path: string | null
          created_at: string
          delivery_days: number | null
          description: string
          duration_minutes: number
          extra_fee_conditions: string | null
          id: string
          inclusions: string | null
          is_published: boolean
          max_participants: number | null
          night_surcharge: number | null
          notes: string | null
          photographer_id: string
          price: number
          provides_all_raw_files: boolean | null
          provides_raw_files: boolean | null
          recommended_for: string | null
          retouched_photo_count: number | null
          title: string
          travel_fee: number | null
          updated_at: string
          weekend_surcharge: number | null
        }
        Insert: {
          allows_outfit_change?: boolean | null
          areas?: string[]
          buffer_after_minutes?: number
          buffer_before_minutes?: number
          cover_image_path?: string | null
          created_at?: string
          delivery_days?: number | null
          description: string
          duration_minutes: number
          extra_fee_conditions?: string | null
          id?: string
          inclusions?: string | null
          is_published?: boolean
          max_participants?: number | null
          night_surcharge?: number | null
          notes?: string | null
          photographer_id: string
          price: number
          provides_all_raw_files?: boolean | null
          provides_raw_files?: boolean | null
          recommended_for?: string | null
          retouched_photo_count?: number | null
          title: string
          travel_fee?: number | null
          updated_at?: string
          weekend_surcharge?: number | null
        }
        Update: {
          allows_outfit_change?: boolean | null
          areas?: string[]
          buffer_after_minutes?: number
          buffer_before_minutes?: number
          cover_image_path?: string | null
          created_at?: string
          delivery_days?: number | null
          description?: string
          duration_minutes?: number
          extra_fee_conditions?: string | null
          id?: string
          inclusions?: string | null
          is_published?: boolean
          max_participants?: number | null
          night_surcharge?: number | null
          notes?: string | null
          photographer_id?: string
          price?: number
          provides_all_raw_files?: boolean | null
          provides_raw_files?: boolean | null
          recommended_for?: string | null
          retouched_photo_count?: number | null
          title?: string
          travel_fee?: number | null
          updated_at?: string
          weekend_surcharge?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shooting_services_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      profiles_public: {
        Row: {
          avatar_url: string | null
          id: string | null
          nickname: string | null
        }
        Insert: {
          avatar_url?: string | null
          id?: string | null
          nickname?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string | null
          nickname?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      complete_photographer_onboarding: {
        Args: {
          p_areas: string[]
          p_bio: string
          p_contact_info: string
          p_display_name: string
          p_headline: string
          p_portfolio_paths: string[]
        }
        Returns: undefined
      }
    }
    Enums: {
      booking_location_type: "catalog" | "custom" | "tbd"
      booking_status:
        | "requested"
        | "confirmed"
        | "rejected"
        | "completed"
        | "cancelled"
      photographer_status: "draft" | "pending_review" | "active" | "suspended"
      tag_category: "purpose" | "mood"
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
    Enums: {
      booking_location_type: ["catalog", "custom", "tbd"],
      booking_status: [
        "requested",
        "confirmed",
        "rejected",
        "completed",
        "cancelled",
      ],
      photographer_status: ["draft", "pending_review", "active", "suspended"],
      tag_category: ["purpose", "mood"],
    },
  },
} as const
