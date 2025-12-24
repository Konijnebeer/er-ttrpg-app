import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TagBadge } from "../../sources/-components/tag";
import type {
  ItemReference,
  OddementReference,
} from "@/types/character";
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
import { haveSameTags } from "@/lib/itemTagHelpers";

// Shared quantity input component
function QuantityControl({
  quantity,
  setQuantity,
}: {
  quantity:    number;
  setQuantity: (q: number) => void;
}) {
  return (
    <ButtonGroup>
      <Button
        size="icon-sm"
        onClick={() => setQuantity(quantity - 1)}
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
      <Button size="icon-sm" onClick={() => setQuantity(quantity + 1)}>
        <Plus />
      </Button>
    </ButtonGroup>
  );
}

// Oddement Card (with tags support)
function OddementCard({
  reference,
  index,
}: {
  reference: OddementReference;
  index:     number;
}) {
  const { resolveReference } = useResolveReference();
  const { character, updateCharacter } = useCharacterStore();
  const oddement = resolveReference(reference.ref, "oddements");

  if (!oddement) {
    return <p>Oddement Not Found</p>;
  }

  const [quantity, setQuantity] = useState<number>(reference.quantity);

  function removeTag(oddementRef: Reference) {
    const updatedBackpackArray = [...character.data.backpack.oddements];
    const oddementEntry = updatedBackpackArray[index];
    if (!oddementEntry) return;

    const nextTags = (oddementEntry.tags ?? []).filter(
      (tag) => tag !== oddementRef,
    );
    updatedBackpackArray[index] = {
      ...oddementEntry,
      tags: nextTags,
    };

    updateCharacter({
      data: {
        ...character.data,
        backpack: {
          ...character.data.backpack,
          oddements: updatedBackpackArray,
        },
      },
    });
  }

  // Update item when quantity changes
  useEffect(() => {
    const existingIndex = character.data.backpack.oddements.findIndex(
      (ref) =>
        ref.ref === reference.ref && haveSameTags(ref.tags, reference.tags),
    );
    if (existingIndex === -1) return;

    const updatedBackpackArray = [...character.data.backpack.oddements];
    updatedBackpackArray[existingIndex] = {
      ...updatedBackpackArray[existingIndex],
      quantity: quantity,
    };

    updateCharacter({
      data: {
        ...character.data,
        backpack: {
          ...character.data.backpack,
          oddements: updatedBackpackArray,
        },
      },
    });
  }, [quantity]);

  function onDelete() {
    const updatedBackpackArray = character.data.backpack.oddements.filter(
      (ref) =>
        !(ref.ref === reference.ref && haveSameTags(ref.tags, reference.tags)),
    );

    updateCharacter({
      data: {
        ...character.data,
        backpack: {
          ...character.data.backpack,
          oddements: updatedBackpackArray,
        },
      },
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="text-sm capitalize cursor-help">
          <span
            className={`font-semibold inline-block text-right ${reference.quantity < 10 ? "min-w-[2ch]" : "min-w-[3ch]"}`}
          >
            {reference.quantity}x
          </span>
          &nbsp;
          <span className="italic">{oddement.name}</span>
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
            <AddTagDialog itemIndex={index}>
              <Badge className="w-5.5 aspect-square p-0 cursor-pointer">
                <PlusIcon />
              </Badge>
            </AddTagDialog>
          </div>
        </header>
        <div className="mt-2">
          <div className="flex gap-4">
            <div className="flex-1">{oddement.description}</div>

            {oddement.image && (
              <div className="shrink-0 flex items-end">
                <img
                  src={`data:image/png;base64,${oddement.image}`}
                  alt={oddement.name}
                  className="h-16 w-auto object-contain rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <footer className="flex justify-between items-center">
          <QuantityControl quantity={quantity} setQuantity={setQuantity} />
          <Button size="icon-sm" onClick={onDelete}>
            <Trash />
          </Button>
        </footer>
      </PopoverContent>
    </Popover>
  );
}

// Fragment Card (no tags)
function FragmentCard({ reference }: { reference: ItemReference }) {
  const { resolveReference } = useResolveReference();
  const { character, updateCharacter } = useCharacterStore();
  const fragment = resolveReference(reference.ref, "fragments");

  if (!fragment) {
    return <p>Fragment Not Found</p>;
  }

  const [quantity, setQuantity] = useState<number>(reference.quantity);

  // Update item when quantity changes
  useEffect(() => {
    const existingIndex = character.data.backpack.fragments.findIndex(
      (ref) => ref.ref === reference.ref,
    );
    if (existingIndex === -1) return;

    const updatedBackpackArray = [...character.data.backpack.fragments];
    updatedBackpackArray[existingIndex] = {
      ...updatedBackpackArray[existingIndex],
      quantity: quantity,
    };

    updateCharacter({
      data: {
        ...character.data,
        backpack: {
          ...character.data.backpack,
          fragments: updatedBackpackArray,
        },
      },
    });
  }, [quantity]);

  function onDelete() {
    const updatedBackpackArray = character.data.backpack.fragments.filter(
      (ref) => ref.ref !== reference.ref,
    );

    updateCharacter({
      data: {
        ...character.data,
        backpack: {
          ...character.data.backpack,
          fragments: updatedBackpackArray,
        },
      },
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="text-sm capitalize cursor-help">
          <span
            className={`font-semibold inline-block text-right ${reference.quantity < 10 ? "min-w-[2ch]" : "min-w-[3ch]"}`}
          >
            {reference.quantity}x
          </span>
          &nbsp;
          <span className="italic">{fragment.name}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <header>
          <Badge>{fragment.type}</Badge>
        </header>
        <div className="mt-2">{fragment.description}</div>
        <footer className="flex justify-between items-center">
          <QuantityControl quantity={quantity} setQuantity={setQuantity} />
          <Button size="icon-sm" onClick={onDelete}>
            <Trash />
          </Button>
        </footer>
      </PopoverContent>
    </Popover>
  );
}

// Camping Gear Card (no tags, has stakes)
function CampingGearCard({ reference }: { reference: ItemReference }) {
  const { resolveReference } = useResolveReference();
  const { character, updateCharacter } = useCharacterStore();
  const campingGear = resolveReference(reference.ref, "campingGear") as any;

  if (!campingGear) {
    return <p>Camping Gear Not Found</p>;
  }

  const [quantity, setQuantity] = useState<number>(reference.quantity);

  // Update item when quantity changes
  useEffect(() => {
    const existingIndex = character.data.backpack.campingGear.findIndex(
      (ref) => ref.ref === reference.ref,
    );
    if (existingIndex === -1) return;

    const updatedBackpackArray = [...character.data.backpack.campingGear];
    updatedBackpackArray[existingIndex] = {
      ...updatedBackpackArray[existingIndex],
      quantity: quantity,
    };

    updateCharacter({
      data: {
        ...character.data,
        backpack: {
          ...character.data.backpack,
          campingGear: updatedBackpackArray,
        },
      },
    });
  }, [quantity]);

  function onDelete() {
    const updatedBackpackArray = character.data.backpack.campingGear.filter(
      (ref) => ref.ref !== reference.ref,
    );

    updateCharacter({
      data: {
        ...character.data,
        backpack: {
          ...character.data.backpack,
          campingGear: updatedBackpackArray,
        },
      },
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="text-sm capitalize cursor-help">
          <span
            className={`font-semibold inline-block text-right ${reference.quantity < 10 ? "min-w-[2ch]" : "min-w-[3ch]"}`}
          >
            {reference.quantity}x
          </span>
          &nbsp;
          <span className="italic">{campingGear.name}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <header>
          <Badge>
            {campingGear.stakes ? "Stakes: " + campingGear.stakes : "Free"}
          </Badge>
        </header>
        <div className="mt-2">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="text-md">{campingGear.description}</div>
              <div className="mt-2 italic text-sm">
                <strong>Effect:</strong> {campingGear.effect}
              </div>
            </div>

            {campingGear.image && (
              <div className="shrink-0 flex items-end">
                <img
                  src={`data:image/png;base64,${campingGear.image}`}
                  alt={campingGear.name}
                  className="h-16 w-auto object-contain rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <footer className="flex justify-between items-center">
          <QuantityControl quantity={quantity} setQuantity={setQuantity} />
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
  children,
}: {
  itemIndex: number;
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
    const currentItem = character.data.backpack.oddements[itemIndex];
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
  }, [allTags, character.data.backpack, itemIndex, search]);

  function addTag(tagRef: Reference) {
    const item = character.data.backpack.oddements[itemIndex];
    if (!item) return;
    const updatedItem = {
      ...item,
      tags: [...(item.tags || []), tagRef],
    };
    const updatedBackpackArray = [...character.data.backpack.oddements];
    updatedBackpackArray[itemIndex] = updatedItem;
    updateCharacter({
      data: {
        ...character.data,
        backpack: {
          ...character.data.backpack,
          oddements: updatedBackpackArray,
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

export { OddementCard, FragmentCard, CampingGearCard };
