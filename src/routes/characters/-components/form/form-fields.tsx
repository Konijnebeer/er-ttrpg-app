import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFieldContext } from "@/hooks/character.form";
import { wandererExperienceEnum } from "../../create";

export function NameField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
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
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}

export function AuthorField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder="Username"
        autoComplete="off"
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}

export function DescriptionField({
  label,
  maxCharacters,
}: {
  label:         string;
  maxCharacters: number;
}) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder="Place to add any information about the character or build"
          rows={5}
          className="min-h-12 resize-none"
          aria-invalid={isInvalid}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="tabular-nums">
            {field.state.value.length}/{maxCharacters} characters
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}

export function WandererExperienceField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel>{label}</FieldLabel>
      <RadioGroup
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        className="flex gap-4 flex-wrap"
      >
        <FieldLabel
          htmlFor="newly-awakened"
          className="flex items-center gap-2 cursor-pointer p-2 rounded-md border"
        >
          <RadioGroupItem value={wandererExperienceEnum.enum.newly} id="newly-awakened" />
          <span>Newly-Awakened</span>
        </FieldLabel>
        <FieldLabel
          htmlFor="capable-explorer"
          className="flex items-center gap-2 cursor-pointer p-2 rounded-md border"
        >
          <RadioGroupItem value={wandererExperienceEnum.enum.capable} id="capable-explorer" />
          <span>Capable Explorer</span>
        </FieldLabel>
      </RadioGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
