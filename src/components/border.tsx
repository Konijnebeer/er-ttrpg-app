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
          "h-[90vh] max-w-[90vw] xl:max-w-8xl w-full sm:rounded-4xl sm:border-4 pt-4 sm:p-6 flex flex-col overflow-hidden",
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
