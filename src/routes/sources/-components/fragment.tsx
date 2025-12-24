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
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { Fragment } from "@/types/source";
import { Badge } from "@/components/ui/badge";

function FragmentSection({ fragments }: { fragments: Fragment[] }) {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Fragments</SectionTitle>
        <SectionDescription>Fragments within the source</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <ScrollArea className="h-[30vh] h-max-[40vh]">
          <div className="space-y-2">
            {fragments.map((fragments) => (
              <FragmentCard key={fragments.id} fragment={fragments} />
            ))}
          </div>
        </ScrollArea>
      </SectionContent>
    </Section>
  );
}

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

export { FragmentSection };
