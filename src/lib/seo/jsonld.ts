const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return baseUrl && baseUrl.length > 0 ? baseUrl : "https://example.com";
};

export type LocalBusinessJsonLdData = {
  "@context": "https://schema.org";
  "@type": "Dentist";
  name: string;
  url: string;
  image: string;
  logo: string;
  telephone: string;
  email: string;
  priceRange: string;
  areaServed: string;
  openingHours: string[];
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
};

export function buildLocalBusinessJsonLd(): LocalBusinessJsonLdData {
  const baseUrl = getBaseUrl();
  const logoUrl = `${baseUrl}/images/brand/one-dental-logo.svg`;

  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "One Dental",
    url: baseUrl,
    image: logoUrl,
    logo: logoUrl,
    telephone: "+1-555-0100",
    email: "support@onedental.com",
    priceRange: "$$",
    areaServed: "Local community",
    openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-14:00"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Main Street",
      addressLocality: "City",
      addressRegion: "State",
      postalCode: "00000",
      addressCountry: "US",
    },
  };
}
