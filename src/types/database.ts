import type { AppointmentStatus } from "@/lib/constants/appointment-status";
import type { NotificationType } from "@/lib/constants/notification-type";
import type { PostStatus } from "@/lib/constants/post-status";
import type { UserRole } from "@/lib/constants/roles";
import type { PointTransactionType } from "@/types/point";
import type { EmailLogStatus } from "@/types/notification";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          auth_user_id: string;
          role: UserRole;
          username: string | null;
          email: string;
          first_name: string;
          last_name: string;
          middle_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          role: UserRole;
          username?: string | null;
          email: string;
          first_name: string;
          last_name: string;
          middle_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          auth_user_id?: string;
          role?: UserRole;
          username?: string | null;
          email?: string;
          first_name?: string;
          last_name?: string;
          middle_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      patient_details: {
        Row: {
          id: string;
          profile_id: string;
          birth_date: string | null;
          sex: string | null;
          address_line: string | null;
          city: string | null;
          province: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          birth_date?: string | null;
          sex?: string | null;
          address_line?: string | null;
          city?: string | null;
          province?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          birth_date?: string | null;
          sex?: string | null;
          address_line?: string | null;
          city?: string | null;
          province?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          duration_minutes: number;
          base_price: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          duration_minutes: number;
          base_price?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          duration_minutes?: number;
          base_price?: number | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      appointment_slots: {
        Row: {
          id: string;
          slot_date: string;
          start_time: string;
          end_time: string;
          max_capacity: number;
          booked_count: number;
          is_active: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slot_date: string;
          start_time: string;
          end_time: string;
          max_capacity?: number;
          booked_count?: number;
          is_active?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slot_date?: string;
          start_time?: string;
          end_time?: string;
          max_capacity?: number;
          booked_count?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          patient_profile_id: string;
          service_id: string;
          slot_id: string | null;
          appointment_date: string;
          start_time: string;
          end_time: string;
          status: AppointmentStatus;
          reason: string | null;
          admin_notes: string | null;
          cancellation_reason: string | null;
          approved_by: string | null;
          completed_by: string | null;
          cancelled_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_profile_id: string;
          service_id: string;
          slot_id?: string | null;
          appointment_date: string;
          start_time: string;
          end_time: string;
          status?: AppointmentStatus;
          reason?: string | null;
          admin_notes?: string | null;
          cancellation_reason?: string | null;
          approved_by?: string | null;
          completed_by?: string | null;
          cancelled_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          service_id?: string;
          slot_id?: string | null;
          appointment_date?: string;
          start_time?: string;
          end_time?: string;
          status?: AppointmentStatus;
          reason?: string | null;
          admin_notes?: string | null;
          cancellation_reason?: string | null;
          approved_by?: string | null;
          completed_by?: string | null;
          cancelled_by?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      appointment_status_logs: {
        Row: {
          id: string;
          appointment_id: string;
          old_status: string | null;
          new_status: string;
          changed_by: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          old_status?: string | null;
          new_status: string;
          changed_by: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          old_status?: string | null;
          new_status?: string;
          changed_by?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
      patient_points: {
        Row: {
          id: string;
          patient_profile_id: string;
          total_points: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_profile_id: string;
          total_points?: number;
          updated_at?: string;
        };
        Update: {
          total_points?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      point_transactions: {
        Row: {
          id: string;
          patient_profile_id: string;
          appointment_id: string | null;
          type: PointTransactionType;
          points: number;
          description: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_profile_id: string;
          appointment_id?: string | null;
          type: PointTransactionType;
          points: number;
          description?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          appointment_id?: string | null;
          type?: PointTransactionType;
          points?: number;
          description?: string | null;
          created_by?: string | null;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image_url: string | null;
          status: PostStatus;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          created_by: string;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          cover_image_url?: string | null;
          status?: PostStatus;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          created_by: string;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          cover_image_url?: string | null;
          status?: PostStatus;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          recipient_profile_id: string;
          type: NotificationType | string;
          title: string;
          message: string;
          entity_type: string | null;
          entity_id: string | null;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_profile_id: string;
          type: NotificationType | string;
          title: string;
          message: string;
          entity_type?: string | null;
          entity_id?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          type?: NotificationType | string;
          title?: string;
          message?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          is_read?: boolean;
          read_at?: string | null;
        };
        Relationships: [];
      };
      notification_preferences: {
        Row: {
          id: string;
          profile_id: string;
          in_app_enabled: boolean;
          email_enabled: boolean;
          appointment_updates_enabled: boolean;
          points_updates_enabled: boolean;
          marketing_updates_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          in_app_enabled?: boolean;
          email_enabled?: boolean;
          appointment_updates_enabled?: boolean;
          points_updates_enabled?: boolean;
          marketing_updates_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          in_app_enabled?: boolean;
          email_enabled?: boolean;
          appointment_updates_enabled?: boolean;
          points_updates_enabled?: boolean;
          marketing_updates_enabled?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_logs: {
        Row: {
          id: string;
          profile_id: string | null;
          notification_id: string | null;
          email_to: string;
          subject: string;
          template_key: string | null;
          status: EmailLogStatus;
          provider_message_id: string | null;
          error_message: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          notification_id?: string | null;
          email_to: string;
          subject: string;
          template_key?: string | null;
          status: EmailLogStatus;
          provider_message_id?: string | null;
          error_message?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          profile_id?: string | null;
          notification_id?: string | null;
          email_to?: string;
          subject?: string;
          template_key?: string | null;
          status?: EmailLogStatus;
          provider_message_id?: string | null;
          error_message?: string | null;
          sent_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
