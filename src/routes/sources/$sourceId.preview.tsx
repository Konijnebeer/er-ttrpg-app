import { createFileRoute, Link } from "@tanstack/react-router";
import { Border } from "@/components/border";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { EdgeSection } from "./-components/edge";
import { SkillSection } from "./-components/skill";
import { TagSection } from "./-components/tag";
import { OddementSection } from "./-components/oddement";
import { FragmentSection } from "./-components/fragment";
import { CampingGearSection } from "./-components/camping-gear";
import { AspectSection } from "./-components/aspect";
import { ConditionSection } from "./-components/condition";
import { ArrowBigLeftIcon, BadgeCheckIcon } from "lucide-react";

import { getLatestSourceVersion } from "@/database/sourceDB";
import { useSourceStore } from "@/store/sourceStore";
import { useEffect } from "react";
import { makeSourceKey } from "@/lib/versioningHelpers";
import AvatarInfo from "./-components/avatar-info";

export const Route = createFileRoute("/sources/$sourceId/preview")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sourceId } = Route.useParams();
  const { loadSource, isLoading, error, activeSourceKey, sources } =
    useSourceStore();

  // Load source on mount
  useEffect(() => {
    async function loadData() {
      const latestSource = await getLatestSourceVersion(sourceId);
      if (latestSource) {
        await loadSource(latestSource.id, latestSource.version);
      }
    }
    loadData();
  }, [sourceId, loadSource]);

  const source = activeSourceKey ? sources.get(activeSourceKey) : undefined;

  if (isLoading) {
    return <Border>Loading...</Border>;
  }

  if (error) {
    return (
      <Border>
        Failed to Find {sourceId} Error: {error}
      </Border>
    );
  }

  if (!source) {
    return <Border>Source not found</Border>;
  }

  const sourceKey = makeSourceKey(source.id, source.version);

  return (
    <Border>
      <Button
        asChild
        size="icon"
        className="fixed left-5 top-5 z-50"
        aria-label="Back to previous page"
      >
        <Link to="/sources">
          <ArrowBigLeftIcon />
        </Link>
      </Button>
      <header className=" flex flex-col gap-2">
        <div className="flex flex-col xl:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-2 flex-start md:items-center">
            <h1 className="text-2xl">Preview for {source.name}</h1>
            <Badge variant="outline">
              {source.sourceInfo.homebrew ? (
                "Homebrew"
              ) : (
                <>
                  <BadgeCheckIcon />
                  <span>Rules Port</span>
                </>
              )}
            </Badge>
          </div>
          <div className=" flex items-center gap-2">
            <div className="flex *:bg-muted-foreground -space-x-2">
              {source.contributors.map((contributor) => (
                <AvatarInfo key={contributor.id} contributor={contributor} />
              ))}
            </div>
            <Badge>{source.version}</Badge>
          </div>
        </div>
        <p className="whitespace-pre-line align-bottom">{source.description}</p>
      </header>
      <ScrollArea className="h-[75vh] w-full">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {source.data.edges && source.data.edges.length >= 0 && (
            <EdgeSection edges={source.data.edges} />
          )}
          {source.data.skills && source.data.skills.length >= 0 && (
            <SkillSection skills={source.data.skills} />
          )}
          {source.data.tags && source.data.tags.length >= 0 && (
            <TagSection tags={source.data.tags} />
          )}
          {source.data.oddements && source.data.oddements.length >= 0 && (
            <OddementSection
              oddements={source.data.oddements}
              sourceKey={sourceKey}
            />
          )}
          {source.data.fragments && source.data.fragments.length >= 0 && (
            <FragmentSection fragments={source.data.fragments} />
          )}
          {source.data.campingGear && source.data.campingGear.length >= 0 && (
            <CampingGearSection campingGear={source.data.campingGear} />
          )}
          {source.data.aspects && source.data.aspects.length >= 0 && (
            <AspectSection aspects={source.data.aspects} />
          )}
          {source.data.conditions && source.data.conditions.length >= 0 && (
            <ConditionSection conditions={source.data.conditions} />
          )}
        </div>
      </ScrollArea>
    </Border>
  );
}
