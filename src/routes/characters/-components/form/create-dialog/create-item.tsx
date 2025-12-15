import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { useCharacterStore } from "@/store/characterStore";
import type { CustomItem } from "@/types/character";
import { toast } from "sonner";
import { itemSchema, type ItemCategory } from "@/types/source";
import { z } from "zod";

interface CreateItemDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateItemDialog({
  open,
  onOpenChange,
}: CreateItemDialogProps) {
  const { character, updateCharacter } = useCharacterStore();

  const itemFormSchema = itemSchema
    .pick({ name: true, category: true })
    .extend({
      description: z.string(),
    });

  const itemForm = useForm({
    defaultValues: {
      name:        "",
      description: "",
      category:    "Oddement" as ItemCategory,
    },
    validators: {
      onSubmit: itemFormSchema,
    },
    onSubmit: async ({ value }) => {
      const newItem: CustomItem = {
        // Filter out everyhting thats not an alpha numerical character, _ or - replace spaces with -
        id:          `${value.name.replace(/[^\w-]+/g, "").toLowerCase()}-${Date.now()}`,
        name:        value.name,
        description: value.description || undefined,
        category:    value.category,
        tags:        [],
      };

      // Map category to backpack key
      let backpackKey: "oddements" | "fragments" | "campingGear";
      switch (value.category) {
        case "Oddement":
          backpackKey = "oddements";
          break;
        case "Fragment":
          backpackKey = "fragments";
          break;
        case "CampingGear":
          backpackKey = "campingGear";
          break;
      }

      const updatedCustomItems = [
        ...(character.data?.customItems || []),
        newItem,
      ];

      const updatedBackpackArray = [
        ...(character.data?.backpack[backpackKey] || []),
        { ref: newItem.id, quantity: 1, tags: [] },
      ];

      updateCharacter({
        data: {
          ...character.data,
          customItems: updatedCustomItems,
          backpack:    {
            ...character.data?.backpack,
            [backpackKey]: updatedBackpackArray,
          },
        },
      });

      toast.success(`Item "${value.name}" created successfully`);
      itemForm.reset();
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) {
      itemForm.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create Custom Item</DialogTitle>
          <DialogDescription>
            Add a custom item to your character's Backpack.
          </DialogDescription>
        </DialogHeader>

        <form
          id="item-form"
          onSubmit={(e) => {
            e.preventDefault();
            itemForm.handleSubmit();
          }}
        >
          <FieldGroup>
            <itemForm.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter item name"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <itemForm.Field
              name="category"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(
                          value as "Oddement" | "Fragment" | "CampingGear",
                        )
                      }
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oddement">Oddement</SelectItem>
                        <SelectItem value="Fragment">Fragment</SelectItem>
                        <SelectItem value="CampingGear">
                          Camping Gear
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <itemForm.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter item description (optional)"
                      rows={3}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              itemForm.reset();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" form="item-form">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
