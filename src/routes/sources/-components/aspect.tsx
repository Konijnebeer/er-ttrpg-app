import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Aspect } from "@/types/source";

function AspectSection({ aspects }: { aspects: Aspect[] }) {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Aspects</SectionTitle>
        <SectionDescription>Aspects within the source</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <ScrollArea className="h-[30vh] h-max-[40vh]">
          <div className="space-y-2">
            {aspects.map((aspect) => (
              <AspectCard key={aspect.id} aspect={aspect} />
            ))}
          </div>
        </ScrollArea>
      </SectionContent>
    </Section>
  );
}

function AspectCard({ aspect }: { aspect: Aspect }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>
            <span>{aspect.name}</span>
            <Badge variant="outline">{aspect.category}</Badge>
          </ItemTitle>
          <ItemActions className="font-semibold">
            {aspect.maxTrack && <span>Tracks: {aspect.maxTrack}</span>}
          </ItemActions>
        </ItemHeader>
        <ItemDescription>{aspect.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

export { AspectSection };
