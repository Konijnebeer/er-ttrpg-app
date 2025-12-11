import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from "@/components/section";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EditSection, RemoveEntity, type EditSectionSettings } from "./edit";
import type { SourceKey } from "@/types/refrence";
import { edgeSkillSchema, type EdgeSkill } from "@/types/source";
import { useForm } from "@tanstack/react-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useSourceStore } from "@/store/sourceStore";
import { v6 as uuid } from "uuid";

function EdgeCard({ edge }: { edge: EdgeSkill }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>{edge.name}</ItemTitle>
          <ItemActions className="font-semibold">
            {edge.maxTrack && <span>Tracks: {edge.maxTrack}</span>}
          </ItemActions>
        </ItemHeader>
        <ItemDescription>{edge.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

function EdgeSection({ edges }: { edges: EdgeSkill[] }) {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Edges</SectionTitle>
        <SectionDescription>Edges within the source</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <ScrollArea className="h-[30vh] h-max-[40vh]">
          <div className="space-y-2">
            {edges.map((edge) => (
              <EdgeCard key={edge.id} edge={edge} />
            ))}
          </div>
        </ScrollArea>
      </SectionContent>
    </Section>
  );
}

function EdgeEditCard({
  entity,
  onCancel,
  sourceKey,
  isNew = false,
}: {
  entity: EdgeSkill;
  onCancel: () => void;
  sourceKey: SourceKey;
  isNew?: boolean;
}) {
  const updateEdge = useSourceStore((state) => state.updateSourceEntity);
  const addEdge = useSourceStore((state) => state.addSourceEntity);

  const form = useForm({
    defaultValues: {
      id: entity.id || uuid(),
      name: entity.name || "",
      maxTrack: entity.maxTrack || 1,
      description: entity.description || "",
    },
    validators: {
      onSubmit: edgeSkillSchema,
    },
    onSubmit: async ({ value }) => {
      if (isNew) {
        addEdge(sourceKey, "edges", value);
        toast.success("Edge added successfully");
      } else {
        updateEdge(sourceKey, "edges", value.id, value);
        toast.success("Edge updated successfully");
      }
      onCancel();
    },
  });
  return (
    <Item variant="outline">
      <ItemContent>
        <form
          id="edge-edit-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
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
                      aria-invalid={isInvalid}
                      placeholder="User name"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Short Description what the Edge is used for"
                        rows={3}
                        className="min-h-12 resize-none"
                        aria-invalid={isInvalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.state.value.length}/150 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="maxTrack"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Max Track</FieldLabel>
                    <Input
                      type="number"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      aria-invalid={isInvalid}
                      autoComplete="off"
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
      </ItemContent>
      <ItemFooter className="content-end justify-end items-end gap-2">
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" form="edge-edit-form">
            Submit
          </Button>
        </Field>
      </ItemFooter>
    </Item>
  );
}

function EdgeShowCard({
  entity,
  onEdit,
  sourceKey,
}: {
  entity: EdgeSkill;
  onEdit: () => void;
  sourceKey: SourceKey;
}) {
  const removeEdge = useSourceStore((state) => state.removeSourceEntity);

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>{entity.name}</ItemTitle>
          <ItemActions className="font-semibold">
            {entity.maxTrack && <span>Tracks: {entity.maxTrack}</span>}
          </ItemActions>
        </ItemHeader>
        <ItemDescription>{entity.description}</ItemDescription>
        <RemoveEntity
          name={entity.name}
          onDelete={() => removeEdge(sourceKey, "edges", entity.id)}
          onEdit={onEdit}
        />
      </ItemContent>
    </Item>
  );
}

function EdgeEditSection({
  sourceKey,
  edges,
}: {
  sourceKey: SourceKey;
  edges: EdgeSkill[];
}) {
  const editSettings: EditSectionSettings<EdgeSkill> = {
    entityName: "Edge",
    entityCards: {
      ShowCard: EdgeShowCard,
      EditCard: EdgeEditCard,
    },
  };

  return (
    <EditSection
      entityArray={edges}
      sourceKey={sourceKey}
      editSettings={editSettings}
    />
  );
}

export { EdgeCard, EdgeSection, EdgeEditSection };
