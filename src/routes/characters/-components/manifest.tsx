// Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
// Stores
import { useCharacterStore } from "@/store/characterStore";
// Helpers
import { useEffect, useState } from "react";
import { BASE_PATH } from "@/lib/constants";

export interface ManifestCharacter {
  id:       string;
  versions: ManifestVersion[];
}

export interface ManifestVersion {
  versionNumber: string;
  filename:      string;
  versionRef:    string;
  dependencies?: string[];
}

export default function CharacterManifestTree() {
  const { loadAllCharactersMetadata, characters } = useCharacterStore();
  const [manifest, setManifest] = useState<{
    characters: ManifestCharacter[];
  } | null>(null);

  useEffect(() => {
    loadAllCharactersMetadata();

    // Fetch manifest from public folder
    fetch(`${BASE_PATH}/characters/manifest.json`)
      .then((res) => res.json())
      .then((data) => setManifest(data))
      .catch((err) => console.error("Failed to load manifest:", err));
  }, [loadAllCharactersMetadata]);
  return (
    <Accordion type="single" collapsible className="w-fit">
      {manifest?.characters &&
        manifest.characters.map((character) => (
          <CharacterBranch
            key={character.id}
            character={character}
            characters={characters}
          />
        ))}
    </Accordion>
  );
}

function CharacterBranch({
  character,
  characters,
}: {
  character:  ManifestCharacter;
  characters: any[];
}) {
  return (
    <AccordionItem value={character.id}>
      <AccordionTrigger className="pb-2">{character.id}</AccordionTrigger>
      <AccordionContent className="pl-4">
        {character.versions &&
          character.versions.map((version) => (
            <VersionLeaf
              key={version.versionNumber}
              characterId={character.id}
              version={version}
              characters={characters}
            />
          ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function VersionLeaf({
  characterId,
  version,
  characters,
}: {
  characterId: string;
  version:     ManifestVersion;
  characters:  any[];
}) {
  const { downloadCharacter, deleteCharacter } = useCharacterStore();

  // Check if this character is already loaded
  const isLoaded = characters.some((char) => char.id === characterId);

  const handleDownload = async () => {
    toast.promise(downloadCharacter(characterId, version.filename), {
      loading: `Downloading ${characterId}...`,
      success: `Successfully downloaded ${characterId}`,
      error:   (error) =>
        `Failed to download: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  };

  const handleDelete = async () => {
    toast.promise(deleteCharacter(characterId), {
      loading: `Deleting ${characterId}...`,
      success: `Successfully deleted ${characterId}`,
      error:   (error) =>
        `Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  };

  return (
    <div className="flex gap-2 items-center mb-2">
      <Tooltip>
        <TooltipTrigger>
          <p>{version.versionNumber}</p>
        </TooltipTrigger>
        <TooltipContent>
          {/* Future feature checking if the dependency is installed show check if it is, disable download if any are not */}
          <Badge>
            <span className="font-semibold">Core Source: </span>
            {version.versionRef}
          </Badge>
          {version.dependencies &&
            version.dependencies.map((dependency) => (
              <Badge>
                <span className="font-semibold">Dependency: </span>
                {dependency}
              </Badge>
            ))}
        </TooltipContent>
      </Tooltip>
      {isLoaded ? (
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button size="icon-sm" variant="ghost">
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Delete Character</TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Character</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {characterId}? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon-sm" variant="ghost" onClick={handleDownload}>
              <Download />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download Character</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
