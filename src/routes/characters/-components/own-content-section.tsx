import { ScrollSection } from "@/components/content/scroll-section";
import { EditSection } from "@/components/content/edit-section";
import { TagEditCard, TagFormInlineDialog } from "@/components/content/tag";
import {
  OddementEditCard,
  OddementFormInlineDialog,
} from "@/components/content/oddement";
import {
  FragmentEditCard,
  FragmentFormInlineDialog,
} from "@/components/content/fragment";
import {
  CampingGearEditCard,
  CampingGearFormInlineDialog,
} from "@/components/content/camping-gear";
import {
  AspectEditCard,
  AspectFormInlineDialog,
} from "@/components/content/aspect";
import type { Character } from "@/types/character";
import { toast } from "sonner";

function OwnContentSection({
  character,
  updateCharacter,
}: {
  character:       Character;
  updateCharacter: (data: Partial<Character>) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      <ScrollSection title="Tags" description="Tags within the character">
        <EditSection
          title="tags"
          data={character.data?.customTags || []}
          onUpdate={(updatedTag) => {
            updateCharacter({
              data: {
                ...character.data,
                customTags: character.data?.customTags?.map((tag) =>
                  tag.id === updatedTag.id ? updatedTag : tag,
                ),
              },
            });
            toast.success(`${updatedTag.name} updated successfully`);
          }}
          onDelete={(deletedTag) => {
            updateCharacter({
              data: {
                ...character.data,
                customTags:
                  character.data?.customTags?.filter(
                    (tag) => tag.id !== deletedTag.id,
                  ) || [],
              },
            });
            toast.success(`${deletedTag.name} deleted successfully`);
          }}
          cardEditComponent={({ item, onUpdate, onDelete }) => (
            <TagEditCard tag={item} onUpdate={onUpdate} onDelete={onDelete} />
          )}
          createComponent={TagFormInlineDialog}
          onCreate={(newTag) => {
            updateCharacter({
              data: {
                ...character.data,
                customTags: [...(character.data?.customTags || []), newTag],
              },
            });
            toast.success(`${newTag.name} created successfully`);
          }}
        />
      </ScrollSection>
      <ScrollSection
        title="Oddments"
        description="Oddments within the character"
      >
        <EditSection
          title="oddments"
          data={character.data?.customOddements || []}
          onUpdate={(updatedOddement) => {
            updateCharacter({
              data: {
                ...character.data,
                customOddements: character.data?.customOddements?.map(
                  (oddement) =>
                    oddement.id === updatedOddement.id
                      ? updatedOddement
                      : oddement,
                ),
              },
            });
            toast.success(`${updatedOddement.name} updated successfully`);
          }}
          onDelete={(deletedOddement) => {
            updateCharacter({
              data: {
                ...character.data,
                customOddements:
                  character.data?.customOddements?.filter(
                    (oddement) => oddement.id !== deletedOddement.id,
                  ) || [],
              },
            });
            toast.success(`${deletedOddement.name} deleted successfully`);
          }}
          cardEditComponent={({ item, onUpdate, onDelete }) => (
            <OddementEditCard
              oddement={item}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          )}
          createComponent={OddementFormInlineDialog}
          onCreate={(newOddement) => {
            updateCharacter({
              data: {
                ...character.data,
                customOddements: [
                  ...(character.data?.customOddements || []),
                  newOddement,
                ],
              },
            });
            toast.success(`${newOddement.name} created successfully`);
          }}
        />
      </ScrollSection>
      <ScrollSection
        title="Fragments"
        description="Fragments within the character"
      >
        <EditSection
          title="fragments"
          data={character.data?.customFragments || []}
          onUpdate={(updatedFragment) => {
            updateCharacter({
              data: {
                ...character.data,
                customFragments: character.data?.customFragments?.map(
                  (fragment) =>
                    fragment.id === updatedFragment.id
                      ? updatedFragment
                      : fragment,
                ),
              },
            });
            toast.success(`${updatedFragment.name} updated successfully`);
          }}
          onDelete={(deletedFragment) => {
            updateCharacter({
              data: {
                ...character.data,
                customFragments:
                  character.data?.customFragments?.filter(
                    (fragment) => fragment.id !== deletedFragment.id,
                  ) || [],
              },
            });
            toast.success(`${deletedFragment.name} deleted successfully`);
          }}
          cardEditComponent={({ item, onUpdate, onDelete }) => (
            <FragmentEditCard
              fragment={item}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          )}
          createComponent={FragmentFormInlineDialog}
          onCreate={(newFragment) => {
            updateCharacter({
              data: {
                ...character.data,
                customFragments: [
                  ...(character.data?.customFragments || []),
                  newFragment,
                ],
              },
            });
            toast.success(`${newFragment.name} created successfully`);
          }}
        />
      </ScrollSection>
      <ScrollSection title="Aspects" description="Aspects within the character">
        <EditSection
          title="aspects"
          data={character.data?.customAspects || []}
          onUpdate={(updatedAspect) => {
            updateCharacter({
              data: {
                ...character.data,
                customAspects: character.data?.customAspects?.map((aspect) =>
                  aspect.id === updatedAspect.id ? updatedAspect : aspect,
                ),
              },
            });
            toast.success(`${updatedAspect.name} updated successfully`);
          }}
          onDelete={(deletedAspect) => {
            updateCharacter({
              data: {
                ...character.data,
                customAspects:
                  character.data?.customAspects?.filter(
                    (aspect) => aspect.id !== deletedAspect.id,
                  ) || [],
              },
            });
            toast.success(`${deletedAspect.name} deleted successfully`);
          }}
          cardEditComponent={({ item, onUpdate, onDelete }) => (
            <AspectEditCard
              aspect={item}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          )}
          createComponent={AspectFormInlineDialog}
          onCreate={(newAspect) => {
            updateCharacter({
              data: {
                ...character.data,
                customAspects: [
                  ...(character.data?.customAspects || []),
                  newAspect,
                ],
              },
            });
            toast.success(`${newAspect.name} created successfully`);
          }}
        />
      </ScrollSection>
      <ScrollSection
        title="Camping Gear"
        description="Camping Gear within the character"
      >
        <EditSection
          title="camping gear"
          data={character.data?.customCampingGear || []}
          onUpdate={(updatedCampingGear) => {
            updateCharacter({
              data: {
                ...character.data,
                customCampingGear: character.data?.customCampingGear?.map(
                  (campingGear) =>
                    campingGear.id === updatedCampingGear.id
                      ? updatedCampingGear
                      : campingGear,
                ),
              },
            });
            toast.success(`${updatedCampingGear.name} updated successfully`);
          }}
          onDelete={(deletedCampingGear) => {
            updateCharacter({
              data: {
                ...character.data,
                customCampingGear:
                  character.data?.customCampingGear?.filter(
                    (campingGear) => campingGear.id !== deletedCampingGear.id,
                  ) || [],
              },
            });
            toast.success(`${deletedCampingGear.name} deleted successfully`);
          }}
          cardEditComponent={({ item, onUpdate, onDelete }) => (
            <CampingGearEditCard
              campingGear={item}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          )}
          createComponent={CampingGearFormInlineDialog}
          onCreate={(newCampingGear) => {
            updateCharacter({
              data: {
                ...character.data,
                customCampingGear: [
                  ...(character.data?.customCampingGear || []),
                  newCampingGear,
                ],
              },
            });
            toast.success(`${newCampingGear.name} created successfully`);
          }}
        />
      </ScrollSection>
    </div>
  );
}

export { OwnContentSection };
