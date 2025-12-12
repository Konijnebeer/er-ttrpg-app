import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCharacterStore } from "@/store/characterStore";
import { useSourceStore } from "@/store/sourceStore";
import { SquareChevronLeft } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Aspect, Item } from "@/types/source";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDraggable, useDroppable } from "@dnd-kit/core";

export function CharacterSidebar({
  open,
  onOpenChange,
  onCreateItem,
  onCreateAspect,
}: {
  open:            boolean;
  onOpenChange:    Dispatch<SetStateAction<boolean>>;
  onCreateItem?:   () => void;
  onCreateAspect?: () => void;
}) {
  const { setNodeRef } = useDroppable({
    id: "sidebar-drop-zone",
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed right-5 top-5 z-50"
          aria-label="Open Sidebar"
        >
          <SquareChevronLeft />
        </Button>
      </SheetTrigger>
      <SheetContent
        ref={setNodeRef}
        className="max-w-[70vw] md:min-w-[35vw]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <SheetHeader>
          <SheetTitle>Add Oddements, Relics, etc.</SheetTitle>
          <SheetDescription>
            Drag and drop items into the sheet, or right click and select amount
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="all" className="p-4 w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="core">Core</TabsTrigger>
            <TabsTrigger value="extra">Extra</TabsTrigger>
            <TabsTrigger value="self">Character</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ContentSection
              type="all"
              onCreateItem={onCreateItem}
              onCreateAspect={onCreateAspect}
            />
          </TabsContent>
          <TabsContent value="core">
            <ContentSection
              type="core"
              onCreateItem={onCreateItem}
              onCreateAspect={onCreateAspect}
            />
          </TabsContent>
          <TabsContent value="extra">
            <ContentSection
              type="extra"
              onCreateItem={onCreateItem}
              onCreateAspect={onCreateAspect}
            />
          </TabsContent>
          <TabsContent value="self">
            <ContentSection
              type="self"
              onCreateItem={onCreateItem}
              onCreateAspect={onCreateAspect}
            />
          </TabsContent>
        </Tabs>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ContentSection({
  type,
  onCreateItem,
  onCreateAspect,
}: {
  type:            "all" | "core" | "extra" | "self";
  onCreateItem?:   () => void;
  onCreateAspect?: () => void;
}) {
  const { getSourceDataArray } = useSourceStore();
  const { character } = useCharacterStore();
  const itemsCore = getSourceDataArray(character.versionRef, "items") ?? [];
  const itemsExtra = (character.dependencies ?? []).flatMap(
    (dep) => getSourceDataArray(dep, "items") ?? [],
  );
  const itemsCharacter = [] as Item[];

  const aspectsCore = getSourceDataArray(character.versionRef, "aspects") ?? [];
  const aspectsExtra = (character.dependencies ?? []).flatMap(
    (dep) => getSourceDataArray(dep, "aspects") ?? [],
  );
  const aspectsCharacter = [] as Aspect[];

  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  let content = [] as (Item | Aspect)[];

  if (type === "all" || type === "core") {
    content = [...itemsCore, ...aspectsCore];
  }
  if (type === "all" || type === "extra") {
    content = [...content, ...itemsExtra, ...aspectsExtra];
  }
  if (type === "all" || type === "self") {
    content = [...content, ...itemsCharacter, ...aspectsCharacter];
  }

  // Filter by category
  const filteredByCategory = content.filter((item) => {
    if (filter === "all") return true;
    return item.category.toLowerCase() === filter.toLowerCase();
  });

  // Filter by search query
  const filteredItems = filteredByCategory.filter((item) => {
    if (!searchQuery) return true;
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Card>
      <CardHeader>
        <div className="md:flex gap-2">
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectGroup>
                <SelectLabel>Backpack</SelectLabel>
                <SelectItem value="Oddement">Oddements</SelectItem>
                <SelectItem value="Fragment">Fragments</SelectItem>
                <SelectItem value="CampingGear">Camping Gear</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Aspects & Relics</SelectLabel>
                <SelectItem value="Trait">Traits</SelectItem>
                <SelectItem value="Gear">Gear</SelectItem>
                <SelectItem value="Habit">Habits</SelectItem>
                <SelectItem value="Relic">Relics</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {type === "self" && (
          <div className="flex items-center gap-2">
            <p>Create: </p>
            <Button size="sm" onClick={onCreateItem}>
              Item
            </Button>
            <Button size="sm">Tag</Button>
            <Button size="sm" onClick={onCreateAspect}>
              Aspect
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh]">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-sm text-zinc-500">
              No content found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ContentCard({ content }: { content: Item | Aspect }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id:   `content-${content.id}`,
    data: {
      content,
      type: "content",
    },
  });

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing"
    >
      <CardHeader className="flex flex-col md:grid">
        <CardTitle>{content.name}</CardTitle>
        <CardAction>{content.category}</CardAction>
      </CardHeader>
      <CardContent>
        {content.image && (
          <img
            src={`data:image/png;base64,${content.image}`}
            alt={content.name}
            className="h-32 aspect-square object-cover rounded-md mb-2"
          />
        )}
        <p className="text-sm text-zinc-600">{content.description}</p>
      </CardContent>
    </Card>
  );
}

export function ContentCardOverlay({ content }: { content: Item | Aspect }) {
  return (
    <Card className="cursor-grabbing shadow-2xl rotate-3 scale-105 animate-in zoom-in-95 duration-200">
      <CardHeader>
        <CardTitle>{content.name}</CardTitle>
        <CardAction>{content.category}</CardAction>
      </CardHeader>
      <CardContent>
        {content.image && (
          <img
            src={`data:image/png;base64,${content.image}`}
            alt={content.name}
            className="h-32 aspect-square object-cover rounded-md mb-2"
          />
        )}
        <p className="text-sm text-zinc-600">{content.description}</p>
      </CardContent>
    </Card>
  );
}
