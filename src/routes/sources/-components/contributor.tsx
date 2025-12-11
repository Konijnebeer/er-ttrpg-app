import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import {
  contactTypeSchema,
  contributorSchema,
  type Contributor,
} from "@/types/source";
import { useSourceStore } from "@/store/sourceStore";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { SourceKey } from "@/types/refrence";
import { EditSection, RemoveEntity, type EditSectionSettings } from "./edit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContactType } from "@/types/source";
import { v6 as uuid } from "uuid";

function ContributorShowCard({
  entity,
  onEdit,
  sourceKey,
}: {
  entity: Contributor;
  onEdit: () => void;
  sourceKey: SourceKey;
}) {
  const removeContributor = useSourceStore((state) => state.removeContributor);

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>{entity.name}</ItemTitle>
        <ItemDescription>{entity.title}</ItemDescription>
      </ItemHeader>
      <ItemContent className="flex flex-col gap-1 mt-2">
        {entity.contact?.map((contact) => (
          <p key={contact.type}>
            {contact.type}: {contact.url}
          </p>
        ))}
      </ItemContent>
      <RemoveEntity
        name={entity.name}
        onDelete={() => removeContributor(sourceKey, entity.name)}
        onEdit={onEdit}
      />
    </Item>
  );
}

function ContributorEditCard({
  entity,
  onCancel,
  sourceKey,
  isNew = false,
}: {
  entity: Contributor;
  onCancel: () => void;
  sourceKey: SourceKey;
  isNew?: boolean;
}) {
  const updateContributor = useSourceStore((state) => state.updateContributor);
  const addContributor = useSourceStore((state) => state.addContributor);

  const form = useForm({
    defaultValues: {
      id: entity.id || uuid(),
      title: entity.title || "",
      name: entity.name || "",
      contact: entity.contact || [],
    },
    validators: {
      // @ts-expect-error - Zod schema has optional fields, but form state has contact as required array
      onSubmit: contributorSchema,
    },
    onSubmit: async ({ value }) => {
      if (isNew) {
        addContributor(sourceKey, value);
        toast.success("Contributor added successfully");
      } else {
        updateContributor(sourceKey, entity.name, value);
        toast.success("Contributor updated successfully");
      }
      onCancel();
    },
  });

  return (
    <Item variant="outline">
      <ItemContent className="flex flex-col gap-1 mt-2">
        <form
          id="contributor-edit-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Writer, Editor, etc."
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
          </FieldGroup>
          <FieldGroup>
            <form.Field name="contact" mode="array">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Contact</FieldLabel>
                    {field.state.value.map((_, i) => {
                      return (
                        <div
                          key={i}
                          className="grid md:grid-cols-[1fr_2fr] gap-2 "
                        >
                          <form.Field name={`contact[${i}].type`}>
                            {(subField) => {
                              const isInvalid =
                                subField.state.meta.isTouched &&
                                !subField.state.meta.isValid;
                              return (
                                <Field data-invalid={isInvalid}>
                                  <FieldLabel htmlFor={subField.name}>
                                    Contact Type
                                  </FieldLabel>
                                  <Select
                                    value={subField.state.value}
                                    onValueChange={(value) =>
                                      subField.handleChange(
                                        value as ContactType
                                      )
                                    }
                                  >
                                    <SelectTrigger id={subField.name}>
                                      <SelectValue placeholder="Contact Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {contactTypeSchema.options.map((type) => (
                                        <SelectItem key={type} value={type}>
                                          {type}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {isInvalid && (
                                    <FieldError
                                      errors={subField.state.meta.errors}
                                    />
                                  )}
                                </Field>
                              );
                            }}
                          </form.Field>
                          <form.Field name={`contact[${i}].url`}>
                            {(subField) => {
                              const isInvalid =
                                subField.state.meta.isTouched &&
                                !subField.state.meta.isValid;
                              return (
                                <Field data-invalid={isInvalid}>
                                  <FieldLabel htmlFor={subField.name}>
                                    Username or URL
                                  </FieldLabel>
                                  <Input
                                    id={subField.name}
                                    name={subField.name}
                                    value={subField.state.value}
                                    onBlur={subField.handleBlur}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                    aria-invalid={isInvalid}
                                    placeholder="@username or https://website.com"
                                    autoComplete="off"
                                  />
                                  {isInvalid && (
                                    <FieldError
                                      errors={subField.state.meta.errors}
                                    />
                                  )}
                                </Field>
                              );
                            }}
                          </form.Field>
                        </div>
                      );
                    })}
                    <Button
                      onClick={() =>
                        field.pushValue({ type: "Website", name: "", url: "" })
                      }
                      type="button"
                    >
                      Add contact
                    </Button>
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </ItemContent>
      <ItemFooter className="content-end justify-end items-end gap-2">
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" form="contributor-edit-form">
            Submit
          </Button>
        </Field>
      </ItemFooter>
    </Item>
  );
}

function ContributorEditSection({
  contributors,
  sourceKey,
}: {
  contributors: Contributor[];
  sourceKey: SourceKey;
}) {
  const editSettings: EditSectionSettings<Contributor> = {
    entityName: "Contributor",
    entityCards: {
      ShowCard: ContributorShowCard,
      EditCard: ContributorEditCard,
    },
  };

  return (
    <EditSection
      entityArray={contributors}
      sourceKey={sourceKey}
      editSettings={editSettings}
    />
  );
}

export { ContributorEditSection };
