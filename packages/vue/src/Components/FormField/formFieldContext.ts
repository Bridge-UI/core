// ** External Imports
import type { InjectionKey } from "vue";

// ** Local Imports
import type { useFormField } from "@/Components/FormField/composables/useFormField";

export type FormFieldApi = ReturnType<typeof useFormField>;

// prettier-ignore
export const formFieldContextKey: InjectionKey<FormFieldApi> = Symbol("formFieldContext");
