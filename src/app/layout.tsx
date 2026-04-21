import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "One Dental Clinic - Professional Dental Care in Balayan, Batangas",
    template: "%s | One Dental Clinic",
  },
  description: "Experience top-quality dental care at One Dental Clinic in Balayan, Batangas. Book appointments online, receive personalized treatment plans, and maintain your oral health with our expert dentists.",
  keywords: ["dental clinic", "dentist", "teeth cleaning", "dental care", "Balayan", "Batangas", "oral health", "dental appointments"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
