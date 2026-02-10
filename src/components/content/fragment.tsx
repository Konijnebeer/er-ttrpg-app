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

import { fragmentTypeSchema, type Fragment, type FragmentType } from "@/types/source";
import  {customFragmentSchema, type CustomFragment } from "@/types/character";
import { useState, useEffect } from "react";
import { useContentForm } from "@/hooks/content.form";
import sanitizeId from "@/lib/sanitizeId";
import { z } from "zod";

function FragmentCard({ fragment }: { fragment: Fragment }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>
            <span>{fragment.name}</span>
            <Badge variant="outline">{fragment.type}</Badge>{" "}
          </ItemTitle>
        </ItemHeader>
        <ItemDescription>{fragment.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

function FragmentEditCard({
  fragment,
  onUpdate,
  onDelete,
}: {
  fragment: CustomFragment;
  onUpdate: (updatedFragment: CustomFragment) => void;
  onDelete: (fragment: CustomFragment) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Item variant="outline">
        <ItemContent>
          <ItemHeader>
            <ItemTitle>
              <span>{fragment.name}</span>
              <Badge variant="outline">{fragment.type}</Badge>
            </ItemTitle>
          </ItemHeader>
          <ItemDescription>{fragment.description}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <DeleteButton
            title="Fragment"
            name={fragment.name}
            onDelete={() => onDelete(fragment)}
          />
          <Button onClick={() => setDialogOpen(true)}>Edit</Button>
        </ItemActions>
      </Item>

      <FragmentFormInlineDialog
        open={dialogOpen}
        setDialogOpen={setDialogOpen}
        isNew={false}
        fragment={fragment}
        onUpdate={onUpdate}
      />
    </>
  );
}

const customFragmentFormSchema = customFragmentSchema
  .pick({ name: true, type: true })
  .extend({
    description: z.string(),
  });

interface FragmentFormInlineDialogProps {
  open:          boolean;
  isNew?:        boolean;
  fragment?:     CustomFragment;
  setDialogOpen: (open: boolean) => void;
  onCreate?:     (newFragment: CustomFragment) => void;
  onUpdate?:     (updatedFragment: CustomFragment) => void;
}

export function FragmentFormInlineDialog({
  open,
  isNew = true,
  fragment,
  setDialogOpen,
  onCreate,
  onUpdate,
}: FragmentFormInlineDialogProps) {
  let inputValues: z.input<typeof customFragmentFormSchema>;
  if (isNew) {
    inputValues = {
      name:        "",
      description: "",
      type:        "Feature" as FragmentType,
    };
  } else if (fragment) {
    inputValues = {
      name:        fragment.name,
      description: fragment.description || "",
      type:        fragment.type,
    };
  } else {
    throw new Error(
      "Fragment data must be provided when editing an existing fragment",
    );
  }

  const form = useContentForm({
    defaultValues: inputValues,
    validators:    {
      onSubmit: customFragmentFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (isNew && onCreate) {
        const newFragment: CustomFragment = {
          id:          sanitizeId(value.name),
          name:        value.name,
          description: value.description || undefined,
          type:        value.type,
        };

        onCreate(newFragment);
        toast.success(`Fragment "${value.name}" created`);
        form.reset();
        setDialogOpen(false);
      } else if (!isNew && onUpdate) {
        const updatedFragment: Fragment = {
          ...fragment!,
          name:        value.name,
          description: value.description || undefined,
          type:        value.type,
        };

        onUpdate(updatedFragment);
        toast.success(`Fragment "${value.name}" updated`);
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
            {isNew ? "Create New Fragment" : "Edit Fragment"}
          </DialogTitle>
          <DialogDescription>
            {isNew
              ? "Add a new fragment to your character's collection."
              : "Edit the details of your fragment."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="fragment-inline-form"
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
              name="type"
              children={(field) => (
                <field.OptionsField<FragmentType>
                  label="Type"
                  options={fragmentTypeSchema}
                  placeholder="Select fragment type"
                />
              )}
            />
            <form.AppField
              name="description"
              children={(field) => (
                <field.DescriptionField
                  label="Description"
                  maxCharacters={50}
                />
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
          <Button type="submit" form="fragment-inline-form">
            {isNew ? "Create Fragment" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { FragmentCard, FragmentEditCard };
