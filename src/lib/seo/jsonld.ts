import { getSiteBaseUrl } from "@/lib/seo/url";

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
  description?: string;
  sameAs?: string[];
  hasMap?: string;
};

export function buildLocalBusinessJsonLd(): LocalBusinessJsonLdData {
  const baseUrl = getSiteBaseUrl({ required: true });
  const logoUrl = `${baseUrl}/images/brand/one-dental-logo.svg`;
  const clinicImageUrl = `${baseUrl}/images/clinic/clinic-front.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "One Dental Clinic",
    url: baseUrl,
    image: clinicImageUrl,
    logo: logoUrl,
    telephone: "+639823312832",
    email: "support@onedental.com",
    priceRange: "₱₱",
    areaServed: "Balayan, Batangas",
    openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-14:00"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "105 Plaza Rizal",
      addressLocality: "Balayan",
      addressRegion: "Batangas",
      postalCode: "4213",
      addressCountry: "PH",
    },
    description:
      "One Dental Clinic provides dental care services in Balayan, Batangas.",
    sameAs: [
      "https://www.facebook.com/your-page",
      "https://www.instagram.com/your-page",
    ],
    hasMap: "https://maps.google.com/?q=105+Plaza+Rizal+Balayan+Batangas",
  };
}
