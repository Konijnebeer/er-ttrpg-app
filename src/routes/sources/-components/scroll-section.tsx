import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from "@/components/section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ScrollSectionProps {
  title:       string;
  description: string;
  children:    ReactNode;
  className?:  string;
}

function ScrollSection({
  title,
  description,
  children,
  className = "h-[30vh] h-max-[40vh]",
}: ScrollSectionProps) {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        <SectionDescription>{description}</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <ScrollArea className={cn("*:*:space-y-2", className)}>
          {children}
        </ScrollArea>
      </SectionContent>
    </Section>
  );
}

export { ScrollSection };
