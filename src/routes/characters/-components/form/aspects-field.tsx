import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useFieldContext, useFormContext } from "@/hooks/character.form";
import { useEffect, useState } from "react";

import { useSourceStore } from "@/store/sourceStore";
import { ensureRefrence } from "@/lib/versioningHelpers";

import type { Reference, SourceKey } from "@/types/refrence";
import type { Aspect } from "@/types/source";
import type { AspectReference } from "@/types/character";
import { useStore } from "@tanstack/react-form";
import { wandererExperienceEnum } from "../../create";

export function AspectsField({
  originId,
  sourceKey,
  aspectRefs,
}: {
  originId:   string;
  sourceKey:  SourceKey;
  aspectRefs: Reference[];
}) {
  const field = useFieldContext<AspectReference[]>();
  const form = useFormContext();
  const wandererExperience = useStore(
    form.store,
    (state) => state.values.wandererExperience,
  );
  const { resolveRefrence, isLoading } = useSourceStore();
  const [aspectObjects, setAspectObjects] = useState<Aspect[]>([]);

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const selectedAspects = field.state.value || [];

  let maxSelection = 1;
  if (wandererExperience === wandererExperienceEnum.enum.newly) {
    maxSelection = 1;
  } else if (wandererExperience === wandererExperienceEnum.enum.capable) {
    maxSelection = 2;
  }

  useEffect(() => {
    // Reset state when origin changes
    setAspectObjects([]);

    // Reslove all Refrences
    const resolvedAspectsObjects: Aspect[] = [];

    aspectRefs.forEach((aspectRef) => {
      try {
        const aspectObject = resolveRefrence(
          ensureRefrence(sourceKey, aspectRef),
          "aspects",
        );
        if (aspectObject) {
          resolvedAspectsObjects.push(aspectObject);
        }
      } catch (error) {
        console.error(`Failed to resolve reference: ${aspectRef}`, error);
      }
    });

    setAspectObjects(resolvedAspectsObjects);
  }, [originId, sourceKey, aspectRefs, resolveRefrence]);

  const handleCheckboxChange = (aspectId: string, checked: boolean) => {
    const ref = ensureRefrence(sourceKey, aspectId);
    // find the aspect object and use its maxTrack (fallback to 0)
    const aspectObj = aspectObjects.find((a) => a.id === aspectId);
    const track = aspectObj?.maxTrack ?? 0;
    const aspectRef: AspectReference = { ref, track };

    if (checked) {
      if (selectedAspects.length < maxSelection) {
        field.handleChange([...selectedAspects, aspectRef]);
      }
    } else {
      field.handleChange(selectedAspects.filter((a) => a.ref !== ref));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FieldSet data-invalid={isInvalid}>
      <FieldLabel>
        Aspects ({selectedAspects.length} of {maxSelection} selected)
      </FieldLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
        {aspectObjects.map((aspectObject) => {
          const ref = ensureRefrence(sourceKey, aspectObject.id);
          const isChecked = selectedAspects.some((a) => a.ref === ref);
          const isDisabled =
            !isChecked && selectedAspects.length >= maxSelection;

          return (
            <Field key={aspectObject.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <FieldLabel htmlFor={`aspect-${aspectObject.id}`}>
                    <Checkbox
                      id={`aspect-${aspectObject.id}`}
                      checked={isChecked}
                      disabled={isDisabled}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          aspectObject.id,
                          checked as boolean,
                        )
                      }
                    />
                    {aspectObject.name}
                    <span className="text-sm text-muted-foreground">
                      ({aspectObject.maxTrack} Track {aspectObject.category})
                    </span>
                  </FieldLabel>
                </TooltipTrigger>
                <TooltipContent className="[&_svg]:hidden!" sideOffset={8}>
                  {aspectObject.description}
                </TooltipContent>
              </Tooltip>
              <div>
                <strong>Effect:</strong> {aspectObject.effect}
              </div>
            </Field>
          );
        })}
      </div>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  );
}
