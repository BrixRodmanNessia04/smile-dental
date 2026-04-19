import AdminServicesManager from "@/components/admin/AdminServicesManager";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listAdminServices } from "@/features/appointments/services/appointment-query.service";

export default async function Page() {
  const servicesResult = await listAdminServices();

  return (
    <main className="space-y-5">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-background">
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold text-foreground">Services</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Manage service catalog data used by both public pages and appointment booking.
          </p>
        </CardContent>
      </Card>

      {!servicesResult.ok ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Unable to load services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive">
              {servicesResult.message}
            </p>
          </CardContent>
        </Card>
      ) : (
        <AdminServicesManager services={servicesResult.data} />
      )}
    </main>
  );
}
