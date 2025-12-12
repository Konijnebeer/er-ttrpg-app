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

  console.log(characters);

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
          <SectionTitle>Characters</SectionTitle>
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
          <CharacterCardGrid characters={characters} />
        </SectionContent>
      </Section>
    </Border>
  );
}
