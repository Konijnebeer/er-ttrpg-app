import { Border } from "@/components/border";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import {
  aspectReferenceSchema,
  characterMetadataSchema,
  itemReferenceSchema,
  type AspectReference,
  type ItemReference,
} from "@/types/character";
import {
  referenceSchema,
  sourceKeySchema,
  type Reference,
  type SourceKey,
} from "@/types/refrence";
import { useSourceStore } from "@/store/sourceStore";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@tanstack/react-form";
import { v6 as uuid } from "uuid";
import { useCharacterForm } from "@/hooks/character.form";
import {
  CoreSourceSection,
  ExtraSourceSection,
} from "./-components/form/source";
import { OriginPathSection } from "./-components/form/origin-path";
import z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateCharacter } from "@/lib/createCharacter";

export const Route = createFileRoute("/characters/create")({
  component: RouteComponent,
});

const characterCreateFormSchema = characterMetadataSchema
  .pick({
    id: true,
    name: true,
    description: true,
    author: true,
    sheetVersion: true,
    dateCreated: true,
    dateModified: true,
    versionRef: true,
  })
  .extend({
    dependencies: z.array(sourceKeySchema),

    data: z.object({
      character: z.object({
        // Have to make it extend the refrenceSchema
        originRef: z.string().nonempty("Origin is required"),
        pathRef: z.string().nonempty("Path is required"),
      }),
    }),
    selectedOriginEdges: z.array(referenceSchema).length(1),
    selectedOriginSkills: z.array(referenceSchema).length(2),
    selectedOriginOddements: z.array(itemReferenceSchema).length(1),
    selectedOriginFragements: z.array(itemReferenceSchema).length(1),
    selectedOriginAspects: z.array(aspectReferenceSchema).length(1),
    selectedPathEdges: z.array(referenceSchema).length(1),
    selectedPathSkills: z.array(referenceSchema).length(2),
    selectedPathOddements: z.array(itemReferenceSchema).length(1),
    selectedPathFragements: z.array(itemReferenceSchema).length(1),
    selectedPathAspects: z.array(aspectReferenceSchema).length(1),
  });

// Default vallues in its own constant so subforms can use the types properly
export const defaultCharacterFormValues = {
  id: uuid(),
  name: "",
  description: "",
  author: "",
  sheetVersion: "0.0.0",
  dateCreated: Math.floor(Date.now() / 1000),
  dateModified: Math.floor(Date.now() / 1000),
  versionRef: "",
  dependencies: [] as SourceKey[],
  data: {
    character: {
      originRef: "",
      pathRef: "",
      // hope:      "",
      // despair:   "",
    },
  },
  selectedOriginEdges: [] as Reference[],
  selectedOriginSkills: [] as Reference[],
  selectedOriginOddements: [] as ItemReference[],
  selectedOriginFragements: [] as ItemReference[],
  selectedOriginAspects: [] as AspectReference[],
  selectedPathEdges: [] as Reference[],
  selectedPathSkills: [] as Reference[],
  selectedPathOddements: [] as ItemReference[],
  selectedPathFragements: [] as ItemReference[],
  selectedPathAspects: [] as AspectReference[],
};

function RouteComponent() {
  const { createCharacter } = useCreateCharacter();
  const navigate = useNavigate();
  const { loadAllSourcesMetadata, loadSources, isLoading, error } =
    useSourceStore();

  useEffect(() => {
    loadAllSourcesMetadata();
  }, [loadAllSourcesMetadata]);

  const form = useCharacterForm({
    defaultValues: defaultCharacterFormValues,
    validators: {
      onSubmit: characterCreateFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("handleSubmit called with value:", value);

      const succses = await createCharacter({
        value,
      });
      if (succses) {
        toast.success(`Created character: ${value.name}`);
        navigate({
          to: "/characters/$characterId/preview",
          params: {
            characterId: value.id,
          },
        });
      } else {
        toast.error(`Failed to create character: ${value.name}`);
      }
    },
  });

  // Load complete sources based on selected sourceKeys
  const versionRef = useStore(form.store, (state) => state.values.versionRef);
  const dependencies = useStore(
    form.store,
    (state) => state.values.dependencies
  );
  const sourceKeys = [versionRef, ...(dependencies ?? [])].filter(
    (key) => key !== ""
  ) as SourceKey[];

  useEffect(() => {
    if (sourceKeys.length > 0) {
      loadSources(sourceKeys);
    }
  }, [versionRef, dependencies, loadSources]);

  if (isLoading) {
    return <Border>Loading...</Border>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Border>
      <form
        id="create-character"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="grid md:grid-cols-2 gap-4"
      >
        <FieldGroup>
          <div className="grid md:grid-cols-2 gap-4">
            <form.AppField
              name="name"
              children={(field) => <field.NameField label="Name" />}
            />
            <form.AppField
              name="author"
              children={(field) => <field.AuthorField label="Author" />}
            />
          </div>
          <form.AppField
            name="description"
            children={(field: any) => (
              <field.DescriptionField label="Description" maxCharacters={200} />
            )}
          />
          <form.Subscribe selector={(state) => state.values.versionRef}>
            {(versionRef) =>
              versionRef && (
                <form.AppForm>
                  <ScrollArea className="h-[50vh] max-h-[50vh] w-full">
                    <div className="space-y-4">
                      <OriginPathSection
                        form={form}
                        sourceKeys={sourceKeys}
                        type="origins"
                        label="Origin"
                      />
                      <OriginPathSection
                        form={form}
                        sourceKeys={sourceKeys}
                        type="paths"
                        label="Path"
                      />
                    </div>
                  </ScrollArea>
                </form.AppForm>
              )
            }
          </form.Subscribe>
          <Button
            className="absolute right-25 bottom-18"
            type="submit"
            form="create-character"
          >
            Create
          </Button>
        </FieldGroup>
        <FieldGroup>
          <h1 className="text-2xl font-semibold text-center">Dependencies</h1>
          <p className="text-center italic">
            Select here what rules and versions you want your characters to
            include. You can also select homebrew you have imported.
          </p>
          <form.AppForm>
            <CoreSourceSection form={form} />
            <ExtraSourceSection form={form} />
          </form.AppForm>
        </FieldGroup>
      </form>
    </Border>
  );
}
