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
import { useDialogStore } from "@/store/dialogStore";
import { SquareChevronLeft, SquareChevronUp } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Aspect, Oddement, Fragment, CampingGear } from "@/types/source";
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
}: {
  open:         boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
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
          <SquareChevronLeft className="hidden md:block" />
          <SquareChevronUp className="md:hidden block" />
        </Button>
      </SheetTrigger>
      <SheetContent
        ref={setNodeRef}
        className="max-w-full max-h-[70vh] md:max-h-full md:min-w-[35vw] gap-0"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        side={window.innerWidth < 768 ? "bottom" : "right"}
      >
        <SheetHeader>
          <SheetTitle>Add Oddements, Relics, etc.</SheetTitle>
          <SheetDescription>
            Drag and drop items into the sheet, or right click and select amount
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="all" className="px-4 w-full flex-1 min-h-0">
          <TabsList className="w-full shrink-0">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="core">Core</TabsTrigger>
            <TabsTrigger value="extra">Extra</TabsTrigger>
            <TabsTrigger value="self">Character</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="flex-1 min-h-0">
            <ContentSection type="all" />
          </TabsContent>
          <TabsContent value="core" className="flex-1 min-h-0">
            <ContentSection type="core" />
          </TabsContent>
          <TabsContent value="extra" className="flex-1 min-h-0">
            <ContentSection type="extra" />
          </TabsContent>
          <TabsContent value="self" className="flex-1 min-h-0">
            <ContentSection type="self" />
          </TabsContent>
        </Tabs>
        <SheetFooter className="shrink-0 hidden md:flex">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ContentSection({ type }: { type: "all" | "core" | "extra" | "self" }) {
  const { getSourceDataArray } = useSourceStore();
  const { character, getCharacterDataArray } = useCharacterStore();

  // Oddements
  const oddementsCore =
    getSourceDataArray(character.versionRef, "oddements") ?? [];
  const oddementsExtra = (character.dependencies ?? []).flatMap(
    (dep) => getSourceDataArray(dep, "oddements") ?? [],
  );
  const oddementsCharacter = getCharacterDataArray("customOddements") ?? [];

  // Fragments
  const fragmentsCore =
    getSourceDataArray(character.versionRef, "fragments") ?? [];
  const fragmentsExtra = (character.dependencies ?? []).flatMap(
    (dep) => getSourceDataArray(dep, "fragments") ?? [],
  );
  const fragmentsCharacter = getCharacterDataArray("customFragments") ?? [];

  // Camping Gear
  const campingGearCore =
    getSourceDataArray(character.versionRef, "campingGear") ?? [];
  const campingGearExtra = (character.dependencies ?? []).flatMap(
    (dep) => getSourceDataArray(dep, "campingGear") ?? [],
  );
  const campingGearCharacter = getCharacterDataArray("customCampingGear") ?? [];

  // Aspects
  const aspectsCore = getSourceDataArray(character.versionRef, "aspects") ?? [];
  const aspectsExtra = (character.dependencies ?? []).flatMap(
    (dep) => getSourceDataArray(dep, "aspects") ?? [],
  );
  const aspectsCharacter = getCharacterDataArray("customAspects") ?? [];

  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  let content: (Oddement | Fragment | CampingGear | Aspect)[] = [];

  if (type === "all" || type === "core") {
    content = [
      ...oddementsCore,
      ...fragmentsCore,
      ...aspectsCore,
      ...campingGearCore,
    ] as (Oddement | Fragment | CampingGear | Aspect)[];
  }
  if (type === "all" || type === "extra") {
    content = [
      ...content,
      ...oddementsExtra,
      ...fragmentsExtra,
      ...aspectsExtra,
      ...campingGearExtra,
    ] as (Oddement | Fragment | CampingGear | Aspect)[];
  }
  if (type === "all" || type === "self") {
    content = [
      ...content,
      ...oddementsCharacter,
      ...fragmentsCharacter,
      ...aspectsCharacter,
      ...campingGearCharacter,
    ] as (Oddement | Fragment | CampingGear | Aspect)[];
  }

  // Filter by category
  const filteredByCategory = content.filter((item) => {
    if (filter === "all") return true;

    // Handle Oddements (have optional 'tags'), or no 'type', 'stakes', or 'category'
    if (
      ("tags" in item && filter === "Oddement") ||
      (!("type" in item) &&
        !("stakes" in item) &&
        !("category" in item) &&
        filter === "Oddement")
    )
      return true;

    // Handle Fragments (have 'type' instead of 'category')
    if ("type" in item && filter === "Fragment") return true;

    // Handle CampingGear (has 'stakes')
    if ("stakes" in item && filter === "CampingGear") return true;

    // Handle Aspects (have 'category')
    if ("category" in item) {
      return item.category.toLowerCase() === filter.toLowerCase();
    }

    return false;
  });

  // Filter by search query
  const filteredItems = filteredByCategory.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(query);
    const descriptionMatch = item.description?.toLowerCase().includes(query);
    return nameMatch || descriptionMatch;
  });

  return (
    <Card className="flex flex-col h-full min-h-0">
      <CardHeader className="shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[170px]">
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
        {type === "self" && <CreateButtons />}
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        <ScrollArea className="h-[70vh] md:h-full px-4">
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

function CreateButtons() {
  const { openDialog } = useDialogStore();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p>Create: </p>
      <Button size="sm" onClick={() => openDialog("oddement")}>
        Oddement
      </Button>
      <Button size="sm" onClick={() => openDialog("fragment")}>
        Fragment
      </Button>
      <Button size="sm" onClick={() => openDialog("camping-gear")}>
        Camping Gear
      </Button>
      <Button size="sm" onClick={() => openDialog("tag")}>
        Tag
      </Button>
      <Button size="sm" onClick={() => openDialog("aspect")}>
        Aspect
      </Button>
    </div>
  );
}

function ContentCard({
  content,
}: {
  content: Oddement | Fragment | CampingGear | Aspect;
}) {
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
        <CardAction>
          {"category" in content
            ? content.category
            : "type" in content
              ? `Fragment (${content.type})`
              : "stakes" in content
                ? "Camping Gear"
                : "Oddement"}
        </CardAction>
      </CardHeader>
      <CardContent>
        {"image" in content && content.image && (
          <img
            src={`data:image/png;base64,${content.image}`}
            alt={content.name}
            className="h-32 aspect-square object-cover rounded-md mb-2"
          />
        )}
        <p className="text-sm text-zinc-600">
          {"effect" in content && content.effect
            ? content.effect
            : content.description}
        </p>
      </CardContent>
    </Card>
  );
}

export function ContentCardOverlay({
  content,
}: {
  content: Oddement | Fragment | CampingGear | Aspect;
}) {
  return (
    <Card className="cursor-grabbing shadow-2xl rotate-3 scale-105 animate-in zoom-in-95 duration-200">
      <CardHeader>
        <CardTitle>{content.name}</CardTitle>
        <CardAction>
          {"category" in content
            ? content.category
            : "type" in content
              ? `Fragment (${content.type})`
              : "stakes" in content
                ? "Camping Gear"
                : "Oddement"}
        </CardAction>
      </CardHeader>
      <CardContent>
        {"image" in content && content.image && (
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
