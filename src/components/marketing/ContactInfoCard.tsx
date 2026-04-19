import Card, { CardContent } from "@/components/ui/card";

type ContactInfoCardProps = {
  title: string;
  children: React.ReactNode;
};

export default function ContactInfoCard({ title, children }: ContactInfoCardProps) {
  return (
    <Card className="rounded-2xl border-border bg-card-strong">
      <CardContent className="p-4 sm:p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">{title}</h3>
        <div className="mt-2 text-sm text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  );
}
