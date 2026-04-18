import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { USER_ROLES } from "@/lib/constants/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));

const getFullName = (profile: {
  first_name: string;
  last_name: string;
  email: string;
}) => {
  const fullName = `${profile.first_name} ${profile.last_name}`.trim();
  return fullName.length > 0 ? fullName : profile.email;
};

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: patients, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, phone, is_active, created_at")
    .eq("role", USER_ROLES.PATIENT)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-10">
      <section>
        <h1 className="text-2xl font-semibold text-foreground">Patients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review active patient records and contact details.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Patient directory</CardTitle>
          <CardDescription>Most recently created patient accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive">
              Unable to load patient records.
            </p>
          ) : !patients || patients.length === 0 ? (
            <p className="rounded-lg border border-border bg-card-strong p-3 text-sm text-muted-foreground">
              No patient records available.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="max-w-[12rem] break-words font-medium sm:max-w-none">
                      {getFullName(patient)}
                    </TableCell>
                    <TableCell className="break-all text-muted-foreground">{patient.email}</TableCell>
                    <TableCell className="text-muted-foreground">{patient.phone ?? "-"}</TableCell>
                    <TableCell>
                      <span className="rounded-full bg-primary-soft px-2 py-1 text-xs font-semibold text-primary-strong">
                        {patient.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(patient.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
