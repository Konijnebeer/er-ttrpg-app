import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";

interface BaseEditSectionProps<T> {
  title:             string;
  data:              T[];
  cardEditComponent: React.ComponentType<{
    item:     T;
    onUpdate: (updatedItem: T) => void;
    onDelete: (item: T) => void;
  }>;
  onUpdate: (updatedItem: T) => void;
  onDelete: (item: T) => void;
}

interface EditSectionWithCreate<T> extends BaseEditSectionProps<T> {
  createComponent: React.ComponentType<{
    open:          boolean;
    setDialogOpen: (open: boolean) => void;
    onCreate:      (newItem: T) => void;
  }>;
  onCreate: (newItem: T) => void;
}

interface EditSectionWithoutCreate<T> extends BaseEditSectionProps<T> {
  createComponent?: never;
  onCreate?:        never;
}

type EditSectionProps<T> =
  | EditSectionWithCreate<T>
  | EditSectionWithoutCreate<T>;

function EditSection<T extends { id: string }>({
  title,
  data,
  cardEditComponent: CardEditComponent,
  onUpdate,
  onDelete,
  createComponent: CreateComponent,
  onCreate,
}: EditSectionProps<T>) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      {CreateComponent && (
        <Button
          onClick={() => setDialogOpen(true)}
          variant="outline"
          size="sm"
          className="w-full"
          aria-label={`Create new ${title}`}
        >
          <Plus />
        </Button>
      )}
      {data.length === 0 && (
        <div className="text-center text-muted-foreground">
          <p>{CreateComponent ? `No ${title} yet.` : `No ${title}.`}</p>
        </div>
      )}

      {data.length > 0 &&
        data.map((item) => (
          <CardEditComponent
            key={item.id}
            item={item}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      {CreateComponent && (
        <CreateComponent
          open={dialogOpen}
          setDialogOpen={setDialogOpen}
          onCreate={onCreate}
        />
      )}
    </>
  );
}

export { EditSection };
