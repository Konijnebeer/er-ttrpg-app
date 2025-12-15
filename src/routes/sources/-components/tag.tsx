import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from "@/components/section";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Tag } from "@/types/source";
import * as LucideIcons from "lucide-react";
import { X } from "lucide-react";

function getLucideIcon(name?: string) {
  if (!name) return null;
  const pascal = name
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return (LucideIcons as any)[pascal] ?? null;
}

function TagCard({ tag }: { tag: Tag }) {
  const Icon = getLucideIcon(tag.icon);
  const iconStyle = tag.color ? { color: tag.color } : undefined;

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>{tag.name}</ItemTitle>
          {tag.icon && (
            <ItemMedia>
              {Icon ? (
                <Icon style={iconStyle} className="w-5 h-5 inline mr-2" />
              ) : (
                <span
                  className="inline mr-2 text-muted-foreground"
                  style={iconStyle}
                >
                  {tag.icon}
                </span>
              )}
            </ItemMedia>
          )}
        </ItemHeader>
        <ItemDescription>{tag.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

function TagSection({ tags }: { tags: Tag[] }) {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Tags</SectionTitle>
        <SectionDescription>
          Tags within the source for Oddements
        </SectionDescription>
      </SectionHeader>
      <SectionContent>
        <ScrollArea className="h-[30vh] h-max-[40vh]">
          <div className="space-y-2">
            {tags.map((tag) => (
              <TagCard key={tag.id} tag={tag} />
            ))}
          </div>
        </ScrollArea>
      </SectionContent>
    </Section>
  );
}

function TagBadge({
  tag,
  onRemove,
  className,
  ...props
}: { tag: Tag; onRemove?: () => void } & React.ComponentProps<typeof Badge>) {
  const Icon = getLucideIcon(tag.icon);
  const iconStyle = tag.color ? { color: tag.color } : undefined;
  const classes = ["inline-flex items-center gap-1", className]
    .filter(Boolean)
    .join(" ");
  return (
    <Badge variant="outline" className={classes} {...props}>
      {Icon && (
        <Icon style={iconStyle} className="w-4 h-4" />
      )}
      {tag.name}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${tag.name}`}
          className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}

export { TagCard, TagSection, TagBadge };
