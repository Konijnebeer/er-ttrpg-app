import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
  ItemFooter,
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

import { TagBadge } from "@/components/content/tag";

import type { Oddement } from "@/types/source";
import { useSourceStore } from "@/store/sourceStore";
import { ensureRefrence } from "@/lib/versioningHelpers";
import type { SourceKey } from "@/types/refrence";
import { customOddementSchema, type CustomOddement } from "@/types/character";
import z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useContentForm } from "@/hooks/content.form";
import sanitizeId from "@/lib/sanitizeId";

function OddementCard({
  oddement,
  sourceKey,
}: {
  oddement:  Oddement;
  sourceKey: SourceKey;
}) {
  const { resolveRefrence } = useSourceStore();
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>{oddement.name}</ItemTitle>
        </ItemHeader>
        <ItemDescription>{oddement.description}</ItemDescription>
        <ItemFooter>
          {oddement.tags &&
            oddement.tags.map((tag, i) => {
              const tagObject = resolveRefrence(
                ensureRefrence(sourceKey, tag),
                "tags",
              );
              if (!tagObject) {
                return <p key={i}>Tag not Found</p>;
              }
              return (
                <span key={tagObject.id} className="mr-2 mb-2 inline-block">
                  <TagBadge tag={tagObject} />
                </span>
              );
            })}
        </ItemFooter>
      </ItemContent>
    </Item>
  );
}

function OddementEditCard({
  oddement,
  onUpdate,
  onDelete,
}: {
  oddement: Oddement;
  onUpdate: (updatedOddement: CustomOddement) => void;
  onDelete: (oddement: CustomOddement) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Item variant="outline">
        <ItemContent>
          <ItemHeader>
            <ItemTitle>{oddement.name}</ItemTitle>
          </ItemHeader>
          <ItemDescription>{oddement.description}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                aria-label={`Delete ${oddement.name}`}
              >
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Oddement?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{oddement.name}"? This action
                  cannot be undone after saving.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onDelete(oddement);
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

      <OddementFormInlineDialog
        open={dialogOpen}
        setDialogOpen={setDialogOpen}
        isNew={false}
        oddement={oddement}
        onUpdate={onUpdate}
      />
    </>
  );
}

const customOddementFormSchema = customOddementSchema
  .pick({ name: true })
  .extend({
    description: z.string(),
  });

interface OddementFormInlineDialogProps {
  open:          boolean;
  isNew?:        boolean;
  oddement?:     CustomOddement;
  setDialogOpen: (open: boolean) => void;
  onCreate?:     (newOddement: CustomOddement) => void;
  onUpdate?:     (updatedOddement: CustomOddement) => void;
}

export function OddementFormInlineDialog({
  open,
  isNew = true,
  oddement,
  setDialogOpen,
  onCreate,
  onUpdate,
}: OddementFormInlineDialogProps) {
  let inputValues: z.input<typeof customOddementFormSchema>;
  if (isNew) {
    inputValues = {
      name:        "",
      description: "",
    };
  } else if (oddement) {
    inputValues = {
      name:        oddement.name,
      description: oddement.description || "",
    };
  } else {
    throw new Error(
      "Oddement data must be provided when editing an existing oddement",
    );
  }

  const form = useContentForm({
    defaultValues: inputValues,
    validators:    {
      onSubmit: customOddementFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (isNew && onCreate) {
        const newOddement: CustomOddement = {
          id:          sanitizeId(value.name),
          name:        value.name,
          description: value.description || undefined,
        };

        onCreate(newOddement);
        toast.success(`Oddement "${value.name}" created`);
        form.reset();
        setDialogOpen(false);
      } else if (!isNew && onUpdate) {
        const updatedOddement: CustomOddement = {
          ...oddement,
          id:          oddement!.id, // TODO: Will have to figure out how to handle the Id better
          name:        value.name,
          description: value.description || undefined,
        };

        onUpdate(updatedOddement);
        toast.success(`Oddement "${value.name}" updated`);
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
            {isNew ? "Create New Oddement" : "Edit Oddement"}
          </DialogTitle>
          <DialogDescription>
            {isNew
              ? "Add a new oddement to your character's collection."
              : "Edit the details of your oddement."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="oddement-inline-form"
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
              name="description"
              children={(field) => (
                <field.DescriptionField
                  label="Description"
                  maxCharacters={100}
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
          <Button type="submit" form="oddement-inline-form">
            {isNew ? "Create Oddement" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { OddementCard, OddementEditCard };
