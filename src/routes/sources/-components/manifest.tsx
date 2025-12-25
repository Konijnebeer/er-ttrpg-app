// Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
// Stores
import { useSourceStore } from "@/store/sourceStore";
// Helpers
import { useEffect, useState } from "react";
import { BASE_PATH } from "@/lib/constants";

export interface ManifestSource {
  id: string;
  versions: ManifestVersion[];
}

export interface ManifestVersion {
  versionNumber: string;
  filename: string;
}

export default function ManifestTree() {
  const { loadAllSourcesMetadata, groupedSources } = useSourceStore();
  const [manifest, setManifest] = useState<{
    sources: ManifestSource[];
  } | null>(null);

  useEffect(() => {
    loadAllSourcesMetadata();

    // Fetch manifest from public folder
    fetch(`${BASE_PATH}/sources/manifest.json`)
      .then((res) => res.json())
      .then((data) => setManifest(data))
      .catch((err) => console.error("Failed to load manifest:", err));
  }, [loadAllSourcesMetadata]);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-fit"
      defaultValue="playtest"
    >
      {manifest?.sources &&
        manifest.sources.map((source) => (
          <SourceBranch
            key={source.id}
            source={source}
            groupedSources={groupedSources}
          />
        ))}
    </Accordion>
  );
}

function SourceBranch({
  source,
  groupedSources,
}: {
  source: ManifestSource;
  groupedSources: { Core: any[]; Extra: any[] };
}) {
  return (
    <AccordionItem value={source.id}>
      <AccordionTrigger className="pb-2">{source.id}</AccordionTrigger>
      <AccordionContent className="pl-4">
        {source.versions &&
          source.versions.map((version) => (
            <VersionLeaf
              key={version.versionNumber}
              sourceId={source.id}
              version={version}
              groupedSources={groupedSources}
            />
          ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function VersionLeaf({
  sourceId,
  version,
  groupedSources,
}: {
  sourceId: string;
  version: ManifestVersion;
  groupedSources: { Core: any[]; Extra: any[] };
}) {
  const { downloadSource, deleteSource } = useSourceStore();

  // Check if this source version is already loaded
  const isLoaded = [...groupedSources.Core, ...groupedSources.Extra].some(
    (group) =>
      group.id === sourceId && group.versions.includes(version.versionNumber)
  );

  const handleDownload = async () => {
    toast.promise(
      downloadSource(sourceId, version.versionNumber, version.filename),
      {
        loading: `Downloading ${sourceId}@${version.versionNumber}...`,
        success: `Successfully downloaded ${sourceId}@${version.versionNumber}`,
        error: (error) =>
          `Failed to download: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    );
  };

  const handleDelete = async () => {
    toast.promise(deleteSource(sourceId, version.versionNumber), {
      loading: `Deleting ${sourceId}@${version.versionNumber}...`,
      success: `Successfully deleted ${sourceId}@${version.versionNumber}`,
      error: (error) =>
        `Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  };

  return (
    <div className="flex gap-2 items-center mb-2">
      <p>{version.versionNumber}</p>
      {isLoaded ? (
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button size="icon-sm" variant="ghost">
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Delete Source</TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Source</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {sourceId}@
                {version.versionNumber}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon-sm" variant="ghost" onClick={handleDownload}>
              <Download />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download Source</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
