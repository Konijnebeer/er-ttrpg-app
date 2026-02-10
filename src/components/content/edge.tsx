import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import type { EdgeSkill } from "@/types/source";

function EdgeCard({ edge }: { edge: EdgeSkill }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>{edge.name}</ItemTitle>
          <ItemActions className="font-semibold">
            {edge.maxTrack && <span>Tracks: {edge.maxTrack}</span>}
          </ItemActions>
        </ItemHeader>
        <ItemDescription>{edge.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

export { EdgeCard };
