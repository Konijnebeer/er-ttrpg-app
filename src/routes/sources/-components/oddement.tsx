import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from "@/components/section";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
  ItemFooter,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TagBadge } from "./tag";

import type { Oddement } from "@/types/source";
import { useSourceStore } from "@/store/sourceStore";
import { ensureRefrence } from "@/lib/versioningHelpers";
import type { SourceKey } from "@/types/refrence";

function OddementSection({
  oddements,
  sourceKey,
}: {
  oddements: Oddement[];
  sourceKey: SourceKey;
}) {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Oddements</SectionTitle>
        <SectionDescription>Oddements within the source</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <ScrollArea className="h-[30vh] h-max-[40vh]">
          <div className="space-y-2">
            {oddements.map((oddements) => (
              <OddementCard
                key={oddements.id}
                oddement={oddements}
                sourceKey={sourceKey}
              />
            ))}
          </div>
        </ScrollArea>
      </SectionContent>
    </Section>
  );
}

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

export { OddementSection };
