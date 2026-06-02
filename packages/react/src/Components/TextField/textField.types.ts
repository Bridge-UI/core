// ** External Imports
import type { InputHTMLAttributes } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldOwnProps,
  FormFieldPartsProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";

export interface TextFieldClasses extends FormFieldClasses {}

export interface TextFieldPartsProps extends FormFieldPartsProps {}

export interface TextFieldOwnProps extends Omit<FormFieldOwnProps, "field"> {}

export interface TextFieldSlots extends FormFieldSlots {}

export type TextFieldProps = MergeHtmlProps<
  TextFieldOwnProps,
  InputHTMLAttributes<HTMLInputElement>
>;
