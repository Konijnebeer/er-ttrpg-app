import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import type { Aspect, AspectCatagory } from "@/types/source";
import type { CustomAspect } from "@/types/character";
import { customAspectSchema } from "@/types/character";
import { aspectCatagorySchema } from "@/types/source";
import { useState, useEffect } from "react";
import { useContentForm } from "@/hooks/content.form";
import { toast } from "sonner";
import sanitizeId from "@/lib/sanitizeId";
import { z } from "zod";

function AspectCard({ aspect }: { aspect: Aspect }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>
            <span>{aspect.name}</span>
            <Badge variant="outline">{aspect.category}</Badge>
          </ItemTitle>
          <ItemActions className="font-semibold">
            {aspect.maxTrack && <span>Tracks: {aspect.maxTrack}</span>}
          </ItemActions>
        </ItemHeader>
        <ItemDescription>{aspect.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

const customAspectFormSchema = customAspectSchema
  .pick({ name: true, category: true, maxTrack: true })
  .extend({
    description: z.string().min(2).max(200),
    effect:      z.string().min(2).max(400),
  });

function AspectEditCard({
  aspect,
  onUpdate,
  onDelete,
}: {
  aspect:   CustomAspect;
  onUpdate: (updatedAspect: CustomAspect) => void;
  onDelete: (aspect: CustomAspect) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Item variant="outline">
        <ItemContent>
          <ItemHeader>
            <ItemTitle>
              <span>{aspect.name}</span>
              <Badge variant="outline">{aspect.category}</Badge>
            </ItemTitle>
            <ItemActions className="font-semibold">
              {aspect.maxTrack && <span>Tracks: {aspect.maxTrack}</span>}
            </ItemActions>
          </ItemHeader>
          <ItemDescription>{aspect.description}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                aria-label={`Delete ${aspect.name}`}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Aspect?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{aspect.name}"? This action
                  cannot be undone after saving.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onDelete(aspect);
                    toast.success(`Aspect "${aspect.name}" deleted`);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={() => setDialogOpen(true)}>Edit</Button>
        </ItemActions>
      </Item>

      <AspectFormInlineDialog
        open={dialogOpen}
        setDialogOpen={setDialogOpen}
        isNew={false}
        aspect={aspect}
        onUpdate={onUpdate}
      />
    </>
  );
}

interface AspectFormInlineDialogProps {
  open:          boolean;
  isNew?:        boolean;
  aspect?:       CustomAspect;
  setDialogOpen: (open: boolean) => void;
  onCreate?:     (newAspect: CustomAspect) => void;
  onUpdate?:     (updatedAspect: CustomAspect) => void;
}

export function AspectFormInlineDialog({
  open,
  isNew = true,
  aspect,
  setDialogOpen,
  onCreate,
  onUpdate,
}: AspectFormInlineDialogProps) {
  let inputValues: z.input<typeof customAspectFormSchema>;
  if (isNew) {
    inputValues = {
      name:        "",
      description: "",
      effect:      "",
      maxTrack:    1,
      category:    "Trait" as AspectCatagory,
    };
  } else if (aspect) {
    inputValues = {
      name:        aspect.name,
      description: aspect.description,
      effect:      aspect.effect,
      maxTrack:    aspect.maxTrack,
      category:    aspect.category,
    };
  } else {
    throw new Error(
      "Aspect data must be provided when editing an existing aspect",
    );
  }

  const form = useContentForm({
    defaultValues: inputValues,
    validators:    {
      onSubmit: customAspectFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (isNew && onCreate) {
        const newAspect: CustomAspect = {
          id:          sanitizeId(value.name),
          name:        value.name,
          description: value.description,
          effect:      value.effect,
          maxTrack:    value.maxTrack,
          category:    value.category,
        };

        onCreate(newAspect);
        toast.success(`Aspect "${value.name}" created`);
        form.reset();
        setDialogOpen(false);
      } else if (!isNew && onUpdate) {
        const updatedAspect: Aspect = {
          ...aspect!,
          name:        value.name,
          description: value.description,
          effect:      value.effect,
          maxTrack:    value.maxTrack,
          category:    value.category,
        };

        onUpdate(updatedAspect);
        toast.success(`Aspect "${value.name}" updated`);
        setDialogOpen(false);
      } else {
        toast.error("No handler provided for form submission");
      }
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isNew ? "Create New Aspect" : "Edit Aspect"}
          </DialogTitle>
          <DialogDescription>
            {isNew
              ? "Add a new aspect to your character's collection."
              : "Update the aspect's details."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="aspect-inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name="name"
              children={(field) => <field.NameField label="Name" />}
            />
            <form.AppField
              name="category"
              children={(field) => (
                <field.OptionsField<AspectCatagory>
                  label="Category"
                  options={aspectCatagorySchema}
                  placeholder="Select category"
                />
              )}
            />
            <form.AppField
              name="maxTrack"
              children={(field) => (
                <field.NumberField label="Max Track" min={1} max={10} />
              )}
            />
            <form.AppField
              name="description"
              children={(field) => (
                <field.DescriptionField
                  label="Description"
                  maxCharacters={200}
                />
              )}
            />
            <form.AppField
              name="effect"
              children={(field) => (
                <field.DescriptionField label="Effect" maxCharacters={400} />
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" form="aspect-inline-form">
            {isNew ? "Create Aspect" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AspectCard, AspectEditCard };
