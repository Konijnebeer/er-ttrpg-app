import { useMemo } from "react";
import { useSourceStore } from "@/store/sourceStore";
import { parseSourceKey, makeSourceKey } from "@/lib/versioningHelpers";
import type { SourceKey } from "@/types/refrence";

interface VersionCheckResult {
  hasUpdate:     boolean;
  newerVersions: SourceKey[];
  latest:        SourceKey;
}

export function useVersionCheck(
  sourceKey: SourceKey | null | undefined,
): VersionCheckResult | null {
  const { groupedSources } = useSourceStore();

  return useMemo(() => {
    if (!sourceKey) return null;

    try {
      const { id: sourceId, version: currentVersion } =
        parseSourceKey(sourceKey);

      // Find the source group
      const allGroups = [...groupedSources.Core, ...groupedSources.Extra];
      const sourceGroup = allGroups.find((group) => group.id === sourceId);

      if (!sourceGroup) {
        return {
          hasUpdate:     false,
          newerVersions: [],
          latest:        sourceKey,
        };
      }

      // Filter versions newer than current
      const newerVersions = sourceGroup.versions
        .filter((version) => version > currentVersion)
        .map((version) => makeSourceKey(sourceId, version));

      const latestVersion = sourceGroup.versions[0] || currentVersion;
      const latest = makeSourceKey(sourceId, latestVersion);

      return {
        hasUpdate: newerVersions.length > 0,
        newerVersions,
        latest,
      };
    } catch (error) {
      console.error("Failed to parse source key:", error);
      return null;
    }
  }, [sourceKey, groupedSources]);
}
