import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from "@/components/section";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { CampingGear } from "@/types/source";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function CampingGearSection({ campingGear }: { campingGear: CampingGear[] }) {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Camping Gear</SectionTitle>
        <SectionDescription>Camping Gear within the source</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <ScrollArea className="h-[30vh] h-max-[40vh]">
          <div className="space-y-2">
            {campingGear.map((campingGear) => (
              <CampingGearCard key={campingGear.id} campingGear={campingGear} />
            ))}
          </div>
        </ScrollArea>
      </SectionContent>
    </Section>
  );
}

function CampingGearCard({ campingGear }: { campingGear: CampingGear }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Item variant="outline">
          <ItemContent>
            <ItemHeader>
              <ItemTitle>{campingGear.name}</ItemTitle>
              <ItemActions className="font-semibold">
                {campingGear.stakes ? "Stakes: " + campingGear.stakes : "Free"}
              </ItemActions>
            </ItemHeader>

            <ItemDescription>{campingGear.effect}</ItemDescription>
          </ItemContent>
        </Item>
      </PopoverTrigger>
      <PopoverContent>{campingGear.description}</PopoverContent>
    </Popover>
  );
}

export { CampingGearSection };
