import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemCard } from "./item";
import type { Backpack } from "@/types/character";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useDialogStore } from "@/store/dialogStore";

export function BackpackSection({
  items,
  className,
}: {
  items:      Backpack;
  className?: string;
}) {
  const { openDialog } = useDialogStore();

  return (
    <Section className={className}>
      <SectionHeader>
        <SectionTitle className="text-center flex items-center gap-2">
          <h2 className="flex-1 ml-10">Backpack </h2>
          <Button size="icon-sm" className="mr-4 -mb-1" onClick={() => openDialog("item")}>
            <PlusIcon />
          </Button>
        </SectionTitle>
      </SectionHeader>
      <SectionContent className="md:flex xl:grid md:flex-row gap-4 h-full">
        <div className="row-span-1 md:flex-1">
          <h3 className="font-semibold">Oddements</h3>
          <ScrollArea className="h-[120px]">
            <div className="flex flex-wrap items-center p-2 space-x-2">
              {items.oddements.map((item, index) => {
                return (
                  <ItemCard
                    key={`${item.ref}-${index}`}
                    reference={item}
                    index={index}
                    type="oddements"
                  />
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="row-span-1 md:flex-1">
          <h3 className="font-semibold">Fragments</h3>
          <ScrollArea className="h-[120px]">
            <div className="flex flex-wrap items-center p-2 space-x-2">
              {items.fragments.map((item, index) => {
                return (
                  <ItemCard
                    key={`${item.ref}-${index}`}
                    reference={item}
                    index={index}
                    type="fragments"
                  />
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="row-span-1 md:flex-1">
          <h3 className="font-semibold">Camping Gear</h3>
          <ScrollArea className="h-[120px]">
            <div className="flex flex-wrap items-center p-2 space-x-2">
              {items.campingGear.map((item, index) => {
                return (
                  <ItemCard
                    key={`${item.ref}-${index}`}
                    reference={item}
                    index={index}
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
