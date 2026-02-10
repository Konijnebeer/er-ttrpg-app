import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import {
  NameField,
  AuthorField,
  DescriptionField,
  WandererExperienceField,
} from "@/routes/characters/-components/form/form-fields";
import { EdgesSkillsField } from "@/routes/characters/-components/form/edges-skills-field";
import { AspectsField } from "@/routes/characters/-components/form/aspects-field";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm: useCharacterForm, withForm: withCharacterForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      NameField,
      AuthorField,
      DescriptionField,
      WandererExperienceField,
      EdgesSkillsField,
      AspectsField,
    },
    formComponents: {},
  });
