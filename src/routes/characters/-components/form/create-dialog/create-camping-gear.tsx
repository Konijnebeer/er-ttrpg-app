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
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { useCharacterStore } from "@/store/characterStore";
import type { CustomCampingGear } from "@/types/character";
import { toast } from "sonner";
import { customCampingGearSchema } from "@/types/character";
import type z from "zod";

const customCampingGearFormSchema = customCampingGearSchema.pick({
  name:        true,
  description: true,
  effect:      true,
  stakes:      true,
});

const inputValues: z.input<typeof customCampingGearFormSchema> = {
  name:        "",
  description: "",
  effect:      "",
  stakes:      0,
};

interface CreateItemDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampingGearDialog({
  open,
  onOpenChange,
}: CreateItemDialogProps) {
  const { character, updateCharacter } = useCharacterStore();

  const campingGearForm = useForm({
    defaultValues: inputValues,
    validators:    {
      onSubmit: customCampingGearFormSchema,
    },
    onSubmit: async ({ value }) => {
      const newCampingGear: CustomCampingGear = {
        // Filter out everything that's not an alphanumeric character, _ or - replace spaces with -
        id:          `${value.name.replace(/[^\w-]+/g, "").toLowerCase()}-${Date.now()}`,
        name:        value.name,
        description: value.description,
        effect:      value.effect,
        stakes:      value.stakes,
      };

      const updatedCustomCampingGear = [
        ...(character.data.customCampingGear || []),
        newCampingGear,
      ];

      const updatedBackpackArray = [
        ...(character.data?.backpack.campingGear || []),
        { ref: newCampingGear.id, quantity: 1, tags: [] },
      ];

      updateCharacter({
        data: {
          ...character.data,
          customCampingGear: updatedCustomCampingGear,
          backpack:          {
            ...character.data?.backpack,
            campingGear: updatedBackpackArray,
          },
        },
      });

      toast.success(`Camping Gear "${value.name}" created successfully`);
      campingGearForm.reset();
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) {
      campingGearForm.reset();
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
          id="camping-gear-form"
          onSubmit={(e) => {
            e.preventDefault();
            campingGearForm.handleSubmit();
          }}
        >
          <FieldGroup>
            <campingGearForm.Field
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

            <campingGearForm.Field
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

            <campingGearForm.Field
              name="effect"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Effect</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Describe the effect of this camping gear"
                      rows={4}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <campingGearForm.Field
              name="stakes"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Stakes (0-5)</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      className="[appearance:textfield]"
                      min={0}
                      max={5}
                      value={field.state.value || ""}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      placeholder="0"
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
              campingGearForm.reset();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" form="camping-gear-form">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
