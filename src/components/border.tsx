import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Border({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div
        className={cn(
          "min-h-[90vh] max-h-[95vh] w-full max-w-[90vw] rounded-4xl border-4 border-primary p-6",
          className
        )}
      >
        {children}
      </div>
    </main>
  );
}
