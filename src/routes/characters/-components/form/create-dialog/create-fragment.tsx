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
import type { CustomFragment } from "@/types/character";
import { toast } from "sonner";
import { customFragmentSchema } from "@/types/character";
import { fragmentTypeSchema, type FragmentType } from "@/types/source";
import type z from "zod";

const customFragmentFormSchema = customFragmentSchema.pick({
  name:        true,
  description: true,
  type:        true,
});

const inputvalues: z.input<typeof customFragmentFormSchema> = {
  name:        "",
  description: "",
  type:        "Feature"
};

interface CreateItemDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFragmentDialog({
  open,
  onOpenChange,
}: CreateItemDialogProps) {
  const { character, updateCharacter } = useCharacterStore();

  const fragmentForm = useForm({
    defaultValues: inputvalues,
    validators:    {
      onSubmit: customFragmentFormSchema,
    },
    onSubmit: async ({ value }) => {
      const newFragment: CustomFragment = {
        // Filter out everything that's not an alphanumeric character, _ or - replace spaces with -
        id:          `${value.name.replace(/[^\w-]+/g, "").toLowerCase()}-${Date.now()}`,
        name:        value.name,
        description: value.description,
        type:        value.type,
      };

      const updatedCustomFragments = [
        ...(character.data.customFragments || []),
        newFragment,
      ];

      const updatedBackpackArray = [
        ...(character.data?.backpack.fragments || []),
        { ref: newFragment.id, quantity: 1, tags: [] },
      ];

      updateCharacter({
        data: {
          ...character.data,
          customFragments: updatedCustomFragments,
          backpack:        {
            ...character.data?.backpack,
            fragments: updatedBackpackArray,
          },
        },
      });

      toast.success(`Fragment "${value.name}" created successfully`);
      fragmentForm.reset();
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) {
      fragmentForm.reset();
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
          id="fragment-form"
          onSubmit={(e) => {
            e.preventDefault();
            fragmentForm.handleSubmit();
          }}
        >
          <FieldGroup>
            <fragmentForm.Field
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

            <fragmentForm.Field
              name="type"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as FragmentType)
                      }
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fragmentTypeSchema.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <fragmentForm.Field
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
              fragmentForm.reset();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" form="fragment-form">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
