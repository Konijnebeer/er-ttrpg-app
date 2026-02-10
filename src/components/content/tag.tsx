import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  // ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FieldGroup } from "@/components/ui/field";
import { DeleteButton } from "@/components/content/delete-button";
import { X } from "lucide-react";
// As it is not used currently, all logic related to the icons are commented out.
// This reduces bundle size.
// import * as LucideIcons from "lucide-react";
import type { Tag } from "@/types/source";
import { customTagSchema, type CustomTag } from "@/types/character";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useContentForm } from "@/hooks/content.form";
import sanitizeId from "@/lib/sanitizeId";

// function getLucideIcon(name?: string) {
//   if (!name) return null;
//   const pascal = name
//     .split(/[^a-zA-Z0-9]+/)
//     .filter(Boolean)
//     .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
//     .join("");
//   return (LucideIcons as any)[pascal] ?? null;
// }

function TagCard({ tag }: { tag: Tag }) {
  // const Icon = getLucideIcon(tag.icon);
  // const iconStyle = tag.color ? { color: tag.color } : undefined;

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>{tag.name}</ItemTitle>
          {/* {tag.icon && (
            <ItemMedia>
              {Icon ? (
                <Icon style={iconStyle} className="w-5 h-5 inline mr-2" />
              ) : (
                <span
                  className="inline mr-2 text-muted-foreground"
                  style={iconStyle}
                >
                  {tag.icon}
                </span>
              )}
            </ItemMedia>
          )} */}
        </ItemHeader>
        <ItemDescription>{tag.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

function TagEditCard({
  tag,
  onUpdate,
  onDelete,
}: {
  tag:      CustomTag;
  onUpdate: (updatedTag: CustomTag) => void;
  onDelete: (tag: CustomTag) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Item variant="outline">
        <ItemContent>
          <ItemHeader>
            <ItemTitle>{tag.name}</ItemTitle>
          </ItemHeader>
          <ItemDescription>{tag.description}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <DeleteButton
            title="Tag"
            name={tag.name}
            onDelete={() => onDelete(tag)}
          />
          <Button onClick={() => setDialogOpen(true)}>Edit</Button>
        </ItemActions>
      </Item>

      <TagFormInlineDialog
        open={dialogOpen}
        setDialogOpen={setDialogOpen}
        isNew={false}
        tag={tag}
        onUpdate={onUpdate}
      />
    </>
  );
}

const customTagFormSchema = customTagSchema.pick({ name: true }).extend({
  description: z.string(),
});

interface TagFormInlineDialogProps {
  open:          boolean;
  isNew?:        boolean;
  tag?:          CustomTag;
  setDialogOpen: (open: boolean) => void;
  onCreate?:     (newTag: CustomTag) => void;
  onUpdate?:     (updatedTag: CustomTag) => void;
}

export function TagFormInlineDialog({
  open,
  isNew = true,
  tag,
  setDialogOpen,
  onCreate,
  onUpdate,
}: TagFormInlineDialogProps) {
  let inputValues: z.input<typeof customTagFormSchema>;
  if (isNew) {
    inputValues = {
      name:        "",
      description: "",
    };
  } else if (tag) {
    inputValues = {
      name:        tag.name,
      description: tag.description || "",
    };
  } else {
    throw new Error("Tag data must be provided when editing an existing tag");
  }

  const form = useContentForm({
    defaultValues: inputValues,
    validators:    {
      onSubmit: customTagFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (isNew && onCreate) {
        const newTag: CustomTag = {
          id:          sanitizeId(value.name),
          name:        value.name,
          description: value.description || undefined,
        };

        onCreate(newTag);
        toast.success(`Tag "${value.name}" created`);
        form.reset();
        setDialogOpen(false);
      } else if (!isNew && onUpdate) {
        const updatedTag: CustomTag = {
          ...tag,
          id:          tag!.id, // TODO: Will have to figure out how to handle the Id better
          name:        value.name,
          description: value.description || undefined,
        };

        onUpdate(updatedTag);
        toast.success(`Tag "${value.name}" updated`);
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
          <DialogTitle>{isNew ? "Create New Tag" : "Edit Tag"}</DialogTitle>
          <DialogDescription>
            {isNew
              ? "Add a new tag to your character's collection."
              : "Edit the details of your tag."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="tag-inline-form"
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
          <Button type="submit" form="tag-inline-form">
            {isNew ? "Create Tag" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TagBadge({
  tag,
  onRemove,
  className,
  ...props
}: { tag: Tag; onRemove?: () => void } & React.ComponentProps<typeof Badge>) {
  // const Icon = getLucideIcon(tag.icon);
  // const iconStyle = tag.color ? { color: tag.color } : undefined;
  const classes = ["inline-flex items-center gap-1", className]
    .filter(Boolean)
    .join(" ");
  return (
    <Badge variant="outline" className={classes} {...props}>
      {/* {Icon && <Icon style={iconStyle} className="w-4 h-4" />} */}
      {tag.name}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${tag.name}`}
          className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}

export { TagCard, TagEditCard, TagBadge };
