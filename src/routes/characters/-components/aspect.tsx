import type { AspectReference } from "@/types/character";
import SpriteBorder from "../../../../public/ruins edges.svg";
import { useSourceStore } from "@/store/sourceStore";
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
import { PlusIcon } from "lucide-react";

export function AspectSection({
  aspects,
  className = "",
  onAddAspect,
}: {
  aspects:      AspectReference[];
  className?:   string;
  onAddAspect?: () => void;
}) {
  return (
    <Section className={className}>
      <SectionHeader>
        <SectionTitle>
          <h2>Aspects</h2>
        </SectionTitle>
        <SectionDescription>(Add 1d6 if appropriate)</SectionDescription>
        <SectionAction>
          <Button size="icon-sm" className="mr-4" onClick={onAddAspect}>
            <PlusIcon />
          </Button>
        </SectionAction>
      </SectionHeader>
      <SectionContent
        className={`${className === "col-span-3" ? "grid-cols-3" : "grid-cols-2"} grid gap-4`}
      >
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
  const { resolveRefrence } = useSourceStore();
  const { updateCharacter, character } = useCharacterStore();
  const aspectObject = resolveRefrence(aspect.ref, "aspects");

  const handleLevelChange = (newLevel: number) => {
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
  };

  if (!aspectObject) {
    return (
      <Card>
        <CardHeader>Aspect not found</CardHeader>
      </Card>
    );
  }
  return (
    <Card
      className="sprite-border"
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
        <CardAction> {aspectObject.category}</CardAction>
        <CardContent>
          <Track
            maxTrack={aspectObject.maxTrack}
            track={aspect.track}
            onChange={handleLevelChange}
          />
          Details: {aspectObject.description}
        </CardContent>
      </CardHeader>
    </Card>
  );
}
