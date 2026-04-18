export const MARKETING_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/services",
  UPDATES: "/updates",
  CONTACT: "/contact",
  BOOK_APPOINTMENT: "/book-appointment",
} as const;

export const AUTH_ROUTES = {
  ADMIN_BASE: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_LOGIN: "/admin-login",
  PATIENT_HOME: "/patient",
  PATIENT_LOGIN: "/patient-login",
  PATIENT_REGISTER: "/patient-register",
  OAUTH_CALLBACK: "/auth/callback",
} as const;

export const PATIENT_ROUTES = {
  ROOT: "/patient",
  DASHBOARD: "/patient",
  APPOINTMENTS: "/patient/appointments",
  NOTIFICATIONS: "/patient/notifications",
  POINTS: "/patient/points",
  PROFILE: "/patient/profile",
  SETTINGS: "/patient/settings",
} as const;

export const ADMIN_ROUTES = {
  ROOT: "/admin",
  DASHBOARD: "/admin/dashboard",
  APPOINTMENTS: "/admin/appointments",
  NOTIFICATIONS: "/admin/notifications",
  POINTS: "/admin/points",
  POSTS: "/admin/posts",
  PATIENTS: "/admin/patients",
  SETTINGS: "/admin/settings",
} as const;
