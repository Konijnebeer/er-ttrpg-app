import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import {
  characterSelfSchema,
  type CharacterSelf,
  type clock,
  type FalloutCurse,
} from "@/types/character";
import { Track } from "./track";
import { useCharacterStore } from "@/store/characterStore";
import {
  Checkbox,
  DispairCheckbox,
  HopeCheckbox,
} from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useSourceStore } from "@/store/sourceStore";

export function CharacterSection({
  character,
  className,
}: {
  character:  CharacterSelf;
  className?: string;
}) {
  return (
    <Section className={className}>
      <SectionHeader>
        <SectionTitle>
          <h2>Character</h2>
        </SectionTitle>
      </SectionHeader>
      <SectionContent className="p-2 space-y-4">
        <CharacterFields characterSelf={character} />
        <HopeDespair dispair={character.dispair} hope={character.hope} />
        <div className="flex flex-col gap-4">
          <FalloutCurse entity={character.fallout} type="fallout" />
          <FalloutCurse entity={character.curse} type="curse" />
        </div>
        <Clock clock={character.clock} />
      </SectionContent>
    </Section>
  );
}

function CharacterFields({ characterSelf }: { characterSelf: CharacterSelf }) {
  const { updateCharacter, character } = useCharacterStore();

  const characterSelfSchemaForm = characterSelfSchema.pick({
    name:       true,
    origin:     true,
    player:     true,
    path:       true,
    pronouns:   true,
    milestones: true,
  });
  const form = useForm({
    defaultValues: {
      name:       characterSelf.name,
      origin:     characterSelf.origin,
      player:     characterSelf.player,
      path:       characterSelf.path,
      pronouns:   characterSelf.pronouns,
      milestones: characterSelf.milestones,
    },
    validators: {
      onChange: characterSelfSchemaForm,
    },
    onSubmit: ({ value }) => {
      updateCharacter({
        data: {
          ...character.data,
          character: {
            ...character.data.character,
            name:       value.name,
            origin:     value.origin,
            player:     value.player,
            path:       value.path,
            pronouns:   value.pronouns,
            milestones: value.milestones,
          },
        },
      });
    },
  });

  return (
    <form
      className="md:grid grid-cols-2 gap-2 space-y-2 md:space-y-0 items-start"
      id="edit-character-self"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        listeners={{
          onChangeDebounceMs: 500,
          onChange:           () => {
            form.handleSubmit();
          },
        }}
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field
              data-invalid={isInvalid}
              className="grid grid-cols-[1fr_3fr]"
            >
              <FieldLabel htmlFor={field.name}>Name:</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Character name"
                autoComplete="off"
              />
              {isInvalid && (
                <FieldError
                  className="col-span-2"
                  errors={field.state.meta.errors}
                />
              )}
            </Field>
          );
        }}
      />
      <form.Field
        name="origin"
        listeners={{
          onChangeDebounceMs: 500,
          onChange:           () => {
            form.handleSubmit();
          },
        }}
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field
              data-invalid={isInvalid}
              className="grid grid-cols-[1fr_3fr]"
            >
              <FieldLabel htmlFor={field.name}>Origin:</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Character origin"
                autoComplete="off"
              />
              {isInvalid && (
                <FieldError
                  className="col-span-2"
                  errors={field.state.meta.errors}
                />
              )}
            </Field>
          );
        }}
      />

      <form.Field
        name="player"
        listeners={{
          onChangeDebounceMs: 500,
          onChange:           () => {
            form.handleSubmit();
          },
        }}
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field
              data-invalid={isInvalid}
              className="grid grid-cols-[1fr_3fr]"
            >
              <FieldLabel htmlFor={field.name}>Player:</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Player name"
                autoComplete="off"
              />
              {isInvalid && (
                <FieldError
                  className="col-span-2"
                  errors={field.state.meta.errors}
                />
              )}
            </Field>
          );
        }}
      />

      <form.Field
        name="path"
        listeners={{
          onChangeDebounceMs: 500,
          onChange:           () => {
            form.handleSubmit();
          },
        }}
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field
              data-invalid={isInvalid}
              className="grid grid-cols-[1fr_3fr]"
            >
              <FieldLabel htmlFor={field.name}>Path:</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Character path"
                autoComplete="off"
              />
              {isInvalid && (
                <FieldError
                  className="col-span-2"
                  errors={field.state.meta.errors}
                />
              )}
            </Field>
          );
        }}
      />

      <form.Field
        name="pronouns"
        listeners={{
          onChangeDebounceMs: 500,
          onChange:           () => {
            form.handleSubmit();
          },
        }}
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field
              data-invalid={isInvalid}
              className="grid grid-cols-[1fr_3fr]"
            >
              <FieldLabel htmlFor={field.name}>Pronouns:</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Character pronouns"
                autoComplete="off"
              />
              {isInvalid && (
                <FieldError
                  className="col-span-2"
                  errors={field.state.meta.errors}
                />
              )}
            </Field>
          );
        }}
      />

      <form.Field
        name="milestones"
        listeners={{
          onChangeDebounceMs: 500,
          onChange:           () => {
            form.handleSubmit();
          },
        }}
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field
              data-invalid={isInvalid}
              className="grid grid-cols-[1fr_3fr]"
            >
              <FieldLabel htmlFor={field.name}>Milestones:</FieldLabel>
              <Input
                className="[appearance:textfield]"
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value || ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={isInvalid}
                placeholder="0"
                autoComplete="off"
              />
              {isInvalid && (
                <FieldError
                  className="col-span-2"
                  errors={field.state.meta.errors}
                />
              )}
            </Field>
          );
        }}
      />
    </form>
  );
}

function HopeDespair({ dispair, hope }: { dispair: number; hope: number }) {
  const { updateCharacter, character } = useCharacterStore();
  const MaxCheckboxes = 6;

  const handleDespairChange = (increment: boolean) => {
    const newDespair = increment
      ? Math.min(dispair + 1, MaxCheckboxes - hope)
      : Math.max(dispair - 1, 0);

    updateCharacter({
      data: {
        ...character.data,
        character: {
          ...character.data.character,
          dispair: newDespair,
        },
      },
    });
  };

  const handleHopeChange = (increment: boolean) => {
    const newHope = increment
      ? Math.min(hope + 1, MaxCheckboxes - dispair)
      : Math.max(hope - 1, 0);

    updateCharacter({
      data: {
        ...character.data,
        character: {
          ...character.data.character,
          hope: newHope,
        },
      },
    });
  };

  const remainingCheckboxes = MaxCheckboxes - (dispair + hope);

  return (
    // Todo: Make responsive
    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row text-center space-y-2 md:space-y-0 items-center">
      <div className="flex-1 flex items-center gap-2 flex-col sm:flex-row md:flex-col lg:flex-row place-content-start">
        <Button size="icon" onClick={() => handleDespairChange(true)}>
          <Plus />
        </Button>
        <h3 className="capitalize">Despair</h3>
      </div>
      <div className=" flex gap-2 border-2 rounded-xl p-4 self-center">
        {/* Render Despair Checkboxes */}
        {Array.from({ length: dispair }).map((_, index) => (
          <DispairCheckbox
            className="aspect-square"
            key={`despair-${index}`}
            checked={true}
            onCheckedChange={() => handleDespairChange(false)}
          />
        ))}

        {/* Render Filler Checkboxes */}
        {Array.from({ length: remainingCheckboxes }).map((_, index) => (
          <Checkbox
            key={`placeholder-${index}`}
            className="opacity-50 aspect-square"
            disabled
          />
        ))}

        {/* Render Hope Checkboxes */}
        {Array.from({ length: hope }).map((_, index) => (
          <HopeCheckbox
            className=" aspect-square"
            key={`hope-${index}`}
            checked={true}
            onCheckedChange={() => handleHopeChange(false)}
          />
        ))}
      </div>
      <div className="flex-1 flex items-center gap-4 flex-col sm:flex-row md:flex-col lg:flex-row place-content-end">
        <h3 className="capitalize">Hope</h3>
        <Button size="icon" onClick={() => handleHopeChange(true)}>
          <Plus />
        </Button>
      </div>
    </div>
  );
}

function FalloutCurse({
  entity,
  type,
}: {
  entity: FalloutCurse;
  type:   "fallout" | "curse";
}) {
  const { updateCharacter, character } = useCharacterStore();
  const { getAllSourcesDataArray, resolveRefrence } = useSourceStore();

  const conditions = getAllSourcesDataArray("conditions");

  const handleTrackChange = (newLevel: number) => {
    if (!character.data.character[type]) return;

    // Normal track update
    updateCharacter({
      data: {
        ...character.data,
        character: {
          ...character.data.character,
          [type]: {
            ...character.data.character[type],
            currentTrack: newLevel,
          },
        },
      },
    });
    // Check if track is full
    if (newLevel >= entity.maxTrack) {
      // Timeout to show track for 1 second
      setTimeout(() => {
        // Increase level by 1 and reset track to 0
        updateCharacter({
          data: {
            ...character.data,
            character: {
              ...character.data.character,
              [type]: {
                ...character.data.character[type],
                currentTrack: 0,
                level:        entity.level + 1,
              },
            },
          },
        });
      }, 1000);
    }
  };

  const handleConditionChange = (value: string) => {
    if (!character.data.character[type]) return;
    if (value === "none") {
      // Remove condition and reset level
      updateCharacter({
        data: {
          ...character.data,
          character: {
            ...character.data.character,
            [type]: {
              ...character.data.character[type],
              condition: "",
              level:     0,
            },
          },
        },
      });
    } else {
      updateCharacter({
        data: {
          ...character.data,
          character: {
            ...character.data.character,
            [type]: {
              ...character.data.character[type],
              condition: value,
              level:     1,
            },
          },
        },
      });
    }
  };

  const handleLevelChange = (value: string) => {
    if (!character.data.character[type]) return;
    const newLevel = value === "" ? 0 : Number(value);
    updateCharacter({
      data: {
        ...character.data,
        character: {
          ...character.data.character,
          [type]: {
            ...character.data.character[type],
            level: newLevel,
          },
        },
      },
    });
  };

  // Get the current condition details
  const currentCondition = entity.condition
    ? resolveRefrence(entity.condition, "conditions")
    : "";

  // Get the description for the current level
  function getLevelDescription() {
    if (!currentCondition || entity.level === 0) return null;

    const levelData = currentCondition.levels.find(
      (l) => l.level === entity.level,
    );

    if (levelData) {
      return (
        <>
          <p className="font-bold">Level {entity.level}:</p>
          <p>{levelData.description}</p>
        </>
      );
    } else if (entity.level > currentCondition.levels.length) {
      return (
        <>
          <p className="font-bold">Final Moment:</p>
          <p>{currentCondition.finalMoment}</p>
        </>
      );
    }

    return null;
  }

  return (
    <div className="grid gap-2 grid-cols-1 sm:grid-cols-[3fr_8fr]">
      <h3 className="text-xl uppercase w-20 pt-1">{type}</h3>
      <div className="flex gap-4">
        <div className="flex flex-col justify-center gap-2">
          <Input
            type="number"
            className="w-10 h-10 text-center p-0 rounded-full border-2 [appearance:textfield]"
            value={entity.level || ""}
            onChange={(e) => handleLevelChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-col lg:flex-row xl:flex-col 2xl:flex-row">
            <Popover>
              <PopoverTrigger asChild>
                <p className="cursor-help underline decoration-dotted">
                  Condition:
                </p>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                {currentCondition && entity.level >= 0 ? (
                  <div className="text-sm space-y-2">
                    {getLevelDescription()}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No condition selected
                  </p>
                )}
              </PopoverContent>
            </Popover>
            <Select
              defaultValue={entity.condition || "none"}
              onValueChange={handleConditionChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {conditions &&
                  conditions
                    .filter((condition) => condition.type === type)
                    .map((condition) => (
                      <HoverCard key={condition.id}>
                        <HoverCardTrigger asChild>
                          <SelectItem value={condition.id}>
                            {condition.name}
                          </SelectItem>
                        </HoverCardTrigger>
                        <HoverCardContent side="right">
                          {condition.description}
                        </HoverCardContent>
                      </HoverCard>
                    ))}
              </SelectContent>
            </Select>
          </div>
          <Track
            track={entity.currentTrack}
            maxTrack={entity.maxTrack}
            onChange={(newLevel) => handleTrackChange(newLevel)}
          />
        </div>
      </div>
    </div>
  );
}

function Clock({ clock }: { clock: clock }) {
  const { updateCharacter, character } = useCharacterStore();

  const handleTrackChange = (type: keyof clock, newLevel: number) => {
    if (!character.data.character.clock) return;
    updateCharacter({
      data: {
        ...character.data,
        character: {
          ...character.data.character,
          clock: {
            ...character.data.character.clock,
            [type]: newLevel,
          },
        },
      },
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-between">
      <div className="flex flex-col p-2 gap-2">
        <p className="text-xl uppercase">Ticking Clock</p>
        <div className="grid grid-cols-[2fr_3fr]">
          <p>Food:</p>
          <div className="grow flex justify-center items-center">
            <Track
              track={clock.food}
              maxTrack={2}
              onChange={(newLevel) => handleTrackChange("food", newLevel)}
            />
          </div>
        </div>
        <div className="grid grid-cols-[2fr_3fr]">
          <p>Sleep:</p>
          <div className="grow flex justify-center items-center">
            <Track
              track={clock.sleep}
              maxTrack={2}
              onChange={(newLevel) => handleTrackChange("sleep", newLevel)}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="relative w-32 h-32 shrink-0">
          {/* Circular container */}
          <div className="absolute inset-0 rounded-full border-2 border-primary" />

          {/* Pill shape with dawn and dusk - centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 rounded-full flex items-center justify-between bg-secondary px-3 py-1 min-w-40">
            {/* Dawn label */}
            <p className="text-sm font-semibold whitespace-nowrap">Dawn</p>

            {/* Dusk label */}
            <p className="text-sm font-semibold whitespace-nowrap">Dusk</p>
          </div>
          {/* Bell in circular container - stacked on top */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 p-2 rounded-full flex items-center justify-center bg-background z-10">
            <Bell className="w-7 h-7 " />
          </div>

          {/* Top curved tracks (3 boxes) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-3 flex gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={`top-${i}`}
                className="w-5 h-6 shrink-0"
                style={{
                  transform: `translateY(${Math.abs(i - 1) * 10}px)`,
                }}
              >
                <Checkbox
                  className="rounded-full"
                  checked={clock.dawnDusk > i}
                  onCheckedChange={() => {
                    handleTrackChange(
                      "dawnDusk",
                      clock.dawnDusk > i ? i : i + 1,
                    );
                  }}
                />
              </div>
            ))}
          </div>

          {/* Bottom curved tracks (3 boxes) */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-3">
            {[3, 4, 5].map((i) => (
              <div
                key={`bottom-${i}`}
                className="w-5 h-6 shrink-0"
                style={{
                  transform: `translateY(-${Math.abs(i - 4) * 10}px)`,
                }}
              >
                <Checkbox
                  className="rounded-full"
                  checked={clock.dawnDusk > i}
                  onCheckedChange={() => {
                    handleTrackChange(
                      "dawnDusk",
                      clock.dawnDusk > i ? i : i + 1,
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
