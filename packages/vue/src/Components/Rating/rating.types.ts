// ** External Imports
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
} from "vue";

// ** Core Imports
import type { RatingColor, RatingSize } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type {
  BaseFieldClasses,
  BaseFieldCustomProps,
  BaseFieldOwnProps,
  BaseFieldSlots,
} from "@/Components/BaseField/baseField.types";
import type { IconProps } from "@/Components/Icon";

export interface RatingSizeOverrides {}
export interface RatingColorOverrides {}

export interface RatingClasses extends BaseFieldClasses {
  /**
   * Classes merged onto each icon.
   */
  icon?: string;

  /**
   * Classes merged onto the hidden input.
   */
  input?: string;

  /**
   * Classes merged onto each rating item.
   */
  item?: string;
}

export interface RatingCustomProps extends BaseFieldCustomProps {
  /**
   * Props forwarded to each `Icon`. The icon source stays on `icon`.
   */
  icon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the hidden input.
   */
  input?: InputHTMLAttributes;

  /**
   * Props forwarded to each rating item.
   */
  item?: ButtonHTMLAttributes;
}

export interface RatingEmits {
  /**
   * Emitted when `v-model` should update. `null` clears the rating.
   */
  "update:modelValue": [value: null | number];
}

export interface RatingOwnProps extends Omit<
  BaseFieldOwnProps,
  "field" | "slots" | "classes" | "children" | "customProps"
> {
  /**
   * Classes for the field chrome and the rating parts.
   *
   * @default undefined
   */
  classes?: RatingClasses;

  /**
   * The color applied to selected icons.
   *
   * @default "primary"
   */
  color?: MergeProps<RatingColor, RatingColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: RatingCustomProps;

  /**
   * Initial value for uncontrolled usage. Fractions are kept.
   *
   * @default undefined
   */
  defaultValue?: null | number;

  /**
   * Icon used for every item. Semantic name `star` is the default.
   *
   * @default "star"
   */
  icon?: IconSource;

  /**
   * Number of items. The value runs from above 0 through `max`.
   *
   * @default 5
   */
  max?: number;

  /**
   * The `name` of the hidden input submitted with the form.
   *
   * @default undefined
   */
  name?: string;

  /**
   * Size of the icons and of the field label (`2xs` … `2xl`).
   *
   * @default "md"
   */
  size?: MergeProps<RatingSize, RatingSizeOverrides>;

  /**
   * Chrome slots.
   *
   * @default undefined
   */
  slots?: RatingSlots;

  /**
   * Increment for pointer and keyboard selection.
   * `1` selects a whole item. `0.5` selects each half.
   *
   * @default 1
   */
  step?: number;
}

export interface RatingSlots extends BaseFieldSlots {}

export type RatingProps = MergeHtmlProps<
  RatingOwnProps,
  Omit<HTMLAttributes, "color" | "defaultValue">
>;
