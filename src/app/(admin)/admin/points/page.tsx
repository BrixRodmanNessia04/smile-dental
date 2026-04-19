import Link from "next/link";

import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Points management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="rounded-lg border border-warning-strong/30 bg-warning-soft p-4 text-sm text-warning-strong">
            Admin points UI is temporarily hidden while operational workflows are being updated.
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
