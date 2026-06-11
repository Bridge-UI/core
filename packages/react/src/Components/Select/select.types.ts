// ** External Imports
import type { InputHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldOwnProps,
  FormFieldPartsProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";

export type SelectValue = string | number;

export type SelectModel = SelectValue | SelectValue[];

export interface SelectOption {
  /**
   * Secondary line below the label.
   */
  description?: string;

  /**
   * Whether the option is disabled.
   */
  disabled?: boolean;

  /**
   * The label of the option.
   */
  label: string;

  /**
   * The value of the option.
   */
  value: SelectValue;
}

export interface SelectClasses extends FormFieldClasses {
  /**
   * The classes to apply to selected chips (multiple mode).
   */
  chip?: string;

  /**
   * The classes to apply to the dropdown content.
   */
  content?: string;

  /**
   * The classes to apply to the option item.
   */
  item?: string;
}

export interface SelectPartsProps extends FormFieldPartsProps {}

export interface SelectOwnProps extends Omit<FormFieldOwnProps, "field"> {
  /**
   * Whether the value can be cleared.
   *
   * @default true
   */
  clearable?: boolean;

  /**
   * Whether multiple values can be selected.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Callback when the selection changes.
   */
  onChange?: (value: SelectModel) => void;

  /**
   * The list of options to display.
   */
  options?: SelectOption[];

  /**
   * Placeholder shown when no value is selected.
   */
  placeholder?: string;

  /**
   * Whether options can be filtered via the trigger input.
   *
   * @default false
   */
  searchable?: boolean;

  /**
   * The selected value.
   */
  value?: SelectModel;
}

export interface SelectSlots extends FormFieldSlots {
  /**
   * Custom option item content.
   */
  option?: ReactNode;
}

export type SelectProps = MergeHtmlProps<
  SelectOwnProps,
  InputHTMLAttributes<HTMLInputElement>
>;
