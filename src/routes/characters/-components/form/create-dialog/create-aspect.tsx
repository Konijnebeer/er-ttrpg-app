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
import type { CustomAspect } from "@/types/character";
import { toast } from "sonner";
import { aspectSchema, type AspectCatagory } from "@/types/source";

interface CreateAspectDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAspectDialog({
  open,
  onOpenChange,
}: CreateAspectDialogProps) {
  const { character, updateCharacter } = useCharacterStore();

  const aspectFormSchema = aspectSchema.pick({
    name:        true,
    description: true,
    category:    true,
    maxTrack:    true,
  });

  const aspectForm = useForm({
    defaultValues: {
      name:        "",
      description: "",
      category:    "Trait" as AspectCatagory,
      maxTrack:    1,
    },
    validators: {
      onSubmit: aspectFormSchema,
    },
    onSubmit: async ({ value }) => {
      const newAspect: CustomAspect = {
        // Filter out everyhting thats not an alpha numerical character, _ or - replace spaces with -
        id:          `${value.name.replace(/[^\w-]+/g, "").toLowerCase()}-${Date.now()}`,
        name:        value.name,
        description: value.description,
        category:    value.category,
        maxTrack:    value.maxTrack,
      };

      const updatedCustomAspects = [
        ...(character.data?.customAspects || []),
        newAspect,
      ];

      const updatedAspects = [
        ...(character.data?.aspects || []),
        { ref: newAspect.id, track: 0 },
      ];

      updateCharacter({
        data: {
          ...character.data,
          aspects:       updatedAspects,
          customAspects: updatedCustomAspects,
        },
      });

      toast.success(`Aspect "${value.name}" created successfully`);
      aspectForm.reset();
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) {
      aspectForm.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create Custom Aspect</DialogTitle>
          <DialogDescription>
            Add a custom aspect to your character.
          </DialogDescription>
        </DialogHeader>

        <form
          id="aspect-form"
          onSubmit={(e) => {
            e.preventDefault();
            aspectForm.handleSubmit();
          }}
        >
          <FieldGroup>
            <aspectForm.Field
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
                      placeholder="Enter aspect name"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <aspectForm.Field
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
                          value as "Trait" | "Gear" | "Habit" | "Relic",
                        )
                      }
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trait">Trait</SelectItem>
                        <SelectItem value="Gear">Gear</SelectItem>
                        <SelectItem value="Habit">Habit</SelectItem>
                        <SelectItem value="Relic">Relic</SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <aspectForm.Field
              name="maxTrack"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Max Track</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      className="[appearance:textfield]"
                      min={1}
                      max={10}
                      value={field.state.value || ""}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <aspectForm.Field
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
                      placeholder="Enter aspect description (min 2 characters)"
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
                aspectForm.reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="aspect-form">Create</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
