// ** External Imports
import { get } from "es-toolkit/compat";
import { createElement } from "react";

// ** Local Imports
import FilledFormField from "@/Components/FormField/FilledFormField";
import NotchedFormField from "@/Components/FormField/NotchedFormField";
import OutlinedFormField from "@/Components/FormField/OutlinedFormField";
import StackedFormField from "@/Components/FormField/StackedFormField";
import UnderlinedFormField from "@/Components/FormField/UnderlinedFormField";
import type { FormFieldProps } from "@/Components/FormField/formField.types";
import type { UseFormFieldReturn } from "@/Components/FormField/hooks/useFormField";
import { derived } from "@/Utils";

const shells = {
  filled: FilledFormField,
  notched: NotchedFormField,
  stacked: StackedFormField,
  outline: OutlinedFormField,
  underlined: UnderlinedFormField,
};

function FormField(
  props: Required<Pick<FormFieldProps, "field" | "children">>,
) {
  const api = props.field as UseFormFieldReturn;

  const Shell = derived(() => {
    const variant = api?.variantKey ?? "outline";

    return get(shells, variant, OutlinedFormField);
  });

  return createElement(Shell, { api }, props.children);
}

export default FormField;
