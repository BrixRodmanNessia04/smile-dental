import FloatingActionButtons from "@/components/layout/FloatingActionButtons";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteNavbar from "@/components/layout/SiteNavbar";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";

export default function SegmentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <LocalBusinessJsonLd />
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background pb-24 sm:pb-0">
        <SiteNavbar />
        {children}
        <SiteFooter />
        <FloatingActionButtons />
      </div>
    </>
  );
}
