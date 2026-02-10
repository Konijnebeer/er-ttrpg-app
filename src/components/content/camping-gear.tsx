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
import { DeleteButton } from "@/components/content/delete-button";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { CampingGear } from "@/types/source";
import {
  customCampingGearSchema,
  type CustomCampingGear,
} from "@/types/character";
import { useState, useEffect } from "react";
import { useContentForm } from "@/hooks/content.form";
import sanitizeId from "@/lib/sanitizeId";
import { z } from "zod";

function CampingGearCard({ campingGear }: { campingGear: CampingGear }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Item variant="outline">
          <ItemContent>
            <ItemHeader>
              <ItemTitle>{campingGear.name}</ItemTitle>
              <ItemActions className="font-semibold">
                {campingGear.stakes ? "Stakes: " + campingGear.stakes : "Free"}
              </ItemActions>
            </ItemHeader>

            <ItemDescription>{campingGear.effect}</ItemDescription>
          </ItemContent>
        </Item>
      </PopoverTrigger>
      <PopoverContent>{campingGear.description}</PopoverContent>
    </Popover>
  );
}

const customCampingGearFormSchema = customCampingGearSchema
  .pick({ name: true, stakes: true })
  .extend({
    description: z.string(),
    effect:      z.string().min(5).max(500),
  });

function CampingGearEditCard({
  campingGear,
  onUpdate,
  onDelete,
}: {
  campingGear: CustomCampingGear;
  onUpdate:    (updatedCampingGear: CustomCampingGear) => void;
  onDelete:    (campingGear: CustomCampingGear) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Item variant="outline">
        <ItemContent>
          <ItemHeader>
            <ItemTitle>{campingGear.name}</ItemTitle>
            <ItemActions className="font-semibold">
              {campingGear.stakes ? "Stakes: " + campingGear.stakes : "Free"}
            </ItemActions>
          </ItemHeader>
          <ItemDescription>{campingGear.effect}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <DeleteButton
            title="Camping Gear"
            name={campingGear.name}
            onDelete={() => onDelete(campingGear)}
          />
          <Button onClick={() => setDialogOpen(true)}>Edit</Button>
        </ItemActions>
      </Item>

      <CampingGearFormInlineDialog
        open={dialogOpen}
        setDialogOpen={setDialogOpen}
        isNew={false}
        campingGear={campingGear}
        onUpdate={onUpdate}
      />
    </>
  );
}

interface CampingGearFormInlineDialogProps {
  open:          boolean;
  isNew?:        boolean;
  campingGear?:  CustomCampingGear;
  setDialogOpen: (open: boolean) => void;
  onCreate?:     (newCampingGear: CustomCampingGear) => void;
  onUpdate?:     (updatedCampingGear: CustomCampingGear) => void;
}

export function CampingGearFormInlineDialog({
  open,
  isNew = true,
  campingGear,
  setDialogOpen,
  onCreate,
  onUpdate,
}: CampingGearFormInlineDialogProps) {
  let inputValues: z.input<typeof customCampingGearFormSchema>;
  if (isNew) {
    inputValues = {
      name:        "",
      description: "",
      effect:      "",
      stakes:      0,
    };
  } else if (campingGear) {
    inputValues = {
      name:        campingGear.name,
      description: campingGear.description || "",
      effect:      campingGear.effect,
      stakes:      campingGear.stakes,
    };
  } else {
    throw new Error(
      "Camping gear data must be provided when editing an existing item",
    );
  }

  const form = useContentForm({
    defaultValues: inputValues,
    validators:    {
      onSubmit: customCampingGearFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (isNew && onCreate) {
        const newCampingGear: CustomCampingGear = {
          id:          sanitizeId(value.name),
          name:        value.name,
          description: value.description || undefined,
          effect:      value.effect,
          stakes:      value.stakes,
        };

        onCreate(newCampingGear);
        toast.success(`Camping Gear "${value.name}" created`);
        form.reset();
        setDialogOpen(false);
      } else if (!isNew && onUpdate) {
        const updatedCampingGear: CustomCampingGear = {
          ...campingGear!,
          name:        value.name,
          description: value.description || undefined,
          effect:      value.effect,
          stakes:      value.stakes,
        };

        onUpdate(updatedCampingGear);
        toast.success(`Camping Gear "${value.name}" updated`);
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
            {isNew ? "Create New Camping Gear" : "Edit Camping Gear"}
          </DialogTitle>
          <DialogDescription>
            {isNew
              ? "Add new camping gear to your character's collection."
              : "Edit the details of your camping gear."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="camping-gear-inline-form"
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
              name="stakes"
              children={(field) => (
                <field.NumberField label="Stakes" min={0} max={5} />
              )}
            />
            <form.AppField
              name="description"
              children={(field) => (
                <field.DescriptionField
                  label="Description"
                  maxCharacters={250}
                />
              )}
            />
            <form.AppField
              name="effect"
              children={(field) => (
                <field.DescriptionField label="Effect" maxCharacters={500} />
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
          <Button type="submit" form="camping-gear-inline-form">
            {isNew ? "Create Camping Gear" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { CampingGearCard, CampingGearEditCard };
