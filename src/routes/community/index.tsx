import { Border } from "@/components/border";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CommunityResources } from "./-components/community-resources";
import { Button } from "@/components/ui/button";
import { ArrowBigLeftIcon } from "lucide-react";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/community/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Border>
      <Button
        asChild
        size="icon"
        className="fixed left-5 top-5 z-50"
        aria-label="Back to previous page"
      >
        <Link to="/">
          <ArrowBigLeftIcon />
        </Link>
      </Button>
      <Section>
        <SectionHeader>
          <SectionTitle>
            <h1>Cummunity made Resources</h1>
          </SectionTitle>
          <SectionDescription>Download from a curated list</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <ScrollArea className="h-[75vh]">
            <CommunityResources />
          </ScrollArea>
        </SectionContent>
      </Section>
    </Border>
  );
}
