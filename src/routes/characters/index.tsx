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
import { CharacterCardGrid } from "./-components/character-card";
import { useEffect } from "react";
import { useCharacterStore } from "@/store/characterStore";
import { ArrowBigLeftIcon } from "lucide-react";

export const Route = createFileRoute("/characters/")({
  component: CharactersIndexPage,
});

export default function CharactersIndexPage() {
  const { characters, loadAllCharactersMetadata, isLoading } =
    useCharacterStore();

  useEffect(() => {
    loadAllCharactersMetadata();
  }, [loadAllCharactersMetadata]);

  if (isLoading) {
    return <div>loading...</div>;
  }
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
          <SectionTitle>Characters</SectionTitle>
          <SectionDescription>Manage your Characters here.</SectionDescription>
          <SectionAction>
            <Button variant="outline" asChild>
              <Link to="/characters/create">Create Character</Link>
            </Button>
              <Button variant="default" asChild>
            <Link to="/characters/import">
                Import Character
            </Link>
              </Button>
          </SectionAction>
        </SectionHeader>
        <SectionContent>
          <CharacterCardGrid characters={characters} />
        </SectionContent>
      </Section>
    </Border>
  );
}
