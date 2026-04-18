import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const NOT_PROVIDED = "Not provided";

const formatDate = (value: string | null) => {
  if (!value) {
    return NOT_PROVIDED;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return NOT_PROVIDED;
  }

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
};

const formatAddress = (details: {
  address_line: string | null;
  city: string | null;
  province: string | null;
}) => {
  const parts = [details.address_line, details.city, details.province]
    .map((value) => value?.trim())
    .filter((value) => Boolean(value));

  return parts.length > 0 ? parts.join(", ") : NOT_PROVIDED;
};

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-4 text-sm text-destructive">
          Unable to load your profile.
        </p>
      </main>
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, username, phone, created_at")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-4 text-sm text-destructive">
          Unable to load your profile details.
        </p>
      </main>
    );
  }

  const { data: details } = await supabase
    .from("patient_details")
    .select(
      "birth_date, sex, address_line, city, province, emergency_contact_name, emergency_contact_phone",
    )
    .eq("profile_id", profile.id)
    .maybeSingle();

  const fullName = `${profile.first_name} ${profile.last_name}`.trim() || profile.email;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
      <section>
        <h1 className="text-2xl font-semibold text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your patient account and contact information.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Full name:</span> {fullName}
            </p>
            <p>
              <span className="font-semibold text-foreground">Email:</span> {profile.email}
            </p>
            <p>
              <span className="font-semibold text-foreground">Username:</span>{" "}
              {profile.username ?? NOT_PROVIDED}
            </p>
            <p>
              <span className="font-semibold text-foreground">Phone:</span>{" "}
              {profile.phone ?? NOT_PROVIDED}
            </p>
            <p>
              <span className="font-semibold text-foreground">Patient since:</span>{" "}
              {formatDate(profile.created_at)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Birth date:</span>{" "}
              {formatDate(details?.birth_date ?? null)}
            </p>
            <p>
              <span className="font-semibold text-foreground">Sex:</span> {details?.sex ?? NOT_PROVIDED}
            </p>
            <p>
              <span className="font-semibold text-foreground">Address:</span>{" "}
              {details ? formatAddress(details) : NOT_PROVIDED}
            </p>
            <p>
              <span className="font-semibold text-foreground">Emergency contact:</span>{" "}
              {details?.emergency_contact_name ?? NOT_PROVIDED}
            </p>
            <p>
              <span className="font-semibold text-foreground">Emergency phone:</span>{" "}
              {details?.emergency_contact_phone ?? NOT_PROVIDED}
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
