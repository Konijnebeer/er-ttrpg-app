import { Border } from "@/components/border";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionAction,
  SectionContent,
} from "@/components/section";
import { Button } from "@/components/ui/button";

import { SourceCardGrid } from "./sources/-components/source-card";
import { CharacterCardGrid } from "./characters/-components/character-card";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSourceStore } from "@/store/sourceStore";
import { useCharacterStore } from "@/store/characterStore";
import About from "@/components/about";

export const Route = createFileRoute("/")({
  component: SourcesIndexPage,
});

export default function SourcesIndexPage() {
  const {
    characters,
    loadAllCharactersMetadata,
    isLoading: isCharactersLoading,
  } = useCharacterStore();

  useEffect(() => {
    loadAllCharactersMetadata();
  }, [loadAllCharactersMetadata]);

  const {
    groupedSources,
    loadAllSourcesMetadata,
    isLoading: isSourcesLoading,
  } = useSourceStore();

  useEffect(() => {
    loadAllSourcesMetadata();
  }, [loadAllSourcesMetadata]);

  const latestSources = [
    ...groupedSources.Core.map((group) => group.metadata[0]),
    ...groupedSources.Extra.map((group) => group.metadata[0]),
  ].filter(Boolean);

  if (isSourcesLoading || isCharactersLoading) {
    return <div>loading...</div>;
  }

  return (
    <Border>
      <About />
      <Section className="pb-2">
        <SectionHeader>
          <Link to="/characters">
            <SectionTitle>Characters</SectionTitle>
          </Link>
          <SectionDescription>Manage your Characters here.</SectionDescription>
          <SectionAction>
            <Link to="/characters/create">
              <Button variant="outline">Create Character</Button>
            </Link>
            <Link to="/characters/import">
              <Button variant="default">Import Character</Button>
            </Link>
          </SectionAction>
        </SectionHeader>
        <SectionContent>
          <CharacterCardGrid characters={characters} className="h-[25vh] md:h-[40vh]" />
        </SectionContent>
      </Section>
      <Section>
        <SectionHeader>
          <Link to="/sources">
            <SectionTitle>Sources</SectionTitle>
          </Link>
          <SectionDescription>Manage your sources here.</SectionDescription>
          <SectionAction>
            <Button variant="outline" className="cursor-not-allowed w-fit">
              Create Source
            </Button>
            <Link to="/sources/import">
              <Button variant="default">Import Source</Button>
            </Link>
          </SectionAction>
        </SectionHeader>
        <SectionContent>
          <SourceCardGrid sources={latestSources} className="h-[25vh] md:h-[40vh]" />
        </SectionContent>
      </Section>
    </Border>
  );
}
