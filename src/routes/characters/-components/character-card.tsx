import type { CharacterMetadata, CharacterSelf } from "@/types/character";
import {
  Card,
  CardHeader,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCharacterStore } from "@/store/characterStore";

function CharacterCard({
  character,
}: {
  character: CharacterMetadata & { character: CharacterSelf };
}) {
  const date = new Date(character.dateModified * 1000);
  const formatedDate = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`;
  const { exportCharacter } = useCharacterStore();

  function exportFunction() {
    toast.promise(exportCharacter(character.id), {
      loading: "Exporting character...",
      success: "Character exported successfully!",
      error:   "Failed to export character.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{character.name}</CardTitle>
        <CardDescription></CardDescription>
        <CardAction>
          <span className="text-sm italic">{formatedDate}</span>
        </CardAction>
      </CardHeader>
      <CardContent>{character.description}</CardContent>
      <CardFooter className="flex flex-wrap space-y-4 md:space-y-0 space-x-4 justify-between w-full mt-auto">
        <div>
          <p>
            <span className="font-semibold">Origin: </span>
            <span>{character.character.origin}</span>
          </p>
          <p>
            <span className="font-semibold">Path: </span>
            <span>{character.character.path}</span>
          </p>
        </div>
        <div className="flex gap-2 self-end">
          {/* <Link
            to="/characters/$characterId/edit"
            params={{
              characterId: character.id,
            }}
          >
          <Button variant="outline" className="cursor-not-allowed">
            Edit
          </Button>
          </Link> */}
          <Button variant="outline" onClick={exportFunction}>
            Export
          </Button>
          <Link
            to="/characters/$characterId/preview"
            params={{
              characterId: character.id,
            }}
          >
            <Button variant="default">Open</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function CharacterCardGrid({
  characters,
  className,
}: {
  characters: (CharacterMetadata & { character: CharacterSelf })[];
  className?: string;
}) {
  return (
    <ScrollArea className={cn("h-[75vh] max-h-[80vh] w-full", className)}>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </ScrollArea>
  );
}

export { CharacterCard, CharacterCardGrid };
