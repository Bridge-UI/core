// ** Local Imports
import FilledFormField from "@/Components/FormField/FilledFormField";
import NotchedFormField from "@/Components/FormField/NotchedFormField";
import OutlinedFormField from "@/Components/FormField/OutlinedFormField";
import StackedFormField from "@/Components/FormField/StackedFormField";
import UnderlinedFormField from "@/Components/FormField/UnderlinedFormField";
import type { FormFieldProps } from "@/Components/FormField/formField.types";
import type { UseFormFieldReturn } from "@/Components/FormField/hooks/useFormField";

function FormField(
  props: Required<Pick<FormFieldProps, "field" | "children">>,
) {
  const api = props.field as UseFormFieldReturn;

  const variant = api?.variantKey ?? "outline";

  switch (variant) {
    case "filled":
      return <FilledFormField api={api}>{props.children}</FilledFormField>;

    case "underlined":
      return (
        <UnderlinedFormField api={api}>{props.children}</UnderlinedFormField>
      );

    case "stacked":
      return <StackedFormField api={api}>{props.children}</StackedFormField>;

    case "notched":
      return <NotchedFormField api={api}>{props.children}</NotchedFormField>;

    case "outline":
      return <OutlinedFormField api={api}>{props.children}</OutlinedFormField>;
  }
}

export default FormField;
