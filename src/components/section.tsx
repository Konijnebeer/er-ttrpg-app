import * as React from "react";

import { cn } from "@/lib/utils";

function Section({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(" text-card-foreground flex flex-col gap-6", className)}
      {...props}
    />
  );
}

function SectionHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      // Need to figure out why -mb-3 is needed as theres is a lot of space under the header
      className={cn(
        " -mb-3 @container/card-header items-start md:space-y-0 space-y-2 md:grid auto-rows-min grid-rows-[auto_auto] gap-2 has-data-[slot=card-description]:grid-cols-[auto_1fr] has-data-[slot=card-action]:grid-cols-[auto_1fr_auto] border-b-primary border-b-2",

        className
      )}
      {...props}
    />
  );
}

function SectionTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold uppercase text-xl", className)}
      {...props}
    />
  );
}

function SectionDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-muted-foreground text-sm col-start-2 self-end justify-self-start",
        className
      )}
      {...props}
    />
  );
}

function SectionAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-3 row-span-2 row-start-1 self-start justify-self-end space-y-2 space-x-2 flex flex-col md:flex-row",
        className
      )}
      {...props}
    />
  );
}

function SectionContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-2", className)}
      {...props}
    />
  );
}

function SectionFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Section,
  SectionHeader,
  SectionFooter,
  SectionTitle,
  SectionAction,
  SectionDescription,
  SectionContent,
};
