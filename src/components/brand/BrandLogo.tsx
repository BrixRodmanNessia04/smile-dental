import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      alt="One Dental official logo"
      className={cn("h-auto w-full", className)}
      height={420}
      priority={priority}
      src="/images/brand/one-dental-logo.svg"
      width={1400}
    />
  );
}
