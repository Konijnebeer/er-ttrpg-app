import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

export function Border({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8 overflow-hidden">
      <div
        className={cn(
          "h-[90vh] w-full max-w-[90vw] rounded-4xl border-4 p-6 flex flex-col overflow-hidden",
          className,
        )}
      >
        {children}
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="absolute bottom-4 left-4 text-sm text-primary cursor-help select-none">
            Fan made
          </p>
        </TooltipTrigger>
        <TooltipContent>See info tab</TooltipContent>
      </Tooltip>
    </main>
  );
}
