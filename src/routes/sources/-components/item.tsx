import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from "@/components/section";
import {
  Item as ItemElement,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
  ItemFooter,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TagBadge } from "./tag";

import type { Item as ItemType } from "@/types/source";
import { useSourceStore } from "@/store/sourceStore";
import { ensureRefrence } from "@/lib/versioningHelpers";
import type { SourceKey } from "@/types/refrence";

import { Badge } from "@/components/ui/badge";

function ItemSection({
  items,
  sourceKey,
}: {
  items:     ItemType[];
  sourceKey: SourceKey;
}) {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Items</SectionTitle>
        <SectionDescription>Items within the source</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <ScrollArea className="h-[30vh] h-max-[40vh]">
          <div className="space-y-2">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} sourceKey={sourceKey} />
            ))}
          </div>
        </ScrollArea>
      </SectionContent>
    </Section>
  );
}

function ItemCard({
  item,
  sourceKey,
}: {
  item:      ItemType;
  sourceKey: SourceKey;
}) {
  const { resolveRefrence } = useSourceStore();
  return (
    <ItemElement variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>
            <span>{item.name}</span>
            <Badge variant="outline">{item.category}</Badge>
          </ItemTitle>
        </ItemHeader>
        <ItemDescription>{item.description}</ItemDescription>
        <ItemFooter>
          {item.tags &&
            item.tags.map((tag) => {
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
    </ItemElement>
  );
}

export { ItemSection };
