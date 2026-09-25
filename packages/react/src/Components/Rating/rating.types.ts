// ** External Imports
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
} from "react";

// ** Core Imports
import type {
  RatingColor,
  RatingRounded,
  RatingSize,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type {
  FormControlClasses,
  FormControlCustomProps,
  FormControlOwnProps,
  FormControlSlots,
} from "@/Components/FormControl/formControl.types";
import type { IconProps } from "@/Components/Icon";

export interface RatingSizeOverrides {}
export interface RatingColorOverrides {}
export interface RatingRoundedOverrides {}

export interface RatingCallbacks {
  /**
   * Called with the next value. `null` means the selection was cleared.
   */
  onChange?: (value: null | number) => void;
}

export interface RatingClasses extends FormControlClasses {
  /**
   * Classes merged onto the rating group.
   */
  group?: string;

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

export interface RatingCustomProps extends FormControlCustomProps {
  /**
   * Props forwarded to the rating group.
   */
  group?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to each `Icon`. The icon source stays on `icon`.
   */
  icon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the hidden input.
   */
  input?: InputHTMLAttributes<HTMLInputElement>;

  /**
   * Props forwarded to each rating item.
   */
  item?: ButtonHTMLAttributes<HTMLButtonElement>;
}

export interface RatingOwnProps extends Omit<
  FormControlOwnProps,
  "field" | "slots" | "classes" | "children" | "customProps"
> {
  /**
   * Classes for the form control chrome and the rating parts.
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
   * Initial value for uncontrolled usage.
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
   * Number of items. Values are integers from 1 through `max`.
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
   * Roundedness of each item hit area.
   *
   * @default "sm"
   */
  rounded?: MergeProps<RatingRounded, RatingRoundedOverrides>;

  /**
   * Size of the icons and of form control labels (`2xs` … `2xl`).
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
   * Selected value. `null` clears the rating. Pair with `onChange`.
   *
   * @default undefined
   */
  value?: null | number;
}

export interface RatingSlots extends FormControlSlots {}

export type RatingProps = MergeHtmlProps<
  RatingOwnProps & RatingCallbacks,
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "onChange" | "defaultValue">
>;
