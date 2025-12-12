import { Checkbox } from "@/components/ui/checkbox";
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { withCharacterForm } from "@/hooks/character.form";
import { makeSourceKey } from "@/lib/versioningHelpers";
import { useSourceStore } from "@/store/sourceStore";
import type { SourceKey } from "@/types/refrence";
import { useState } from "react";
import { defaultCharacterFormValues } from "../../create";

export const CoreSourceSection = withCharacterForm({
  defaultValues: defaultCharacterFormValues,
  render: function Render({ form }) {
    const { groupedSources } = useSourceStore();
    return (
      <form.AppField
        name="versionRef"
        listeners={{
          onChange: ({ value }) => {
            console.log(`versionRef changed to: ${value}, resetting Origin`);
            (form as any).setFieldValue("data.character.originRef", "");
            (form as any).setFieldValue("data.character.pathRef", "");
          },
        }}
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <FieldSet data-invalid={isInvalid}>
              <FieldLabel htmlFor="versionRef">Core Dependencies</FieldLabel>
              <FieldDescription>
                Select the Core rules the character will use
              </FieldDescription>
              <RadioGroup
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
                aria-invalid={isInvalid}
              >
                {groupedSources.Core.map((source) => (
                  <CoreSourceCard
                    key={source.id}
                    sourceId={source.id}
                    versions={source.versions}
                    onSelect={(sourceKey) => field.handleChange(sourceKey)}
                  />
                ))}
              </RadioGroup>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
          );
        }}
      />
    );
  },
});

function CoreSourceCard({
  sourceId,
  versions,
  onSelect,
}: {
  sourceId: string;
  versions: string[];
  onSelect: (sourceKey: SourceKey) => void;
}) {
  const [selectedVersion, setSelectedVersion] = useState(versions[0]);

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    const sourceKey = makeSourceKey(sourceId, version);
    onSelect(sourceKey);
  };
  const sourceKey = makeSourceKey(sourceId, selectedVersion);

  return (
    <FieldLabel htmlFor={sourceId} className="w-full">
      <Item variant="outline" size="sm" className="w-full">
        <ItemMedia>
          <RadioGroupItem value={sourceKey} id={sourceId} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{sourceId}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Select value={selectedVersion} onValueChange={handleVersionChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select a Version" />
            </SelectTrigger>
            <SelectContent>
              {versions.map((version) => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ItemActions>
      </Item>
    </FieldLabel>
  );
}

export const ExtraSourceSection = withCharacterForm({
  defaultValues: defaultCharacterFormValues,
  render: function Render({ form }) {
    const { groupedSources } = useSourceStore();
    return (
      <form.Subscribe selector={(state: any) => state.values.versionRef}>
        {(versionRef: string) =>
          versionRef && (
            <form.Field
              name="dependencies"
              children={(field: any) => (
                <FieldSet>
                  <FieldLabel>Extra Content</FieldLabel>
                  <FieldDescription>
                    Select additional content for this character
                  </FieldDescription>
                  {groupedSources.Extra.map((source) => (
                    <ExtraSourceCard
                      key={source.id}
                      sourceId={source.id}
                      versions={source.versions}
                      selectedKeys={field.state.value || []}
                      onToggle={(sourceKey: SourceKey, checked: boolean) => {
                        const currentDeps = field.state.value || [];
                        if (checked) {
                          field.handleChange([...currentDeps, sourceKey]);
                        } else {
                          field.handleChange(
                            currentDeps.filter(
                              (key: SourceKey) => key !== sourceKey
                            )
                          );
                        }
                      }}
                    />
                  ))}
                </FieldSet>
              )}
            />
          )
        }
      </form.Subscribe>
    );
  },
});

function ExtraSourceCard({
  sourceId,
  versions,
  selectedKeys,
  onToggle,
}: {
  sourceId: string;
  versions: string[];
  selectedKeys: SourceKey[];
  onToggle: (sourceKey: SourceKey, checked: boolean) => void;
}) {
  const [selectedVersion, setSelectedVersion] = useState(versions[0]);
  const currentSourceKey = makeSourceKey(sourceId, selectedVersion);

  const isThisVersionSelected = selectedKeys.includes(currentSourceKey);

  const handleVersionChange = (newVersion: string) => {
    const oldSourceKey = currentSourceKey;
    const newSourceKey = makeSourceKey(sourceId, newVersion);

    if (isThisVersionSelected) {
      onToggle(oldSourceKey, false);
      onToggle(newSourceKey, true);
    }

    setSelectedVersion(newVersion);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onToggle(currentSourceKey, checked);
  };

  return (
    <FieldLabel htmlFor={sourceId} className="w-full">
      <Item variant="outline" size="sm" className="w-full">
        <ItemMedia>
          <Checkbox
            checked={isThisVersionSelected}
            onCheckedChange={handleCheckboxChange}
            id={sourceId}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{sourceId}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Select value={selectedVersion} onValueChange={handleVersionChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Version" />
            </SelectTrigger>
            <SelectContent>
              {versions.map((version) => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ItemActions>
      </Item>
    </FieldLabel>
  );
}
