// ** External Imports
import type { Slot } from "vue";

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
  disabled?: boolean;
  label: string;
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
   * The selected value.
   *
   * @default undefined
   */
  modelValue?: string | number | (string | number)[];

  /**
   * Whether multiple values can be selected.
   *
   * @default false
   */
  multiple?: boolean;

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
   * @default "sm"
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
   * The variant of the select.
   *
   * @default "outline"
   */
  variant?: MergeProps<SelectVariant, SelectVariantOverrides>;
}

export interface SelectSlots {
  /**
   * Custom description content.
   */
  description?: Slot<undefined>;

  /**
   * Custom error message content.
   */
  error?: Slot<undefined>;

  /**
   * Custom label content.
   */
  label?: Slot<undefined>;

  /**
   * Custom option item content.
   */
  option?: Slot<undefined>;
}
