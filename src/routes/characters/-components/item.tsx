import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TagBadge } from "../../sources/-components/tag";

import { useSourceStore } from "@/store/sourceStore";
import { ensureRefrence, parseRefrence } from "@/lib/versioningHelpers";
import type { ItemReference } from "@/types/character";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import type { Reference } from "@/types/refrence";
import { Input } from "@/components/ui/input";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { useCharacterStore } from "@/store/characterStore";
import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";

function ItemCard({
  reference,
  type,
}: {
  reference: ItemReference;
  type:      "oddements" | "fragments" | "campingGear";
}) {
  const { resolveRefrence } = useSourceStore();
  const { character, updateCharacter } = useCharacterStore();
  const item = resolveRefrence(reference.ref, "items");

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

  // Update item when quantity changes
  useEffect(() => {
    const existingIndex = character.data.backpack[type].findIndex(
      (ref) => ref.ref === item.id && haveSameTags(ref.tags, reference.tags),
    );
    if (existingIndex === -1) return; // Item not found, do nothing

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
      // @ts-expect-error
      (ref) => !(ref.ref === item.id && haveSameTags(ref.tags, reference.tags)),
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

  const { sourceKey } = parseRefrence(item.id);

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
          {reference.tags && reference.tags.length > 0 && (
            <div className="flex flex-wrap">
              {reference.tags.map((tag) => {
                const tagObject = resolveRefrence(
                  ensureRefrence(sourceKey, tag),
                  "tags",
                );
                if (!tagObject) {
                  return (
                    <span key={tag} className="mr-2 mb-2 inline-block">
                      Tag not Found
                    </span>
                  );
                }
                return (
                  <span key={tagObject.id} className="mr-2 mb-2 inline-block">
                    <TagBadge tag={tagObject} />
                  </span>
                );
              })}
            </div>
          )}
          {/* Optional from which source it comes */}
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
            <Trash></Trash>
          </Button>
        </footer>
      </PopoverContent>
    </Popover>
  );
}

function ItemDialog() {
  return (
    <Dialog>
      
    </Dialog>
  )
}

export { ItemCard };