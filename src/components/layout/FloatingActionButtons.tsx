import Image from "next/image";

import { MESSENGER_URL } from "@/lib/constants/clinic";

export default function FloatingActionButtons() {
  return (
    <div
      aria-label="Quick booking actions"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-30 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      <a
        href={MESSENGER_URL}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-md backdrop-blur transition hover:scale-105"
      >
        <Image
          src="/icons/Messenger_Icon_Primary_Blue.svg"
          alt="Chat on Messenger"
          width={35}
          height={35}
          className="h-9 w-9 sm:h-11 sm:w-11"
        />

        <span className="hidden text-sm font-semibold text-foreground sm:inline">
          Contact us in Messenger
        </span>
      </a>
    </div>
  );
}
