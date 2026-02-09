import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Condition } from "@/types/source";

function ConditionCard({ condition }: { condition: Condition }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>
            <span>{condition.name}</span>
            <Badge variant="outline">{condition.type}</Badge>
          </ItemTitle>
          <ItemActions className="font-semibold">
            <span>Levels: {condition.levels.length}</span>
          </ItemActions>
        </ItemHeader>
        <ItemDescription>{condition.description}</ItemDescription>
        <ItemFooter className="justify-around mt-2">
          {condition.levels.map((level) => (
            <Popover key={level.level}>
              <PopoverTrigger asChild>
                <Badge className="cursor-pointer">Level: {level.level}</Badge>
              </PopoverTrigger>
              <PopoverContent>{level.description}</PopoverContent>
            </Popover>
          ))}
          {
            <Popover>
              <PopoverTrigger asChild>
                <Badge className="cursor-pointer">Final Moments</Badge>
              </PopoverTrigger>
              <PopoverContent>{condition.finalMoment}</PopoverContent>
            </Popover>
          }
        </ItemFooter>
      </ItemContent>
    </Item>
  );
}

export { ConditionCard };
