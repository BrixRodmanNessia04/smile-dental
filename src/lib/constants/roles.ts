export const USER_ROLES = {
  ADMIN: "admin",
  PATIENT: "patient",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export function isUserRole(value: unknown): value is UserRole {
  return value === USER_ROLES.ADMIN || value === USER_ROLES.PATIENT;
}

export function isAdminRole(value: unknown): value is typeof USER_ROLES.ADMIN {
  return value === USER_ROLES.ADMIN;
}

export function isPatientRole(value: unknown): value is typeof USER_ROLES.PATIENT {
  return value === USER_ROLES.PATIENT;
}
