import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";

import type { Fragment } from "@/types/source";
import { Badge } from "@/components/ui/badge";

function FragmentCard({ fragment }: { fragment: Fragment }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>
            <span>{fragment.name}</span>
            <Badge variant="outline">{fragment.type}</Badge>{" "}
          </ItemTitle>
        </ItemHeader>
        <ItemDescription>{fragment.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

export { FragmentCard };
