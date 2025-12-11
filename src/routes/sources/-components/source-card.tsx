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
import { BadgeCheckIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

function SourceCard({ source }: { source: SourceMetadata }) {
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
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
          {source.contributors.map((contributor) => (
            <AvatarInfo key={contributor.id} contributor={contributor} />
          ))}
        </div>
        <div className="flex gap-2">
          {/* <Link
            to="/sources/$sourceId/edit"
            params={{
              sourceId: source.id,
            }}
          > */}
          {source.status !== "nonEditable" && (
            <Button variant="secondary" className="cursor-not-allowed">
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
  sources: SourceMetadata[];
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
