import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OddementCard, FragmentCard, CampingGearCard } from "./item";
import type { Backpack } from "@/types/character";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useDialogStore } from "@/store/dialogStore";
import { Badge } from "@/components/ui/badge";

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
        <SectionTitle className="text-center">
          <h2>Backpack </h2>
        </SectionTitle>
      </SectionHeader>
      <SectionContent className="md:flex xl:grid md:flex-row gap-4 h-full">
        <div className="row-span-1 md:flex-1">
          <div className="flex gap-2 items-center">
            <h3 className="font-semibold">Oddements</h3>
            <Button
              onClick={() => openDialog("oddement")}
              size="icon-sm"
              className="h-6 w-6"
            >
              <PlusIcon />
            </Button>
          </div>
          <ScrollArea className="h-[120px]">
            <div className="flex flex-wrap items-center p-2 space-x-2">
              {items.oddements.map((item, index) => {
                return (
                  <OddementCard
                    key={`${item.ref}-${index}`}
                    reference={item}
                    index={index}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="row-span-1 md:flex-1">
          <div className="flex gap-2 items-center">
            <h3 className="font-semibold">Fragments</h3>
            <Button
              onClick={() => openDialog("fragment")}
              size="icon-sm"
              className="h-6 w-6"
            >
              <PlusIcon />
            </Button>
          </div>{" "}
          <ScrollArea className="h-[120px]">
            <div className="flex flex-wrap items-center p-2 space-x-2">
              {items.fragments.map((item, index) => {
                return (
                  <FragmentCard key={`${item.ref}-${index}`} reference={item} />
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="row-span-1 md:flex-1">
          <div className="flex gap-2 items-center">
            <h3 className="font-semibold">Camping Gear</h3>
            <Button
              onClick={() => openDialog("camping-gear")}
              size="icon-sm"
              className="h-6 w-6"
            >
              <PlusIcon />
            </Button>
          </div>
          <ScrollArea className="h-[120px]">
            <div className="flex flex-wrap items-center p-2 space-x-2">
              {items.campingGear.map((item, index) => {
                return (
                  <CampingGearCard
                    key={`${item.ref}-${index}`}
                    reference={item}
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
