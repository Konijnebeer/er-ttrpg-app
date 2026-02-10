// Components
import {
  Section,
  SectionAction,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
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
import { Border } from "@/components/border";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OwnContentSection } from "./-components/own-content-section";
import { ArrowBigLeftIcon, Trash } from "lucide-react";
import { toast } from "sonner";
// Types
import { characterMetadataSchema } from "@/types/character";
// Stores
import { useCharacterStore } from "@/store/characterStore";
import { useSourceStore } from "@/store/sourceStore";
// Hooks
import { useCharacterForm } from "@/hooks/character.form";
import { useVersionCheck } from "@/hooks/use-version-check";
import { useUpdateCharacterSource } from "@/hooks/use-update-character-source";
// Helpers
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/characters/$characterId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { characterId } = Route.useParams();
  const navigate = useNavigate();

  const {
    character,
    isLoading,
    error,
    loadCharacter,
    deleteCharacter,
    exportCharacter,
    updateCharacter,
  } = useCharacterStore();

  const {
    loadAllSourcesMetadata,
    // groupedSources,
    isLoading: sourcesLoading,
  } = useSourceStore();

  const { updateSource, isUpdating } = useUpdateCharacterSource();

  useEffect(() => {
    if (character) {
      metadataForm.reset({
        name:        character.name,
        author:      character.author,
        description: character.description,
      });
    }
  }, [character?.id]);

  useEffect(() => {
    const loadData = async () => {
      await loadCharacter(characterId);
      await loadAllSourcesMetadata();
    };
    loadData();
  }, [characterId, loadCharacter, loadAllSourcesMetadata]);

  const versionInfo = useVersionCheck(character?.versionRef);

  const characterMetadataFormSchema = characterMetadataSchema.pick({
    name:        true,
    author:      true,
    description: true,
  });

  const metadataForm = useCharacterForm({
    defaultValues: {
      name:        character?.name ?? "",
      author:      character?.author ?? "",
      description: character?.description ?? "",
    },
    validators: {
      onSubmit: characterMetadataFormSchema,
    },
    onSubmit: async ({ value }) => {
      toast.promise(
        Promise.resolve(
          updateCharacter({
            name:        value.name,
            author:      value.author,
            description: value.description,
          }),
        ),
        {
          loading: "Updating character information...",
          success: "Character information updated successfully!",
          error:   "Failed to update character information.",
        },
      );
    },
  });

  if (isLoading || sourcesLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Character Error: {error}</div>;
  }
  if (!character) {
    return <div>Character not found</div>;
  }

  function onExport() {
    toast.promise(exportCharacter(character.id), {
      loading: "Exporting character...",
      success: "Character exported successfully!",
      error:   "Failed to export character.",
    });
  }

  async function onDelete() {
    toast.promise(
      deleteCharacter(character.id).then(() => navigate({ to: "/characters" })),
      {
        loading: "Deleting character...",
        success: "Character deleted successfully!",
        error:   "Failed to delete character.",
      },
    );
  }

  async function onUpdate() {
    if (!character || !versionInfo?.latest) {
      return;
    }

    const result = await updateSource(
      character,
      character.versionRef,
      versionInfo.latest,
    );

    if (result.success) {
      toast.success("Character updated successfully");
      // Reload character to get updated data
      await loadCharacter(characterId);
    } else {
      toast.error("Failed to update character");
    }
  }

  return (
    <Border>
      <Button
        asChild
        size="icon"
        className="fixed left-5 top-5 z-50"
        aria-label="Back to previous page"
      >
        <Link to="/characters">
          <ArrowBigLeftIcon />
        </Link>
      </Button>
      <ScrollArea className="h-[85vh]">
        <Section>
          <SectionHeader>
            <SectionTitle>{character.name}</SectionTitle>
            <SectionDescription>Manage your Character</SectionDescription>
            <SectionAction>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    aria-label={`Delete ${character.name}`}
                  >
                    <Trash />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Character?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{character.name}"? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" onClick={onExport}>
                Export
              </Button>
              {versionInfo?.hasUpdate ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Update Character Source
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="space-y-2">
                          <p>
                            Update available for the character's core source.
                          </p>
                          <div className="bg-muted p-3 rounded-md space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Current:</span>{" "}
                              {character.versionRef}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Latest:</span>{" "}
                              {versionInfo.latest}
                            </p>
                            {versionInfo.newerVersions.length > 1 && (
                              <p className="text-xs text-muted-foreground">
                                Available versions:{" "}
                                {versionInfo.newerVersions.join(", ")}
                              </p>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            This cannot be reversed. Updating might remove
                            content that is missing in the new version. This
                            happens only in rare instances.
                          </p>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onUpdate}>
                        Update to {versionInfo.latest}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  className="cursor-not-allowed pointer-events-all"
                  disabled
                >
                  Up-to-date
                </Button>
              )}
            </SectionAction>
          </SectionHeader>

          <SectionContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form
              id="edit-character-metadata"
              onSubmit={(e) => {
                e.preventDefault();
                metadataForm.handleSubmit();
              }}
            >
              <FieldGroup className="gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <metadataForm.AppField
                    name="name"
                    children={(field) => <field.NameField label="Name" />}
                  />
                  <metadataForm.AppField
                    name="author"
                    children={(field) => <field.AuthorField label="Author" />}
                  />
                </div>

                <metadataForm.AppField
                  name="description"
                  children={(field) => (
                    <field.DescriptionField
                      label="Description"
                      maxCharacters={200}
                    />
                  )}
                />
                <Button type="submit" className="w-full">
                  Update Information
                </Button>
              </FieldGroup>
            </form>
          </SectionContent>
        </Section>
        <Section className="pt-4">
          <SectionHeader>
            <SectionTitle>Own Content</SectionTitle>
            <SectionDescription>
              See, Create, Edit and Delete the in character content
            </SectionDescription>
          </SectionHeader>
          <SectionContent>
            <ScrollArea className="h-[70vh] lg:h-[35vh] w-full">
              <OwnContentSection
                character={character}
                updateCharacter={updateCharacter}
              />
            </ScrollArea>
          </SectionContent>
        </Section>
      </ScrollArea>
    </Border>
  );
}
