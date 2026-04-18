import type { ReactNode } from "react";

type PageShellProps = {
  sidebar?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
};

export default function PageShell({ sidebar, header, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 md:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[280px_1fr] lg:items-start">
          {sidebar ? <aside className="hidden lg:block lg:sticky lg:top-5">{sidebar}</aside> : null}
          <main className="space-y-5">
            {sidebar ? <div className="lg:hidden">{sidebar}</div> : null}
            {header}
            <div className="space-y-5">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
