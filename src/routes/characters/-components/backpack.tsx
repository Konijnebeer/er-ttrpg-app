import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemCardCharacter } from "@/routes/sources/-components/item";
import type { Backpack } from "@/types/character";

export function BackpackSection({
  items,
  className,
}: {
  items: Backpack;
  className?: string;
}) {
  return (
    <Section className={className}>
      <SectionHeader>
        <SectionTitle className="text-center">
          <h2>Backpack</h2>
        </SectionTitle>
      </SectionHeader>
      <SectionContent className="grid grid-rows-3 gap-4">
        <div className="row-span-1">
          <h3 className="font-semibold">Oddements</h3>
          <ScrollArea className="h-[120px]">
            <div className="flex flex-wrap items-center p-2 space-x-2">
              {items.oddements.map((item, index) => {
                return (
                  <ItemCardCharacter
                    key={`${item.ref}-${index}`}
                    reference={item}
                    type="oddements"
                  />
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="row-span-1">
          <h3 className="font-semibold">Fragments</h3>
          <ScrollArea className="h-[120px]">
            <div className="flex flex-wrap items-center p-2 space-x-2">
              {items.fragments.map((item, index) => {
                return (
                  <ItemCardCharacter
                    key={`${item.ref}-${index}`}
                    reference={item}
                    type="fragments"
                  />
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="row-span-1">
          <h3 className="font-semibold">Camping Gear</h3>
          <ScrollArea className="h-[120px]">
            <div className="flex flex-wrap items-center p-2 space-x-2">
              {items.campingGear.map((item, index) => {
                return (
                  <ItemCardCharacter
                    key={`${item.ref}-${index}`}
                    reference={item}
                    type="campingGear"
                  />
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </SectionContent>
    </Section>
  );
}
