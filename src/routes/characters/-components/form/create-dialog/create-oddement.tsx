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
import type { CustomOddement } from "@/types/character";
import { toast } from "sonner";
import { customOddementSchema } from "@/types/character";
import z from "zod";


const customOddementFormSchema = customOddementSchema.pick({ name: true, description: true });

const inputvalues: z.input<typeof customOddementFormSchema> = {
  name:        "",
  description: "",
};

interface CreateItemDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOddementDialog({
  open,
  onOpenChange,
}: CreateItemDialogProps) {
  const { character, updateCharacter } = useCharacterStore();

  const oddementForm = useForm({
    defaultValues: inputvalues,
    validators:    {
      onSubmit: customOddementFormSchema,
    },
    onSubmit: async ({ value }) => {
      const newOddement: CustomOddement = {
        // Filter out everything that's not an alphanumeric character, _ or - replace spaces with -
        id:          `${value.name.replace(/[^\w-]+/g, "").toLowerCase()}-${Date.now()}`,
        name:        value.name,
        description: value.description,
      };

      const updatedCustomOddements = [
        ...(character.data.customOddements || []),
        newOddement,
      ];

      const updatedBackpackArray = [
        ...(character.data?.backpack.oddements || []),
        { ref: newOddement.id, quantity: 1, tags: [] },
      ];

      updateCharacter({
        data: {
          ...character.data,
          customOddements: updatedCustomOddements,
          backpack:        {
            ...character.data?.backpack,
            oddements: updatedBackpackArray,
          },
        },
      });

      toast.success(`Oddement "${value.name}" created successfully`);
      oddementForm.reset();
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) {
      oddementForm.reset();
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
          id="oddement-form"
          onSubmit={(e) => {
            e.preventDefault();
            oddementForm.handleSubmit();
          }}
        >
          <FieldGroup>
            <oddementForm.Field
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

            <oddementForm.Field
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
              oddementForm.reset();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" form="oddement-form">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
