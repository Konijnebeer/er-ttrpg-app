import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
  SectionAction,
} from "@/components/section";
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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v6 as uuid } from "uuid";

// *************
import type { SourceKey } from "@/types/refrence";
import { type ComponentType, useState } from "react";
import { ItemFooter } from "@/components/ui/item";

type EditCard<T> = ComponentType<{
  entity: T;
  onCancel: () => void;
  sourceKey: SourceKey;
  isNew: boolean;
}>;
type ShowCard<T> = ComponentType<{
  entity: T;
  onEdit: () => void;
  sourceKey: SourceKey;
}>;

export interface EditSectionSettings<T> {
  entityName: string;
  // createNew: unknown;
  entityCards: {
    ShowCard: ShowCard<T>;
    EditCard: EditCard<T>;
  };
}

function EditSection<T extends { id: string }>({
  entityArray,
  sourceKey,
  editSettings,
}: {
  entityArray: T[];
  sourceKey: SourceKey;
  editSettings: EditSectionSettings<T>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingEntity, setPendingEntity] = useState<T | null>(null);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);
  function handleEdit(id: string) {
    if (editingId !== null) {
      setShowDiscardDialog(true);
      setPendingEditId(id);
    } else {
      setEditingId(id);
    }
  }

  function handleCancel() {
    if (pendingEntity && editingId === pendingEntity.id) {
      setPendingEntity(null);
    }
    setEditingId(null);
  }

  function newItem() {
    if (editingId !== null) {
      setShowDiscardDialog(true);
      setPendingEditId(null);
    } else {
      createNewItem();
    }
  }

  function createNewItem() {
    const newEntity = {
      id: uuid(),
    } as T;
    setPendingEntity(newEntity);
    setEditingId(newEntity.id);
  }

  function handleDiscardAndContinue() {
    if (pendingEntity && editingId === pendingEntity.id) {
      setPendingEntity(null);
    }
    setEditingId(null);
    setShowDiscardDialog(false);

    if (pendingEditId === null) {
      createNewItem();
    } else {
      setEditingId(pendingEditId);
      setPendingEditId(null);
    }
  }

  const allEntities = pendingEntity
    ? [...entityArray, pendingEntity]
    : entityArray;

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionTitle>{editSettings.entityName}'s</SectionTitle>
          <SectionDescription>
            {editSettings.entityName}'s within the source
          </SectionDescription>
          <SectionAction>
            <Button onClick={newItem}>New</Button>
          </SectionAction>
        </SectionHeader>
        <SectionContent>
          <ScrollArea className="h-[30vh] h-max-[40vh]">
            <div className="space-y-2">
              {allEntities.map((entity) => {
                const isNew = pendingEntity?.id === entity.id;
                return (
                  <EntityCard
                    key={entity.id}
                    entity={entity}
                    isEditing={editingId === entity.id}
                    onEdit={() => handleEdit(entity.id)}
                    onCancel={handleCancel}
                    sourceKey={sourceKey}
                    isNew={isNew}
                    ShowCard={editSettings.entityCards.ShowCard}
                    EditCard={editSettings.entityCards.EditCard}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </SectionContent>
      </Section>

      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in the current {editSettings.entityName}.
              {pendingEditId ? " Editing a diffrent " : " Creating a new "}
              {editSettings.entityName} will discard these changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardAndContinue}>
              Discard &{pendingEditId ? " Continue" : " Create new"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function EntityCard<T>({
  entity,
  ShowCard,
  EditCard,
  isEditing,
  onEdit,
  onCancel,
  sourceKey,
  isNew = false,
}: {
  entity: T;
  ShowCard: ShowCard<T>;
  EditCard: EditCard<T>;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  sourceKey: SourceKey;
  isNew?: boolean;
}) {
  if (isEditing) {
    return (
      <EditCard
        entity={entity}
        onCancel={onCancel}
        sourceKey={sourceKey}
        isNew={isNew}
      />
    );
  }

  return <ShowCard entity={entity} onEdit={onEdit} sourceKey={sourceKey} />;
}

function RemoveEntity({
  name,
  onDelete,
  onEdit,
}: {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <ItemFooter className="content-end justify-end items-end">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contributor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete contributor "{name}
              "? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button variant="outline" onClick={onEdit}>
        Edit
      </Button>
    </ItemFooter>
  );
}

export { EditSection, RemoveEntity };
