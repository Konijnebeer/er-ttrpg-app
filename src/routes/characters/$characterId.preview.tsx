// Components
import { Border } from "@/components/border";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowBigLeftIcon } from "lucide-react";
import { toast } from "sonner";
// Sections
import { AspectSection } from "./-components/aspect";
import { AutoSaveIndicator } from "./-components/auto-save-indicator";
import { BackpackSection } from "./-components/backpack";
import { CharacterSection } from "./-components/character";
import { CharacterSidebar } from "./-components/sidebar";
import { SheetDropComponent } from "./-components/drag-and-drop";
import { EdgeSkillSection } from "./-components/edgeSkill";
import { CreateDialog } from "./-components/form/create-dialog/create-dialog";
// Helpers
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
// Stores
import { useCharacterStore } from "@/store/characterStore";
import { useSourceStore } from "@/store/sourceStore";
import { useDialogStore } from "@/store/dialogStore";

export const Route = createFileRoute("/characters/$characterId/preview")({
  component: CharacterPreview,
});

function CharacterPreview() {
  const { characterId } = Route.useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { open, type, closeDialog } = useDialogStore();

  const {
    character,
    loadCharacter,
    error: charError,
    isLoading: charLoading,
  } = useCharacterStore();
  const {
    sources,
    loadSources,
    error: sourceError,
    isLoading: sourceLoading,
  } = useSourceStore();

  useEffect(() => {
    const loadData = async () => {
      await loadCharacter(characterId);

      if (character.data) {
        const depSourceKeys = [
          character.versionRef,
          ...(character.dependencies ?? []),
        ];

        toast.promise(loadSources(depSourceKeys), {
          loading: `Loading ${depSourceKeys.length} source(s)...`,
          success: () => {
            const sourceList = depSourceKeys.join(", ");
            return `Sources loaded: ${sourceList}`;
          },
          error: (err) =>
            `Failed to load sources: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    };

    loadData();
  }, [
    characterId,
    loadCharacter,
    loadSources,
    character.versionRef,
    character.dependencies,
  ]);

  if (charLoading || sourceLoading) {
    return <div>Loading...</div>;
  }

  if (charError) {
    return <div>Character Error: {charError}</div>;
  }

  if (sourceError) {
    return <div>Source Error: {sourceError}</div>;
  }

  if (!character || !character.data) {
    return <div>Character not found</div>;
  }

  // Needed to stop errors of source not found even when they should not apear
  const depSourceKeys = [
    character.versionRef,
    ...(character.dependencies ?? []),
  ];
  const missingSources = depSourceKeys.filter((key) => !sources.has(key));
  if (missingSources.length > 0) {
    return <div>Missing source(s): {missingSources.join(", ")}</div>;
  }

  return (
    <SheetDropComponent>
      <Border>
        <Link to="/characters">
          <Button
            size="icon"
            className="fixed left-5 top-5 z-50"
            aria-label="Back to previous page"
          >
            <ArrowBigLeftIcon />
          </Button>
        </Link>
        <AutoSaveIndicator />
        <CharacterSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <CreateDialog open={open} onOpenChange={closeDialog} type={type} />
        <ScrollArea
          className={`h-[85vh] max-h-[90vh] w-full ${sidebarOpen ? "cursor-not-allowed" : ""}`}
        >
          <div
            className={`flex flex-col gap-4 md:grid md:grid-cols-2 xl:grid-cols-3 ${sidebarOpen ? "pointer-events-none" : ""}`}
          >
            <div className="md:col-span-1">
              <div className="pointer-events-none relative">
                <p className="-rotate-45 absolute font-bold text-md backdrop-blur-xs rounded-2xl p-2 -left-4 top-4">
                  Now Digital
                </p>
                <h1>
                  <img
                    src="/sheet-logo.png"
                    className="p-2"
                    alt="Eternal Ruins TTRPG logo"
                  />
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-around md:flex-col">
                <EdgeSkillSection
                  edgesSkills={character.data.edges}
                  type="edges"
                />
                <EdgeSkillSection
                  edgesSkills={character.data.skills}
                  type="skills"
                />
              </div>
            </div>
            <CharacterSection
              character={character.data.character}
              className={`md:col-span-1 ${sidebarOpen ? "xl:col-span-1 xl:row-start-1" : ""}`}
            />
            <BackpackSection
              items={character.data.backpack}
              className={`md:col-span-2 ${sidebarOpen ? "xl:col-span-1 xl:row-start-1" : "xl:col-span-1"}`}
            />
            <AspectSection
              aspects={character.data.aspects}
              className={
                sidebarOpen
                  ? "col-span-2 grid-cols-1 xl:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:col-span-2 xl:col-span-3"
              }
            />
          </div>
        </ScrollArea>
      </Border>
    </SheetDropComponent>
  );
}
