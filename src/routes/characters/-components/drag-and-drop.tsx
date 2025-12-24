import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { ContentCardOverlay } from "./sidebar";
import {
  DndContext,
  DragOverlay as DndDragOverlay,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { useCharacterStore } from "@/store/characterStore";
import type { Oddement, Fragment, CampingGear, Aspect } from "@/types/source";

type ItemUnion = Oddement | Fragment | CampingGear;
import { haveSameTags, normalizeTagsForRef } from "@/lib/itemTagHelpers";
import type { ItemReference, OddementReference } from "@/types/character";

export function DragOverlay({
  children,
  dropAnimation,
}: {
  children:       React.ReactNode;
  dropAnimation?: any;
}) {
  return (
    <DndDragOverlay dropAnimation={dropAnimation}>{children}</DndDragOverlay>
  );
}

export function SheetDropZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "sheet-drop-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-screen relative border-4 ${
        isOver
          ? " border-green-400 ring-2 ring-blue-500 ring-offset-2"
          : "border-transparent"
      }`}
    >
      {children}
    </div>
  );
}

export function SheetDropComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { character, updateCharacter } = useCharacterStore();

  const [activeContent, setActiveContent] = useState<ItemUnion | Aspect | null>(
    null,
  );
  const [pendingContent, setPendingContent] = useState<ItemUnion | Aspect | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [track, setTrack] = useState(0);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    if (active.data.current?.type === "content") {
      setActiveContent(active.data.current.content);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // If dropped on sidebar or nowhere, cancel
    if (!over || over.id === "sidebar-drop-zone") {
      setActiveContent(null);
      return;
    }

    // Only add if dropped on sheet
    if (over.id === "sheet-drop-zone") {
      const content = active.data.current?.content as ItemUnion | Aspect;

      // Open dialog with the content
      setPendingContent(content);

      // Set defaults based on content type
      if (content && isItem(content)) {
        setQuantity(1);
      } else if (content && "maxTrack" in content) {
        // It's an aspect
        setTrack(content.maxTrack);
      }

      setDialogOpen(true);
    }

    setActiveContent(null);
  }

  function handleCancel() {
    setDialogOpen(false);
    setPendingContent(null);
    setQuantity(1);
    setTrack(0);
  }

  function handleSave() {
    if (!pendingContent) return;

    if (isItem(pendingContent)) {
      // Determine which backpack array to use
      let backpackKey: keyof typeof character.data.backpack;
      
      // Determine type by checking properties
    if ('type' in pendingContent) {
        backpackKey = "fragments";
      } else if ('stakes' in pendingContent) {
        backpackKey = "campingGear";
      } else {
        backpackKey = "oddements";
      }

      // Limit to 1000
      if (quantity >= 1000) {
        setQuantity(1000);
      }

      // Only normalize tags for oddements
      const normalizedPendingTags = ('tags' in pendingContent && pendingContent.tags) 
        ? normalizeTagsForRef(pendingContent.id, pendingContent.tags)
        : undefined;

      const existingIndex = character.data.backpack[backpackKey].findIndex(
        (ref) => {
          if (backpackKey === "oddements") {
            return ref.ref === pendingContent.id && 
                   haveSameTags((ref as any).tags, normalizedPendingTags);
          }
          return ref.ref === pendingContent.id;
        },
      );

      const updatedBackpackArray = [...character.data.backpack[backpackKey]];

      if (existingIndex !== -1) {
        const existingItem = updatedBackpackArray[existingIndex];
        updatedBackpackArray[existingIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
        };
      } else {
        const newItem: OddementReference = {
          ref: pendingContent.id,
          quantity,
        };
        
        // Only add tags for oddements
        if (backpackKey === "oddements" && normalizedPendingTags) {
          newItem.tags = normalizedPendingTags;
        }
        
        updatedBackpackArray.push(newItem);
      }

      updateCharacter({
        data: {
          ...character.data,
          backpack: {
            ...character.data.backpack,
            [backpackKey]: updatedBackpackArray,
          },
        },
      });
    }

    if (isAspect(pendingContent)) {
      const updatedAspects = [
        ...character.data.aspects,
        {
          ref:   pendingContent.id,
          track: track,
        },
      ];
      updateCharacter({
        data: {
          ...character.data,
          aspects: updatedAspects,
        },
      });
    }
    // check if already in backpack
    // you can have multiple aspects, only 1 item

    toast.success(`Added ${pendingContent.name} to character`);

    setDialogOpen(false);
    setPendingContent(null);
    setQuantity(1);
    setTrack(0);
  }

  function isItem(content: ItemUnion | Aspect): content is ItemUnion {
    // Oddements have optional tags field
    // Fragments have type field
    // CampingGear has stakes and effect fields
    return (
      ('tags' in content || !('type' in content) && !('category' in content ) && !('stakes' in content)) ||
      'type' in content ||
      ('stakes' in content && 'effect' in content)
    );
  }

  function isAspect(content: ItemUnion | Aspect): content is Aspect {
    return (
      "category" in content &&
      (content.category === "Trait" ||
        content.category === "Gear" ||
        content.category === "Habit" ||
        content.category === "Relic")
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SheetDropZone>{children}</SheetDropZone>
      <DragOverlay dropAnimation={null}>
        {activeContent ? <ContentCardOverlay content={activeContent} /> : null}
      </DragOverlay>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Add {pendingContent?.name}</DialogTitle>
            <DialogDescription>
              Configure the{" "}
              {pendingContent && isItem(pendingContent)
                ? "quantity"
                : "track value"}{" "}
              before adding to your character.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {pendingContent && isItem(pendingContent) && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity || ""}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
            )}

            {pendingContent && isAspect(pendingContent) && (
              <div className="space-y-2">
                <Label htmlFor="track">
                  Track (max: {pendingContent.maxTrack})
                </Label>
                <Input
                  id="track"
                  type="number"
                  className="[appearance:textfield]"
                  min={0}
                  max={pendingContent.maxTrack}
                  value={track || ""}
                  onChange={(e) =>
                    setTrack(
                      Math.min(
                        parseInt(e.target.value) || 0,
                        pendingContent.maxTrack,
                      ),
                    )
                  }
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}
