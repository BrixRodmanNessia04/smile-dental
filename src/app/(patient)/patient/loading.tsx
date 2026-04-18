import Card, { CardContent } from "@/components/ui/card";
import LoadingSkeleton from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <LoadingSkeleton lines={2} />
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <LoadingSkeleton lines={3} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
