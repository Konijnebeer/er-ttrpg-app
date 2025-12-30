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
import type { CustomTag } from "@/types/character";
import { toast } from "sonner";
import { customTagSchema } from "@/types/character";
import { z } from "zod";

const customTagFormSchema = customTagSchema.pick({ name: true }).extend({
  description: z.string(),
});

const inputValues: z.input<typeof customTagFormSchema> = {
  name:        "",
  description: "",
};

interface CreateTagDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTagDialog({ open, onOpenChange }: CreateTagDialogProps) {
  const { character, updateCharacter } = useCharacterStore();

  const tagForm = useForm({
    defaultValues: inputValues,
    validators:    {
      onSubmit: customTagFormSchema,
    },
    onSubmit: async ({ value }) => {
      const newTag: CustomTag = {
        // Filter out everyhting thats not an alpha numerical character, _ or - replace spaces with -
        id:          `${value.name.replace(/[^\w-]+/g, "").toLowerCase()}-${Date.now()}`,
        name:        value.name,
        description: value.description || undefined,
      };

      const updatedCustomTags = [...(character.data?.customTags || []), newTag];

      updateCharacter({
        data: {
          ...character.data,
          customTags: updatedCustomTags,
        },
      });

      toast.success(`Tag "${value.name}" created successfully`);
      tagForm.reset();
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) {
      tagForm.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create Custom Tag</DialogTitle>
          <DialogDescription>
            Add a custom tag to your character's collection.
          </DialogDescription>
        </DialogHeader>

        <form
          id="tag-form"
          onSubmit={(e) => {
            e.preventDefault();
            tagForm.handleSubmit();
          }}
        >
          <FieldGroup>
            <tagForm.Field
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
                      placeholder="Enter tag name"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <tagForm.Field
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
                      placeholder="Enter tag description (optional)"
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
              tagForm.reset();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" form="tag-form">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
