import type { SourceMetadata } from "@/types/source";
import {
  Card,
  CardHeader,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AvatarInfo from "./avatar-info";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BadgeCheckIcon, Trash } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSourceStore } from "@/store/sourceStore";
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

function SourceCard({ source }: { source: SourceMetadata }) {
  const { deleteSource, loadAllSourcesMetadata } = useSourceStore();

  async function onDelete() {
    toast.promise(
      deleteSource(source.id, source.version).then(() =>
        loadAllSourcesMetadata(),
      ),
      {
        loading: "Deleting source...",
        success: "Source deleted successfully!",
        error:   "Failed to delete source.",
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{source.name}</CardTitle>
        <CardDescription>
          <Badge variant="secondary">
            {source.sourceInfo.homebrew ? (
              "Homebrew"
            ) : (
              <>
                <BadgeCheckIcon />
                <span>Rules Port</span>
              </>
            )}
          </Badge>
        </CardDescription>
        <CardAction>
          <Badge>{source.version}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>{source.description}</CardContent>
      <CardFooter className="flex flex-wrap space-y-4 md:space-y-0 space-x-4 justify-between  w-full mt-auto">
        <div className="flex -space-x-2 *:bg-muted-foreground">
          {source.contributors.map((contributor) => (
            <AvatarInfo key={contributor.id} contributor={contributor} />
          ))}
        </div>
        <div className="flex gap-2">
          {source.sourceInfo.homebrew !== false && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  aria-label={`Delete ${source.name}`}
                >
                  <Trash />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Source?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{source.name}"? This action
                    cannot be undone.
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
          )}
          {/* <Link
            to="/sources/$sourceId/edit"
            params={{
              sourceId: source.id,
            }}
          > */}
          {source.status !== "nonEditable" && (
            <Button
              variant="outline"
              className="cursor-not-allowed pointer-events-all"
              disabled
            >
              Edit
            </Button>
          )}
          {/* </Link> */}
          <Link
            to="/sources/$sourceId/preview"
            params={{
              sourceId: source.id,
            }}
          >
            <Button variant="default">Open</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function SourceCardGrid({
  sources,
  className,
}: {
  sources:    SourceMetadata[];
  className?: string;
}) {
  return (
    <ScrollArea className={cn("h-[75vh] max-h-[80vh] w-full", className)}>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {sources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>
    </ScrollArea>
  );
}

export { SourceCard, SourceCardGrid };
