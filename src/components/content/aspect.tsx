import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/content/delete-button";
import { toast } from "sonner";

import {
  aspectCatagorySchema,
  type Aspect,
  type AspectCatagory,
} from "@/types/source";
import { customAspectSchema, type CustomAspect } from "@/types/character";
import { useState, useEffect } from "react";
import { useContentForm } from "@/hooks/content.form";
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
          <DeleteButton
            title="Aspect"
            name={aspect.name}
            onDelete={() => onDelete(aspect)}
          />
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
