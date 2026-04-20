import { IMAGES } from "@/lib/constants/images";

export type LearnMoreSection = {
  heading: string;
  content: string;
};

export type LearnMoreContent = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  sections: LearnMoreSection[];
};

export const LEARN_MORE_CONTENT = {
  "preventive-care": {
    title: "Preventive Care",
    description:
      "Routine checkups, cleanings, and personalized guidance that help protect your smile before problems become urgent.",
    imageSrc: IMAGES.home.preventive,
    imageAlt: "Dentist preparing preventive dental care at One Dental",
    sections: [
      {
        heading: "What to expect",
        content:
          "Your visit starts with a gentle exam, professional cleaning, and a clear explanation of any findings. The goal is to help you understand your oral health and leave with practical next steps.",
      },
      {
        heading: "Why it matters",
        content:
          "Regular preventive visits make it easier to catch small concerns early, reduce avoidable treatment, and keep your teeth and gums healthy over time.",
      },
      {
        heading: "Best for",
        content:
          "Patients who want routine maintenance, gum health checks, plaque removal, oral hygiene coaching, or a family-friendly dental checkup.",
      },
    ],
  },
  "cosmetic-dentistry": {
    title: "Cosmetic Dentistry",
    description:
      "Smile-focused care for patients who want brighter, more balanced, and more confident results.",
    imageSrc: IMAGES.home.hero,
    imageAlt: "Smiling patient during a cosmetic dentistry consultation",
    sections: [
      {
        heading: "Designed around your goals",
        content:
          "Cosmetic treatment begins with a conversation about what you want to improve. From there, the team can recommend practical options based on your teeth, timeline, and comfort level.",
      },
      {
        heading: "Treatment options",
        content:
          "Depending on your needs, cosmetic care may include bonding, veneers, reshaping, whitening, or a phased smile plan that keeps each step manageable.",
      },
      {
        heading: "A natural finish",
        content:
          "The priority is a confident smile that still feels like you. Color, shape, proportion, and bite comfort are considered together.",
      },
    ],
  },
  "restorative-dentistry": {
    title: "Restorative Dentistry",
    description:
      "Care that repairs damaged teeth, restores function, and supports long-term comfort.",
    imageSrc: IMAGES.home.technology,
    imageAlt: "Modern dental tools for restorative treatment planning",
    sections: [
      {
        heading: "Restore strength and comfort",
        content:
          "Restorative dentistry focuses on repairing tooth structure so you can chew, speak, and smile with more confidence.",
      },
      {
        heading: "Clear recommendations",
        content:
          "The team explains what needs attention, which options are available, and what each step means before treatment begins.",
      },
      {
        heading: "Common needs",
        content:
          "Restorative visits may include fillings, crowns, replacement planning, bite evaluation, or follow-up care for worn or fractured teeth.",
      },
    ],
  },
  "teeth-whitening": {
    title: "Teeth Whitening",
    description:
      "Professional whitening support for patients who want a cleaner, brighter smile.",
    imageSrc: IMAGES.home.hero,
    imageAlt: "Patient smiling after professional teeth whitening care",
    sections: [
      {
        heading: "Professional guidance",
        content:
          "A whitening visit helps confirm whether whitening is appropriate for your teeth and which approach can give you a safe, noticeable result.",
      },
      {
        heading: "What affects results",
        content:
          "Shade improvement can depend on enamel condition, stain type, dental restorations, and habits such as coffee, tea, or tobacco use.",
      },
      {
        heading: "Aftercare",
        content:
          "The team can recommend simple steps to maintain your results and reduce sensitivity after whitening.",
      },
    ],
  },
  "dental-implants": {
    title: "Dental Implants",
    description:
      "Consultation and planning for long-term tooth replacement that feels stable and natural.",
    imageSrc: IMAGES.home.technology,
    imageAlt: "Dental implant consultation setup at One Dental",
    sections: [
      {
        heading: "Planning first",
        content:
          "Implant care starts with an evaluation of oral health, bone support, bite, and treatment timing so the plan fits your needs.",
      },
      {
        heading: "A stable replacement option",
        content:
          "Implants can help replace missing teeth with a fixed solution designed to support chewing, speech, and smile confidence.",
      },
      {
        heading: "Your consultation",
        content:
          "The team reviews your goals, explains possible timelines, and discusses whether additional preparation is needed before treatment.",
      },
    ],
  },
  "orthodontics-braces": {
    title: "Orthodontics and Braces",
    description:
      "Alignment care for patients who want straighter teeth, improved bite balance, and healthier spacing.",
    imageSrc: IMAGES.home.preventive,
    imageAlt: "Orthodontic consultation for clear aligners and braces",
    sections: [
      {
        heading: "Alignment with purpose",
        content:
          "Orthodontic care looks at both smile appearance and bite function, helping teeth move into a healthier and more balanced position.",
      },
      {
        heading: "Options to discuss",
        content:
          "Your consultation may cover braces, clear aligners, expected timelines, maintenance needs, and the best fit for your lifestyle.",
      },
      {
        heading: "Long-term support",
        content:
          "Retention and follow-up planning help protect your results after active alignment treatment is complete.",
      },
    ],
  },
  "modern-dental-clinic": {
    title: "Modern Clinic Comfort",
    description:
      "A calm, technology-supported dental experience designed to make every visit clear and comfortable.",
    imageSrc: IMAGES.home.technology,
    imageAlt: "Modern One Dental treatment room with comfortable equipment",
    sections: [
      {
        heading: "Comfortable spaces",
        content:
          "One Dental pairs modern treatment rooms with a warm team approach so visits feel organized, supportive, and low-stress.",
      },
      {
        heading: "Efficient workflows",
        content:
          "Digital-first processes help streamline scheduling, treatment planning, and follow-up communication.",
      },
      {
        heading: "Clear communication",
        content:
          "You can expect plain-language explanations, transparent next steps, and care recommendations that match your priorities.",
      },
    ],
  },
  "patient-first-care": {
    title: "Patient-First Dental Care",
    description:
      "A care philosophy built around listening, explaining, and helping patients feel confident at every step.",
    imageSrc: IMAGES.home.hero,
    imageAlt: "Dentist speaking with a patient during a One Dental consultation",
    sections: [
      {
        heading: "We listen first",
        content:
          "Your goals, concerns, budget, and comfort all shape the treatment conversation before any recommendation is made.",
      },
      {
        heading: "No rushed decisions",
        content:
          "The team explains findings and options clearly so you can choose the next step with confidence.",
      },
      {
        heading: "Care that continues",
        content:
          "Follow-up guidance, prevention planning, and responsive communication help support healthier smiles beyond a single visit.",
      },
    ],
  },
  "service-planning-support": {
    title: "Service Planning Support",
    description:
      "Guidance for choosing the right treatment path when you are not sure which service fits your concern.",
    imageSrc: IMAGES.home.preventive,
    imageAlt: "One Dental team reviewing treatment planning details",
    sections: [
      {
        heading: "Start with your concern",
        content:
          "You do not need to know the exact procedure before booking. Share what you are experiencing and the team can guide the appointment type.",
      },
      {
        heading: "Practical next steps",
        content:
          "Recommendations are organized around urgency, comfort, cost awareness, and long-term oral health.",
      },
      {
        heading: "Plan at your pace",
        content:
          "For larger needs, the team can help break care into manageable phases while keeping priorities clear.",
      },
    ],
  },
  "about-one-dental": {
    title: "About One Dental",
    description:
      "Learn more about the mission, values, and patient experience behind One Dental.",
    imageSrc: IMAGES.home.hero,
    imageAlt: "One Dental clinician welcoming a patient",
    sections: [
      {
        heading: "Built around trust",
        content:
          "One Dental focuses on transparent planning, gentle care, and long-term relationships with patients and families.",
      },
      {
        heading: "Modern but personal",
        content:
          "Technology supports the visit, but the experience stays human: clear explanations, respectful pacing, and practical support.",
      },
      {
        heading: "Ready for your first visit",
        content:
          "Whether you need prevention, treatment, or a second opinion, the team can help you choose a comfortable next step.",
      },
    ],
  },
} satisfies Record<string, LearnMoreContent>;

export type LearnMoreSlug = keyof typeof LEARN_MORE_CONTENT;

export function getLearnMoreContent(slug: string) {
  return LEARN_MORE_CONTENT[slug as LearnMoreSlug] ?? null;
}

export function getLearnMoreSlugs() {
  return Object.keys(LEARN_MORE_CONTENT);
}
