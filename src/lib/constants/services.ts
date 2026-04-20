export type MarketingServiceIconKey =
  | "preventive"
  | "cosmetic"
  | "restorative"
  | "whitening"
  | "implant"
  | "orthodontics";

export type MarketingService = {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  durationMinutes?: number;
  priceLabel?: string;
  iconKey?: MarketingServiceIconKey;
};

export const STATIC_MARKETING_SERVICES: MarketingService[] = [
  {
    slug: "preventive-care",
    name: "Preventive Care",
    shortDescription: "Routine exams and cleanings that help prevent issues before they start.",
    longDescription:
      "Regular checkups, scaling, and personalized oral hygiene guidance to maintain long-term dental health.",
    durationMinutes: 45,
    priceLabel: "From ₱80",
    iconKey: "preventive",
  },
  {
    slug: "cosmetic-dentistry",
    name: "Cosmetic Dentistry",
    shortDescription: "Smile-focused treatments to improve confidence and overall aesthetics.",
    longDescription:
      "Options such as veneers, bonding, and smile design to enhance the look and symmetry of your teeth.",
    durationMinutes: 60,
    priceLabel: "From ₱180",
    iconKey: "cosmetic",
  },
  {
    slug: "restorative-dentistry",
    name: "Restorative Dentistry",
    shortDescription: "Restore damaged or missing tooth structure with durable treatment options.",
    longDescription:
      "Crowns, fillings, and other restorative procedures designed for function, comfort, and longevity.",
    durationMinutes: 75,
    priceLabel: "From ₱220",
    iconKey: "restorative",
  },
  {
    slug: "teeth-whitening",
    name: "Teeth Whitening",
    shortDescription: "Professional brightening care for a cleaner, more vibrant smile.",
    longDescription:
      "In-clinic whitening designed to safely lift stains and deliver noticeable results in less time.",
    durationMinutes: 45,
    priceLabel: "From ₱160",
    iconKey: "whitening",
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    shortDescription: "Long-term replacement solutions for missing teeth and bite stability.",
    longDescription:
      "Implant consultations and treatment planning for secure, natural-feeling tooth replacement.",
    durationMinutes: 90,
    priceLabel: "Consultation",
    iconKey: "implant",
  },
  {
    slug: "orthodontics-braces",
    name: "Orthodontics & Braces",
    shortDescription: "Straighten alignment and improve bite for a healthier, balanced smile.",
    longDescription:
      "Clear aligner and braces evaluations to plan correction with comfort and long-term oral benefits.",
    durationMinutes: 60,
    priceLabel: "From ₱120",
    iconKey: "orthodontics",
  },
];

export type StaticAppointmentServiceOption = {
  id: string;
  name: string;
  durationMinutes: number;
  description: string;
  basePrice: null;
  priceLabel?: string;
  iconKey?: MarketingServiceIconKey;
};

export function getStaticAppointmentServices(): StaticAppointmentServiceOption[] {
  return STATIC_MARKETING_SERVICES.map((service) => ({
    id: service.slug,
    name: service.name,
    durationMinutes: service.durationMinutes ?? 45,
    description: service.shortDescription,
    basePrice: null,
    priceLabel: service.priceLabel,
    iconKey: service.iconKey,
  }));
}
