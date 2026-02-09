import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
  ItemFooter,
} from "@/components/ui/item";
import { TagBadge } from "./tag";

import type { Oddement } from "@/types/source";
import { useSourceStore } from "@/store/sourceStore";
import { ensureRefrence } from "@/lib/versioningHelpers";
import type { SourceKey } from "@/types/refrence";

function OddementCard({
  oddement,
  sourceKey,
}: {
  oddement:  Oddement;
  sourceKey: SourceKey;
}) {
  const { resolveRefrence } = useSourceStore();
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>{oddement.name}</ItemTitle>
        </ItemHeader>
        <ItemDescription>{oddement.description}</ItemDescription>
        <ItemFooter>
          {oddement.tags &&
            oddement.tags.map((tag) => {
              const tagObject = resolveRefrence(
                ensureRefrence(sourceKey, tag),
                "tags",
              );
              if (!tagObject) {
                return <p>Tag not Foud</p>;
              }
              return (
                <span key={tagObject.id} className="mr-2 mb-2 inline-block">
                  <TagBadge tag={tagObject} />
                </span>
              );
            })}
        </ItemFooter>
      </ItemContent>
    </Item>
  );
}

export { OddementCard };
