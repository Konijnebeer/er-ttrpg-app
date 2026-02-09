import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";

import type { CampingGear } from "@/types/source";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

export { CampingGearCard };
