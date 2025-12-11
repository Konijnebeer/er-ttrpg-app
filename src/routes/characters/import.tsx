// Components
import {
  Section,
  SectionContent,
  SectionFooter,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
} from "@/components/ui/file-upload";
import { Border } from "@/components/border";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import CharacterManifestTree from "./-components/manifest";
import { ArrowBigLeftIcon, FileUp, X } from "lucide-react";
import { toast } from "sonner";
// Helpers
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import z from "zod";
// Stores
import { useCharacterStore } from "@/store/characterStore";

export const Route = createFileRoute("/characters/import")({
  component: ImportCharacter,
});

// Zod schema for file validation
const fileSchema = z.instanceof(File, { message: "Please select a file" });

function ImportCharacter() {
  const navigate = useNavigate();
  const { importCharacter } = useCharacterStore();

  const form = useForm({
    defaultValues: {
      file: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      if (!value.file) {
        toast.error("Please select a file");
        return;
      }
      toast.promise(importCharacter(value.file), {
        loading: "Importing character...",
        success: (character) => {
          navigate({
            to: "/characters/$characterId/preview",
            params: {
              characterId: character.id,
            },
          });
          return `Successfully imported ${character.name}`;
        },
        error: (err) =>
          `Import failed: ${err instanceof Error ? err.message : String(err)}`,
      });
    },
  });

  return (
    <Border>
      <Link to="/characters">
        <Button
          size="icon"
          className="fixed left-5 top-5 z-50"
          aria-label="Back to previous page"
        >
          <ArrowBigLeftIcon />
        </Button>
      </Link>
      <Section className="h-full flex flex-col justify-between">
        <SectionHeader>
          <SectionTitle>Import A Character</SectionTitle>
        </SectionHeader>
        <SectionContent className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2>
              <span>Download characters from </span>
              <HoverCard>
                <HoverCardTrigger className="font-semibold underline cursor-default">
                  Manifest
                </HoverCardTrigger>
                <HoverCardContent>
                  Pre-made characters to get you started quickly or use as
                  examples.
                </HoverCardContent>
              </HoverCard>
            </h2>
            <CharacterManifestTree />
          </div>
          <form
            id="import-character"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="file"
                validators={{
                  onChange: fileSchema,
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Upload JSON File</FieldLabel>
                      <FileUpload
                        value={field.state.value ? [field.state.value] : []}
                        onValueChange={(files) => {
                          field.handleChange(files[0]);
                        }}
                        accept=".json,application/json"
                        maxFiles={1}
                        onFileValidate={(file) => {
                          if (!file.name.endsWith(".json")) {
                            return "Only JSON files are allowed";
                          }
                          return null;
                        }}
                      >
                        <FileUploadDropzone>
                          <div className="flex flex-col items-center gap-2">
                            <FileUp className="size-8 text-muted-foreground" />
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                Drop your JSON file here, or click to browse
                              </p>
                              <p className="text-muted-foreground text-xs mt-1">
                                Only .json files are supported
                              </p>
                            </div>
                          </div>
                        </FileUploadDropzone>
                        <FileUploadList>
                          {field.state.value && (
                            <FileUploadItem value={field.state.value}>
                              <FileUploadItemPreview />
                              <FileUploadItemMetadata />
                              <FileUploadItemDelete asChild>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="size-8"
                                >
                                  <X className="size-4" />
                                </Button>
                              </FileUploadItemDelete>
                            </FileUploadItem>
                          )}
                        </FileUploadList>
                      </FileUpload>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </SectionContent>
        <SectionFooter className="self-end mt-auto">
          <Button type="submit" form="import-character">
            Import Character
          </Button>
        </SectionFooter>
      </Section>
    </Border>
  );
}
