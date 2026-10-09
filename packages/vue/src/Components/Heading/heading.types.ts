// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  TextColor,
  TextSize,
  TextVariant,
  TextWeight,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  TextColorOverrides,
  TextSizeOverrides,
  TextVariantOverrides,
  TextWeightOverrides,
} from "@/Components/Text";

export interface HeadingClasses {
  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface HeadingOwnProps {
  /**
   * The classes to apply to the heading.
   *
   * @default undefined
   */
  classes?: HeadingClasses;

  /**
   * The color of the heading. Ignores `global.defaultColor`.
   *
   * @default "dark"
   */
  color?: MergeProps<TextColor, TextColorOverrides>;

  /**
   * The heading level. Sets the element (`h1`–`h6`) and, when `size` is not
   * set, the font size.
   *
   * @default 2
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * The font size of the heading. When unset, it follows `level`.
   *
   * @default undefined
   */
  size?: MergeProps<TextSize, TextSizeOverrides>;

  /**
   * The tone of the heading: `default` for main text, `muted` for secondary text.
   *
   * @default "default"
   */
  variant?: MergeProps<TextVariant, TextVariantOverrides>;

  /**
   * The font weight of the heading.
   *
   * @default "semibold"
   */
  weight?: MergeProps<TextWeight, TextWeightOverrides>;
}

export interface HeadingSlots {
  /**
   * The content of the heading.
   */
  default?: Slot<undefined>;
}

export type HeadingProps = MergeHtmlProps<HeadingOwnProps, HTMLAttributes>;
