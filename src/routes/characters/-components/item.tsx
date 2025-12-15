import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TagBadge } from "../../sources/-components/tag";
import type { Backpack, ItemReference } from "@/types/character";
import { Button } from "@/components/ui/button";
import { Minus, Plus, PlusIcon, Trash } from "lucide-react";
import type { Reference } from "@/types/refrence";
import { Input } from "@/components/ui/input";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { useCharacterStore } from "@/store/characterStore";
import { useEffect, useMemo, useState } from "react";
import { useResolveReference } from "@/hooks/use-resolve-reference";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSourceStore } from "@/store/sourceStore";
import { useDialogStore } from "@/store/dialogStore";

function ItemCard({
  reference,
  type,
  index,
}: {
  reference: ItemReference;
  type:      keyof Backpack;
  index:     number;
}) {
  const { resolveReference } = useResolveReference();
  const { character, updateCharacter } = useCharacterStore();
  const item = resolveReference(reference.ref, "items");

  if (!item) {
    return <p>Item Not Found</p>;
  }

  const [quantity, setQuantity] = useState<number>(reference.quantity);

  // Helper to compare tags
  function haveSameTags(
    tags1: Reference[] | undefined,
    tags2: Reference[] | undefined,
  ): boolean {
    const arr1 = tags1 ?? [];
    const arr2 = tags2 ?? [];
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((tag, index) => tag === sorted2[index]);
  }

  function removeTag(tagRef: Reference) {
    const updatedBackpackArray = [...character.data.backpack[type]];
    const itemEntry = updatedBackpackArray[index];
    if (!itemEntry) return;

    const nextTags = (itemEntry.tags ?? []).filter((tag) => tag !== tagRef);
    updatedBackpackArray[index] = {
      ...itemEntry,
      tags: nextTags,
    };

    updateCharacter({
      data: {
        ...character.data,
        backpack: {
          ...character.data.backpack,
          [type]: updatedBackpackArray,
        },
      },
    });
  }

  // Update item when quantity changes
  useEffect(() => {
    const existingIndex = character.data.backpack[type].findIndex(
      (ref) =>
        ref.ref === reference.ref && haveSameTags(ref.tags, reference.tags),
    );
    if (existingIndex === -1) return;

    const updatedBackpackArray = [...character.data.backpack[type]];
    updatedBackpackArray[existingIndex] = {
      ...updatedBackpackArray[existingIndex],
      quantity: quantity,
    };

    updateCharacter({
      data: {
        ...character.data,
        backpack: {
          ...character.data.backpack,
          [type]: updatedBackpackArray,
        },
      },
    });
  }, [quantity]);

  function onDelete() {
    const updatedBackpackArray = character.data.backpack[type].filter(
      (ref) =>
        !(ref.ref === reference.ref && haveSameTags(ref.tags, reference.tags)),
    );

    updateCharacter({
      data: {
        ...character.data,
        backpack: {
          ...character.data.backpack,
          [type]: updatedBackpackArray,
        },
      },
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="text-sm capitalize cursor-help">
          <span className="font-semibold inline-block min-w-[3ch] text-right">
            {reference.quantity}x
          </span>
          &nbsp;
          <span className="italic">{item.name}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <header>
          <div className="flex flex-wrap gap-1">
            {reference.tags && reference.tags.length > 0 && (
              <>
                {reference.tags.map((tag) => {
                  const tagObject = resolveReference(tag, "tags");

                  if (!tagObject) {
                    return <Badge key={tag}>Tag not Found</Badge>;
                  }

                  return (
                    <TagBadge
                      tag={tagObject}
                      key={tagObject.id}
                      onRemove={() => removeTag(tag)}
                    />
                  );
                })}
              </>
            )}
            <AddTagDialog itemIndex={index} type={type}>
              <Badge className="w-5.5 aspect-square p-0 cursor-pointer">
                <PlusIcon />
              </Badge>
            </AddTagDialog>
          </div>
        </header>
        <div className="mt-2">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="text-md">{item.description}</div>
            </div>

            {item.image && (
              <div className="shrink-0 flex items-end">
                <img
                  src={`data:image/png;base64,${item.image}`}
                  alt={item.name}
                  className="h-16 w-auto object-contain rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <footer className="flex justify-between items-center">
          <ButtonGroup className="">
            <Button
              size="icon-sm"
              onClick={() => {
                setQuantity((quantity) => quantity - 1);
              }}
              disabled={quantity <= 1}
            >
              <Minus />
            </Button>
            <ButtonGroupText className="bg-primary border-none max-w-10 px-0 flex items-center justify-center">
              <Input
                className="h-auto text-primary-foreground max-w-10 text-center"
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setQuantity(0);
                    return;
                  }
                  const num = Number(val);
                  if (isNaN(num)) return;
                  setQuantity(Math.max(1, num));
                }}
              />
            </ButtonGroupText>
            <Button
              size="icon-sm"
              onClick={() => {
                setQuantity((quantity) => quantity + 1);
              }}
            >
              <Plus />
            </Button>
          </ButtonGroup>

          <Button size="icon-sm" onClick={onDelete}>
            <Trash />
          </Button>
        </footer>
      </PopoverContent>
    </Popover>
  );
}

function AddTagDialog({
  itemIndex,
  type,
  children,
}: {
  itemIndex: number;
  type:      keyof Backpack;
  children:  React.ReactNode;
}) {
  const { getAllSourcesDataArray } = useSourceStore();
  const { character, updateCharacter, getCharacterDataArray } =
    useCharacterStore();
  const allSourceTags = getAllSourcesDataArray("tags") ?? [];
  const allCustomTags = getCharacterDataArray("customTags") ?? [];
  const allTags = [...allSourceTags, ...allCustomTags];
  const [search, setSearch] = useState("");
  const { openDialog } = useDialogStore();

  const searchedTags = useMemo(() => {
    const currentItem = character.data.backpack[type]?.[itemIndex];
    const existingTagIds = new Set(currentItem?.tags ?? []);

    return allTags
      .filter((tag) => !existingTagIds.has(tag.id))
      .filter((tag) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          tag.name.toLowerCase().includes(q) ||
          (tag.description ?? "").toLowerCase().includes(q)
        );
      });
  }, [allTags, character.data.backpack, itemIndex, search, type]);

  function addTag(tagRef: Reference) {
    const item = character.data.backpack[type][itemIndex];
    if (!item) return;
    const updatedItem = {
      ...item,
      tags: [...(item.tags || []), tagRef],
    };
    const updatedBackpackArray = [...character.data.backpack[type]];
    updatedBackpackArray[itemIndex] = updatedItem;
    updateCharacter({
      data: {
        ...character.data,
        backpack: {
          ...character.data.backpack,
          [type]: updatedBackpackArray,
        },
      },
    });
  }

  return (
    <Dialog>
      {/* Element is slightly lower and/or larger then the badges  */}
      <DialogTrigger className="w-5 h-5 p-0 m-0 relative bottom-0.5">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tag to Item</DialogTitle>
          <DialogDescription>
            Search for an existing tag or create a new tag
          </DialogDescription>
        </DialogHeader>
        {/* Search bar shows all tags (badges) from every source  */}
        <div className="mb-4">
          <Input
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* List of tags as badges */}
        <div className="flex flex-wrap gap-2 mb-4 max-h-60 overflow-y-auto">
          {searchedTags.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tags found</p>
          ) : (
            searchedTags.map((tag) => (
              <DialogClose asChild key={tag.id}>
                <TagBadge
                  className="cursor-pointer"
                  tag={tag}
                  onClick={() => addTag(tag.id)}
                />
              </DialogClose>
            ))
          )}
          <Badge className="cursor-help" onClick={() => openDialog("tag")}>
            Custom Tag
            <PlusIcon />
          </Badge>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ItemCard };
