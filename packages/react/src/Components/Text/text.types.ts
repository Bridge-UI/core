// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  TextColor,
  TextSize,
  TextVariant,
  TextWeight,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface TextSizeOverrides {}
export interface TextColorOverrides {}
export interface TextWeightOverrides {}
export interface TextVariantOverrides {}

export interface TextClasses {
  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface TextOwnProps {
  /**
   * The element rendered as the root.
   *
   * @default "p"
   */
  as?:
    | "p"
    | "dd"
    | "dt"
    | "em"
    | "li"
    | "div"
    | "span"
    | "label"
    | "small"
    | "strong"
    | "figcaption";

  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the text.
   *
   * @default undefined
   */
  classes?: TextClasses;

  /**
   * The color of the text. Ignores `global.defaultColor`.
   *
   * @default "dark"
   */
  color?: MergeProps<TextColor, TextColorOverrides>;

  /**
   * Whether digits use tabular figures and tight tracking (money, counts).
   *
   * @default false
   */
  numeric?: boolean;

  /**
   * The size of the text.
   *
   * @default "md"
   */
  size?: MergeProps<TextSize, TextSizeOverrides>;

  /**
   * Whether the text is cut to one line with an ellipsis.
   *
   * @default false
   */
  truncate?: boolean;

  /**
   * Whether the text is uppercase with wide tracking (small labels).
   *
   * @default false
   */
  uppercase?: boolean;

  /**
   * The tone of the text: `default` for main text, `muted` for secondary text.
   *
   * @default "default"
   */
  variant?: MergeProps<TextVariant, TextVariantOverrides>;

  /**
   * The font weight of the text.
   *
   * @default "normal"
   */
  weight?: MergeProps<TextWeight, TextWeightOverrides>;
}

export type TextProps = MergeHtmlProps<
  TextOwnProps,
  HTMLAttributes<HTMLElement>
>;
