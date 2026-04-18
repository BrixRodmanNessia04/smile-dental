const trimOrEmpty = (value: string | undefined) => value?.trim() ?? "";

const getRequiredEnv = (name: string, rawValue: string | undefined) => {
  const value = trimOrEmpty(rawValue);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const getOptionalEnv = (rawValue: string | undefined) => {
  const value = trimOrEmpty(rawValue);
  return value || undefined;
};

export const env = {
  NEXT_PUBLIC_SITE_URL: getOptionalEnv(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: getRequiredEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getRequiredEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
  SUPABASE_SERVICE_ROLE_KEY: getOptionalEnv(process.env.SUPABASE_SERVICE_ROLE_KEY),
};
