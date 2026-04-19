import Link from "next/link";

import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="rounded-lg border border-warning-strong/30 bg-warning-soft p-4 text-sm text-warning-strong">
            Admin notifications UI is temporarily hidden while we stabilize notification workflows.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/admin/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
