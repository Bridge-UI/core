// ** External Imports
import type { ReactNode } from "react";

// ** Core Imports
import type {
  MergeProps,
  SelectColor,
  SelectRounded,
  SelectSize,
  SelectVariant,
} from "@bridge-ui/core";

export interface SelectSizeOverrides {}
export interface SelectColorOverrides {}
export interface SelectRoundedOverrides {}
export interface SelectVariantOverrides {}

export interface SelectOption {
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
  value: string | number;
}

export interface SelectClasses {
  /**
   * The classes to apply to the dropdown content.
   */
  content?: string;

  /**
   * The classes to apply to the description.
   */
  description?: string;

  /**
   * The classes to apply to the error message.
   */
  error?: string;

  /**
   * The classes to apply to the option item.
   */
  item?: string;

  /**
   * The classes to apply to the label.
   */
  label?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the trigger.
   */
  trigger?: string;
}

export interface SelectProps {
  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the select.
   *
   * @default undefined
   */
  classes?: SelectClasses;

  /**
   * The color to apply to the select.
   *
   * @default "primary"
   */
  color?: MergeProps<SelectColor, SelectColorOverrides>;

  /**
   * The description text below the label.
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether the select is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * The error message to display.
   *
   * @default undefined
   */
  error?: string;

  /**
   * The label text for the select.
   *
   * @default undefined
   */
  label?: string;

  /**
   * Whether multiple values can be selected.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Callback when the selection changes.
   *
   * @default undefined
   */
  onChange?: (value: string | number | (string | number)[]) => void;

  /**
   * The list of options to display.
   *
   * @default undefined
   */
  options?: SelectOption[];

  /**
   * The placeholder text.
   *
   * @default undefined
   */
  placeholder?: string;

  /**
   * Whether the select is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * The roundedness of the select.
   *
   * @default "md"
   */
  rounded?: MergeProps<SelectRounded, SelectRoundedOverrides>;

  /**
   * Whether the options are searchable.
   *
   * @default false
   */
  searchable?: boolean;

  /**
   * The size of the select.
   *
   * @default "md"
   */
  size?: MergeProps<SelectSize, SelectSizeOverrides>;

  /**
   * The slots to apply to the select.
   *
   * @default undefined
   */
  slots?: SelectSlots;

  /**
   * The selected value.
   *
   * @default undefined
   */
  value?: string | number | (string | number)[];

  /**
   * The variant of the select.
   *
   * @default "outline"
   */
  variant?: MergeProps<SelectVariant, SelectVariantOverrides>;
}

export interface SelectSlots {
  /**
   * The slot for the description.
   */
  description?: ReactNode;

  /**
   * The slot for the error message.
   */
  error?: ReactNode;

  /**
   * The slot for the label.
   */
  label?: ReactNode;

  /**
   * The slot for the option item.
   */
  option?: ReactNode;
}
