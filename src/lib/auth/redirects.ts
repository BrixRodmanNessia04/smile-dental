export function sanitizeNextPath(nextPath: string | null | undefined, fallback: string): string {
  if (!nextPath) {
    return fallback;
  }

  if (!nextPath.startsWith("/")) {
    return fallback;
  }

  if (nextPath.startsWith("//")) {
    return fallback;
  }

  return nextPath;
}
