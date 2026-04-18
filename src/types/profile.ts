import type { UserRole } from "@/lib/constants/roles";

export type ProfileRow = {
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

export type PatientDetailRow = {
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

export type Profile = ProfileRow;
export type PatientDetail = PatientDetailRow;
