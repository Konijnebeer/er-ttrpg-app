import type { defaultCharacterFormValues } from "@/routes/characters/create";
import { useSourceStore } from "@/store/sourceStore";
import type {
  AspectReference,
  Character,
  EdgeSkillReference,
  ItemReference,
} from "@/types/character";
import type { SourceKey } from "@/types/refrence";
import { ensureRefrence } from "./versioningHelpers";
import { useCharacterStore } from "@/store/characterStore";

export function useCreateCharacter() {
  const { loadSources, resolveRefrence, getSourceDataArray } = useSourceStore();
  const { createNewCharacter } = useCharacterStore();

  const createCharacter = async ({
    value,
  }: {
    value: typeof defaultCharacterFormValues;
  }): Promise<boolean> => {
    const versionRef = value.versionRef as SourceKey;
    const dependencies = value.dependencies as SourceKey[];

    const sourceKeys = [versionRef, ...(dependencies ?? [])].filter(
      Boolean,
    ) as SourceKey[];

    try {
      await loadSources(sourceKeys);

      const originObject = resolveRefrence(
        value.data.character.originRef,
        "origins",
      );
      const pathObject = resolveRefrence(value.data.character.pathRef, "paths");
      if (!originObject || !pathObject) {
        throw Error("cant find origin");
      }

      const maxFalloutTrack =
        originObject.gaugeBonuses.fallout + pathObject.gaugeBonuses.fallout;
      const maxCurseTrack =
        originObject.gaugeBonuses.curse + pathObject.gaugeBonuses.curse;

      const allEdges = [
        ...((getSourceDataArray(versionRef, "edges") ?? []).map((edge) => ({
          ref:       ensureRefrence(versionRef, edge.id),
          sourceKey: versionRef,
          id:        edge.id,
        })) as Array<{ ref: string; sourceKey: string; id: string }>),
        ...dependencies.flatMap((dep) =>
          (getSourceDataArray(dep, "edges") ?? []).map((edge) => ({
            ref:       ensureRefrence(dep, edge.id),
            sourceKey: dep,
            id:        edge.id,
          })),
        ),
      ];

      const edgesArray: EdgeSkillReference[] = allEdges.map((edge) => ({
        ref:   edge.ref,
        level: 0,
      }));

      // Currently can be more than the max (1) needs validation

      value.selectedOriginEdges.forEach((selectedEdge) => {
        const edge = edgesArray.find((e) => e.ref === selectedEdge);
        if (edge) {
          edge.level += 1;
        }
      });

      value.selectedPathEdges.forEach((selectedEdge) => {
        const edge = edgesArray.find((e) => e.ref === selectedEdge);
        if (edge) {
          edge.level += 1;
        }
      });

      const allSkills = [
        ...((getSourceDataArray(versionRef, "skills") ?? []).map((skill) => ({
          ref:       ensureRefrence(versionRef, skill.id),
          sourceKey: versionRef,
          id:        skill.id,
        })) as Array<{ ref: string; sourceKey: string; id: string }>),
        ...dependencies.flatMap((dep) =>
          (getSourceDataArray(dep, "skills") ?? []).map((skill) => ({
            ref:       ensureRefrence(dep, skill.id),
            sourceKey: dep,
            id:        skill.id,
          })),
        ),
      ];

      const skillsArray: EdgeSkillReference[] = allSkills.map((skill) => ({
        ref:   skill.ref,
        level: 0,
      }));

      value.selectedOriginSkills.forEach((selectedSkill) => {
        const skill = skillsArray.find((s) => s.ref === selectedSkill);
        if (skill) {
          skill.level += 1;
        }
      });

      value.selectedPathSkills.forEach((selectedSkill) => {
        const skill = skillsArray.find((s) => s.ref === selectedSkill);
        if (skill) {
          skill.level += 1;
        }
      });
      console.log(skillsArray);
      console.log(edgesArray);

      // TODO Needs to add the tags from the oddement to the saved character
      const allOddements: ItemReference[] = [
        ...value.selectedOriginOddements,
        ...value.selectedPathOddements,
      ].reduce((acc: ItemReference[], itemRef: ItemReference) => {
        const existingItem = acc.find((item) => item.ref === itemRef.ref);
        if (existingItem) {
          existingItem.quantity += itemRef.quantity ?? 1;
        } else {
          acc.push({ ref: itemRef.ref, quantity: itemRef.quantity ?? 1 });
        }
        return acc;
      }, []);
      console.log(allOddements);

      const allFragements: ItemReference[] = [
        ...value.selectedOriginFragements,
        ...value.selectedPathFragements,
      ].reduce((acc: ItemReference[], itemRef: ItemReference) => {
        const existingItem = acc.find((item) => item.ref === itemRef.ref);
        if (existingItem) {
          existingItem.quantity += itemRef.quantity ?? 1;
        } else {
          acc.push({ ref: itemRef.ref, quantity: itemRef.quantity ?? 1 });
        }
        return acc;
      }, []);
      console.log(allFragements);

      const allAspects: AspectReference[] = [
        ...value.selectedOriginAspects,
        ...value.selectedPathAspects,
      ];
      console.log(allAspects);

      const character = {
        id:           value.id,
        name:         value.name,
        description:  value.description,
        author:       value.author,
        sheetVersion: value.sheetVersion,
        dateCreated:  value.dateCreated,
        dateModified: value.dateModified,
        versionRef:   value.versionRef,
        dependencies: value.dependencies,
        data:         {
          character: {
            name:       value.name,
            player:     value.author,
            pronouns:   "",
            origin:     originObject.name,
            originRef:  value.data.character.originRef,
            path:       pathObject.name,
            pathRef:    value.data.character.pathRef,
            milestones: 0,
            dispair:    1,
            hope:       1,
            fallout:    {
              level:        0,
              condition:    "",
              maxTrack:     maxFalloutTrack,
              currentTrack: 0,
            },
            curse: {
              level:        0,
              condition:    "",
              maxTrack:     maxCurseTrack,
              currentTrack: 0,
            },
            clock: {
              food:  0,
              sleep: 0,
              dawn:  0,
              dusk:  0,
            },
          },
          edges:    edgesArray,
          skills:   skillsArray,
          backpack: {
            oddements:   allOddements,
            fragments:   allFragements,
            campingGear: [],
          },

          aspects: allAspects,
        },
      } as Character;
      await createNewCharacter(character);
      return true;
    } catch (error) {
      console.error("Failed to create character:", error);
      throw error;
    }
  };

  return { createCharacter };
}
