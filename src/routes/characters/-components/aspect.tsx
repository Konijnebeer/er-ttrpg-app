import type { AspectReference } from "@/types/character";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Section,
  SectionAction,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import { useCharacterStore } from "@/store/characterStore";
import { Track } from "./track";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash } from "lucide-react";
import { useResolveReference } from "@/hooks/use-resolve-reference";
import { useDialogStore } from "@/store/dialogStore";

export function AspectSection({
  aspects,
  className = "",
}: {
  aspects:    AspectReference[];
  className?: string;
}) {
  const { openDialog } = useDialogStore();
  return (
    <Section className={className}>
      <SectionHeader>
        <SectionTitle>
          <h2>Aspects</h2>
        </SectionTitle>
        <SectionDescription>(Add 1d6 if appropriate)</SectionDescription>
        <SectionAction>
          <Button
            size="icon-sm"
            className="mr-4"
            onClick={() => openDialog("aspect")}
          >
            <PlusIcon />
          </Button>
        </SectionAction>
      </SectionHeader>
      <SectionContent className={`grid gap-4 ${className}`}>
        {aspects.map((aspect, index) => (
          <AspectCard key={index} aspect={aspect} aspectIndex={index} />
        ))}
      </SectionContent>
    </Section>
  );
}

function AspectCard({
  aspect,
  aspectIndex,
}: {
  aspect:      AspectReference;
  aspectIndex: number;
}) {
  const { resolveReference } = useResolveReference();
  const { updateCharacter, character } = useCharacterStore();
  const aspectObject = resolveReference(aspect.ref, "aspects");

  function handleLevelChange(newLevel: number) {
    if (!character?.data?.aspects) return;

    const updatedAspects = [...character.data.aspects];
    updatedAspects[aspectIndex] = {
      ...updatedAspects[aspectIndex],
      track: newLevel,
    };

    updateCharacter({
      data: {
        ...character.data,
        aspects: updatedAspects,
      },
    });
  }

  function onDelete() {
    // Remove aspect at aspectIndex
    const updatedAspects = character.data.aspects.filter(
      (_, i) => i !== aspectIndex,
    );
    if (!updatedAspects) return;

    updateCharacter({
      data: {
        ...character.data,
        aspects: updatedAspects,
      },
    });
  }

  if (!aspectObject) {
    return (
      <Card>
        <CardHeader>Aspect not found</CardHeader>
      </Card>
    );
  }
  return (
    <Card
      className="sprite-border gap-2 pb-2"
      //   style={{
      //     borderStyle:       "solid",
      //     borderWidth:       10, // match the 150px border thickness
      //     borderImageSource: `url(${SpriteBorder})`,
      //     borderImageSlice:  "90 fill", // nine-slice: 150px inset from each edge, keep center filled
      //     borderImageWidth:  "512px",
      //     borderImageRepeat: "repeat",
      //   }}
    >
      <CardHeader>
        <CardTitle>{aspectObject.name}</CardTitle>
        <CardAction className="flex items-center gap-2">
          <span>{aspectObject.category}</span>
          <Button variant="destructive" size="icon-sm" onClick={onDelete}>
            <Trash />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Track
          maxTrack={aspectObject.maxTrack}
          track={aspect.track}
          onChange={handleLevelChange}
        />
        <span>Effect: {aspectObject.effect}</span>
      </CardContent>
    </Card>
  );
}
