import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { withCharacterForm } from "@/hooks/character.form";
import { makeRefrence } from "@/lib/versioningHelpers";
import { useSourceStore } from "@/store/sourceStore";
import type { SourceKey } from "@/types/refrence";
import type { OriginPath } from "@/types/source";
import { useEffect, useState } from "react";
import { defaultCharacterFormValues } from "../../create";

export const OriginPathSection = withCharacterForm({
  defaultValues: defaultCharacterFormValues,
  props: {
    sourceKeys: [] as SourceKey[],
    type: "" as "origins" | "paths",
    label: "" as string,
  },
  render: function Render({ form, sourceKeys, type, label }) {
    const { sources, getSourceDataArray } = useSourceStore();

    const [origins, setOrigins] = useState<
      Array<{ sourceKey: SourceKey; data: OriginPath }>
    >([]);

    useEffect(() => {
      if (sourceKeys.length > 0 && sources.size > 0) {
        const allOrigins: Array<{ sourceKey: SourceKey; data: OriginPath }> =
          [];

        sourceKeys.forEach((sourceKey) => {
          const originArray = getSourceDataArray(sourceKey, type);

          if (originArray) {
            originArray.forEach((origin) => {
              allOrigins.push({
                sourceKey: sourceKey,
                data: origin,
              });
            });
          }
        });

        setOrigins(allOrigins);
        console.log(`All ${type}:", ${allOrigins}`);
      }
    }, [sourceKeys, getSourceDataArray]);

    let name = "data.character.originRef" as
      | "data.character.originRef"
      | "data.character.pathRef";
    let selectedEdges = "selectedOriginEdges" as
      | "selectedOriginEdges"
      | "selectedPathEdges";
    let selectedSkills = "selectedOriginSkills" as
      | "selectedOriginSkills"
      | "selectedPathSkills";
    let selectedOddements = "selectedOriginOddements" as
      | "selectedOriginOddements"
      | "selectedPathOddements";
    let selectedFragements = "selectedOriginFragements" as
      | "selectedOriginFragements"
      | "selectedPathFragements";
    let selectedAspects = "selectedOriginAspects" as
      | "selectedOriginAspects"
      | "selectedPathAspects";
    if (type === "paths") {
      name = "data.character.pathRef";
      selectedEdges = "selectedPathEdges";
      selectedSkills = "selectedPathSkills";
      selectedOddements = "selectedPathOddements";
      selectedFragements = "selectedPathFragements";
      selectedAspects = "selectedPathAspects";
    }

    return (
      <form.Field
        name={name}
        listeners={{
          onChange: ({ value }) => {
            console.log(
              `${type} changed to: ${value}, resetting Edges & Skills`
            );
            form.setFieldValue(selectedEdges, []);
            form.setFieldValue(selectedSkills, []);
            form.setFieldValue(selectedOddements, []);
            form.setFieldValue(selectedFragements, []);
            form.setFieldValue(selectedAspects, []);
          },
        }}
        children={(field: any) => {
          // Find the selected origin based on the field value
          const selectedOriginRef = field.state.value;
          const selectedOrigin = origins.find((origin) => {
            const originRef = makeRefrence(origin.sourceKey, origin.data.id);
            return originRef === selectedOriginRef;
          });
          return (
            <FieldLabel htmlFor={"origin-select"} className="w-full">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>{label}</CardTitle>
                  <CardDescription>Select an {label}</CardDescription>
                  <CardAction>
                    {origins.length === 0 ? (
                      "No origins available"
                    ) : (
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={`Select an ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {origins.map((origin) => (
                            <SelectItem
                              key={`${origin.sourceKey}-${origin.data.id}`}
                              value={makeRefrence(
                                origin.sourceKey,
                                origin.data.id
                              )}
                            >
                              {origin.data.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </CardAction>
                </CardHeader>
                <CardContent>
                  {selectedOrigin ? (
                    <div className="space-y-4">
                      <div className="md:grid md:grid-cols-2 md:gap-4">
                        <form.AppField
                          name={selectedEdges}
                          children={(field) => (
                            <field.EdgesSkillsField
                              originId={selectedOrigin.data.id}
                              sourceKey={selectedOrigin.sourceKey}
                              entityRefs={selectedOrigin.data.edges}
                              type="edges"
                              parentType={type}
                              label="Edges"
                            />
                          )}
                        />
                        <form.AppField
                          name={selectedSkills}
                          children={(field) => (
                            <field.EdgesSkillsField
                              originId={selectedOrigin.data.id}
                              sourceKey={selectedOrigin.sourceKey}
                              entityRefs={selectedOrigin.data.skills}
                              type="skills"
                              parentType={type}
                              label="Skills"
                            />
                          )}
                        />
                        <form.AppField
                          name={selectedOddements}
                          children={(field) => (
                            <field.EdgesSkillsField
                              originId={selectedOrigin.data.id}
                              sourceKey={selectedOrigin.sourceKey}
                              entityRefs={selectedOrigin.data.oddements}
                              type="items"
                              parentType={type}
                              label="Oddements"
                            />
                          )}
                        />
                        <form.AppField
                          name={selectedFragements}
                          children={(field) => (
                            <field.EdgesSkillsField
                              originId={selectedOrigin.data.id}
                              sourceKey={selectedOrigin.sourceKey}
                              entityRefs={selectedOrigin.data.fragments}
                              type="items"
                              parentType={type}
                              label="Fragements"
                            />
                          )}
                        />
                      </div>
                      <form.AppField
                        name={selectedAspects}
                        children={(field) => (
                          <field.AspectsField
                            originId={selectedOrigin.data.id}
                            sourceKey={selectedOrigin.sourceKey}
                            aspectRefs={selectedOrigin.data.aspects}
                          />
                        )}
                      />
                    </div>
                  ) : (
                    "No Origin selected"
                  )}
                </CardContent>
                <CardFooter>
                  <FieldError errors={field.state.meta.errors} />
                </CardFooter>
              </Card>
            </FieldLabel>
          );
        }}
      />
    );
  },
});
