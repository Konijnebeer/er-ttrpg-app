import {
  NameField,
  DescriptionField,
  OptionsField,
  NumberField,
} from "@/components/content/form-fields";
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

const { useAppForm: useContentForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    NameField,
    DescriptionField,
    OptionsField,
    NumberField,
  },
  formComponents: {},
});

export { useContentForm };
