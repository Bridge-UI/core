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

const shells = {
  filled: FilledFormField,
  notched: NotchedFormField,
  stacked: StackedFormField,
  outline: OutlinedFormField,
  underlined: UnderlinedFormField,
};

type FormFieldComponentProps = Required<
  Pick<FormFieldProps, "field" | "children">
>;

function FormField(props: FormFieldComponentProps) {
  const api: UseFormFieldReturn = props.field;

  const variant = api?.variantKey ?? "outline";

  const Shell = get(shells, variant, OutlinedFormField);

  return createElement(Shell, { api }, props.children);
}

export default FormField;
