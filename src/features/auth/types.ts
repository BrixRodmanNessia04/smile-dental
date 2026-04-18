export type AuthFieldErrors = {
  email?: string[];
  password?: string[];
  fullName?: string[];
  confirmPassword?: string[];
};

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: AuthFieldErrors;
};

export const INITIAL_AUTH_ACTION_STATE: AuthActionState = {
  status: "idle",
};
