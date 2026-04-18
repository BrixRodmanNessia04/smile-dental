import { cn } from "@/lib/utils/cn";

import Skeleton from "./skeleton";

type LoadingSkeletonProps = {
  lines?: number;
  className?: string;
};

export default function LoadingSkeleton({ lines = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          className={cn("h-4 w-full", index === lines - 1 ? "w-3/5" : undefined)}
          key={index}
        />
      ))}
    </div>
  );
}
