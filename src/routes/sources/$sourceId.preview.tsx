import { createFileRoute, Link } from "@tanstack/react-router";
import { Border } from "@/components/border";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { EdgeCard } from "./-components/edge";
import { SkillCard } from "./-components/skill";
import { TagCard } from "./-components/tag";
import { OddementCard } from "./-components/oddement";
import { FragmentCard } from "./-components/fragment";
import { CampingGearCard } from "./-components/camping-gear";
import { AspectCard } from "./-components/aspect";
import { ConditionCard } from "./-components/condition";
import { ScrollSection } from "./-components/scroll-section";
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
          {source.data.edges && source.data.edges.length > 0 && (
            <ScrollSection title="Edges" description="Edges within the source">
              {source.data.edges.map((edge) => (
                <EdgeCard key={edge.id} edge={edge} />
              ))}
            </ScrollSection>
          )}
          {source.data.skills && source.data.skills.length > 0 && (
            <ScrollSection title="Skills" description="Skills within the source">
              {source.data.skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </ScrollSection>
          )}
          {source.data.tags && source.data.tags.length > 0 && (
            <ScrollSection
              title="Tags"
              description="Tags within the source for Oddements"
            >
              {source.data.tags.map((tag) => (
                <TagCard key={tag.id} tag={tag} />
              ))}
            </ScrollSection>
          )}
          {source.data.oddements && source.data.oddements.length > 0 && (
            <ScrollSection
              title="Oddements"
              description="Oddements within the source"
            >
              {source.data.oddements.map((oddement) => (
                <OddementCard
                  key={oddement.id}
                  oddement={oddement}
                  sourceKey={sourceKey}
                />
              ))}
            </ScrollSection>
          )}
          {source.data.fragments && source.data.fragments.length > 0 && (
            <ScrollSection
              title="Fragments"
              description="Fragments within the source"
            >
              {source.data.fragments.map((fragment) => (
                <FragmentCard key={fragment.id} fragment={fragment} />
              ))}
            </ScrollSection>
          )}
          {source.data.campingGear && source.data.campingGear.length > 0 && (
            <ScrollSection
              title="Camping Gear"
              description="Camping Gear within the source"
            >
              {source.data.campingGear.map((campingGear) => (
                <CampingGearCard key={campingGear.id} campingGear={campingGear} />
              ))}
            </ScrollSection>
          )}
          {source.data.aspects && source.data.aspects.length > 0 && (
            <ScrollSection title="Aspects" description="Aspects within the source">
              {source.data.aspects.map((aspect) => (
                <AspectCard key={aspect.id} aspect={aspect} />
              ))}
            </ScrollSection>
          )}
          {source.data.conditions && source.data.conditions.length > 0 && (
            <ScrollSection
              title="Conditions"
              description="Conditions within the source"
            >
              {source.data.conditions.map((condition) => (
                <ConditionCard key={condition.id} condition={condition} />
              ))}
            </ScrollSection>
          )}
        </div>
      </ScrollArea>
    </Border>
  );
}
