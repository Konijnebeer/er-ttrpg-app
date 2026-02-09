import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import type { Aspect } from "@/types/source";

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

export { AspectCard };
