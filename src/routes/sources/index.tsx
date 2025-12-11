import { Border } from "@/components/border";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionAction,
  SectionContent,
} from "@/components/section";
import { Button } from "@/components/ui/button";
import { SourceCardGrid } from "./-components/source-card";
import { useSourceStore } from "@/store/sourceStore";
import { useEffect } from "react";
import { ArrowBigLeftIcon } from "lucide-react";

export const Route = createFileRoute("/sources/")({
  component: SourcesIndexPage,
});

export default function SourcesIndexPage() {
  const { groupedSources, loadAllSourcesMetadata, isLoading } =
    useSourceStore();

  useEffect(() => {
    loadAllSourcesMetadata();
  }, [loadAllSourcesMetadata]);

  console.log(groupedSources);

  const latestSources = [
    ...groupedSources.Core.map((group) => group.metadata[0]),
    ...groupedSources.Extra.map((group) => group.metadata[0]),
  ].filter(Boolean);

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <Border>
      <Link to="/">
        <Button
          size="icon"
          className="fixed left-5 top-5 z-50"
          aria-label="Back to previous page"
        >
          <ArrowBigLeftIcon />
        </Button>
      </Link>
      <Section>
        <SectionHeader>
          <SectionTitle>Sources</SectionTitle>
          <SectionDescription>Manage your sources here.</SectionDescription>
          <SectionAction>
            <Button variant="secondary" className="cursor-not-allowed">
              Create Source
            </Button>
            <Link to="/sources/import">
              <Button variant="default">Import Source</Button>
            </Link>
          </SectionAction>
        </SectionHeader>
        <SectionContent>
          <SourceCardGrid sources={latestSources} />
        </SectionContent>
      </Section>
    </Border>
  );
}
