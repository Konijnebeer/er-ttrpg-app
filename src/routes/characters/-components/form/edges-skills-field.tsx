import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useFieldContext, useFormContext } from "@/hooks/character.form";
import { useEffect, useState } from "react";

import { ensureRefrence } from "@/lib/versioningHelpers";
import { useSourceStore } from "@/store/sourceStore";

import type { Reference, SourceKey } from "@/types/refrence";
import type { EdgeSkill } from "@/types/source";
import type { ItemReference, OddementReference } from "@/types/character";
import { useStore } from "@tanstack/react-form";
import { wandererExperienceEnum } from "../../create";

export function EdgesSkillsField({
  originId,
  sourceKey,
  entityRefs,
  type,
  parentType,
  label,
}: {
  originId:   string;
  sourceKey:  SourceKey;
  entityRefs: Reference[];
  type:       "edges" | "skills" | "oddements" | "fragments";
  parentType: "origins" | "paths";
  label:      string;
}) {
  const field = useFieldContext<Reference[] | OddementReference[]>();
  const form = useFormContext();
  const wandererExperience = useStore(
    form.store,
    (state) => state.values.wandererExperience,
  );
  let otherEdge: Reference[] = [];
  if (type === "edges" && parentType === "origins") {
    otherEdge = useStore(form.store, (state) => state.values.selectedPathEdges);
  } else if (type === "edges" && parentType === "paths") {
    otherEdge = useStore(
      form.store,
      (state) => state.values.selectedOriginEdges,
    );
  }
  const { resolveRefrence } = useSourceStore();
  const [entityObjects, setEntityObjects] = useState<EdgeSkill[]>([]);

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const selectedEntities = (field.state.value || []) as
    | Reference[]
    | OddementReference[];
  // default max for edges/skills, items
  // Linstener for wandererExperience to change the max selection
  let maxSelection = 1;
  if (wandererExperience === wandererExperienceEnum.enum.newly) {
    if (type === "edges") {
      maxSelection = 1;
    }
    if (type === "skills") {
      maxSelection = 2;
    }
    if (type === "oddements" || type === "fragments") {
      maxSelection = 1;
    }
  } else if (wandererExperience === wandererExperienceEnum.enum.capable) {
    if (type === "edges") {
      maxSelection = 1;
    }
    if (type === "skills") {
      maxSelection = 4;
    }
    if (type === "oddements" || type === "fragments") {
      maxSelection = 2;
    }
  }

  useEffect(() => {
    // Reset state when origin changes
    setEntityObjects([]);

    // Resolve all references
    const resolvedEntityObjects: EdgeSkill[] = [];

    entityRefs.forEach((entityRef) => {
      try {
        // TODO: check if its a self refrence or not
        const entityObject = resolveRefrence(
          ensureRefrence(sourceKey, entityRef),
          type,
        );
        if (entityObject) {
          resolvedEntityObjects.push(entityObject as EdgeSkill);
        }
      } catch (error) {
        console.error(`Failed to resolve reference: ${entityRef}`, error);
      }
    });

    setEntityObjects(resolvedEntityObjects);
  }, [originId, sourceKey, entityRefs, resolveRefrence]);

  const handleCheckboxChange = (entityId: string, checked: boolean) => {
    const ref = ensureRefrence(sourceKey, entityId); // Create a full reference for all types

    if (type === "oddements" || type === "fragments") {
      // Items are saved as ItemReference objects with default quantity 1
      let items;
      if (type === "oddements") {
        items = selectedEntities as OddementReference[];
      } else {
        items = selectedEntities as ItemReference[];
      }

      if (checked) {
        // Don't duplicate
        if (!items.some((i) => i.ref === ref)) {
          field.handleChange([...items, { ref, quantity: 1 }]);
        }
      } else {
        field.handleChange(items.filter((i) => i.ref !== ref));
      }
      return;
    }

    // Edges/skills: store full references
    const refs = selectedEntities as Reference[];
    if (checked) {
      if (!refs.includes(ref)) {
        field.handleChange([...refs, ref]);
      }
    } else {
      field.handleChange(refs.filter((id: Reference) => id !== ref));
    }
  };

  return (
    <FieldSet data-invalid={isInvalid}>
      <FieldLabel>
        {label} ({selectedEntities.length} of {maxSelection || "X"} selected)
      </FieldLabel>
      <div className="grid grid-cols-2 gap-2">
        {entityObjects.map((entityObject) => {
          const ref = ensureRefrence(sourceKey, entityObject.id);
          // Determine if the entity is checked and if it should be disabled
          const isChecked =
            type === "oddements" || type === "fragments"
              ? (selectedEntities as OddementReference[]).some(
                  (i) => i.ref === ref,
                )
              : (selectedEntities as Reference[]).includes(ref);

          // Check if this edge is already selected in the other field (origin vs path)
          const isSelectedInOtherField =
            type === "edges" && otherEdge.includes(ref);

          const isDisabled =
            isSelectedInOtherField ||
            (!isChecked &&
              selectedEntities.length >= maxSelection &&
              maxSelection !== Infinity);

          const labelContent = (
            <FieldLabel htmlFor={`${parentType}-${type}-${entityObject.id}`}>
              <Checkbox
                id={`${parentType}-${type}-${entityObject.id}`}
                checked={isChecked}
                disabled={isDisabled}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(entityObject.id, checked as boolean)
                }
              />
              {entityObject.name}
            </FieldLabel>
          );

          return (
            <Field key={`${parentType}-${type}-${entityObject.id}`}>
              {entityObject.description ? (
                <Tooltip>
                  <TooltipTrigger asChild>{labelContent}</TooltipTrigger>
                  <TooltipContent className="[&_svg]:hidden!" sideOffset={8}>
                    {entityObject.description}
                  </TooltipContent>
                </Tooltip>
              ) : (
                labelContent
              )}
            </Field>
          );
        })}
      </div>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  );
}
