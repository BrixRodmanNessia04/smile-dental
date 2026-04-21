const DEFAULT_SITE_URL = "https://onedentalclinic.vercel.app";

export function getSiteBaseUrl({ required = false } = {}) {
  const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!rawBaseUrl) {
    if (required) {
      throw new Error("NEXT_PUBLIC_SITE_URL is not set");
    }

    return DEFAULT_SITE_URL;
  }

  const withProtocol = /^https?:\/\//i.test(rawBaseUrl)
    ? rawBaseUrl
    : `https://${rawBaseUrl}`;

  return withProtocol.replace(/\/+$/, "");
}

export function toAbsoluteUrl(path: string) {
  return new URL(path, getSiteBaseUrl()).toString();
}
