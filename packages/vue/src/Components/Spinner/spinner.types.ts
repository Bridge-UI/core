// ** External Imports
import type { HTMLAttributes, SVGAttributes } from "vue";

// ** Core Imports
import type {
  SpinnerColor,
  SpinnerSize,
  SpinnerVariant,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface SpinnerSizeOverrides {}
export interface SpinnerColorOverrides {}
export interface SpinnerVariantOverrides {}

export interface SpinnerClasses {
  /**
   * The classes to apply to the progress circle.
   */
  circle?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the svg element.
   */
  svg?: string;

  /**
   * The classes to apply to the track circle.
   */
  track?: string;
}

export interface SpinnerCustomProps {
  /**
   * Props forwarded to the progress circle.
   */
  circle?: SVGAttributes;

  /**
   * Props forwarded to the root element.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the svg element.
   */
  svg?: SVGAttributes;

  /**
   * Props forwarded to the track circle.
   */
  track?: SVGAttributes;
}

export interface SpinnerOwnProps {
  /**
   * The classes to apply to spinner parts.
   *
   * @default undefined
   */
  classes?: SpinnerClasses;

  /**
   * The color of the spinner.
   *
   * @default "primary"
   */
  color?: MergeProps<SpinnerColor, SpinnerColorOverrides>;

  /**
   * Extra props for internal parts (`root`, `svg`, `circle`, `track`).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  customProps?: SpinnerCustomProps;

  /**
   * Disables the indeterminate shrink animation on the circle.
   *
   * @default false
   */
  disableShrink?: boolean;

  /**
   * Renders a subtle track circle behind the progress arc.
   *
   * @default false
   */
  enableTrack?: boolean;

  /**
   * The size of the spinner.
   *
   * @default "md"
   */
  size?: MergeProps<SpinnerSize, SpinnerSizeOverrides>;

  /**
   * The stroke thickness of the circle.
   *
   * @default 3.6
   */
  thickness?: number;

  /**
   * Progress value from 0 to 100. Used by the `determinate` variant.
   *
   * @default undefined
   */
  value?: number;

  /**
   * Visual variant of the spinner.
   *
   * @default "indeterminate"
   */
  variant?: MergeProps<SpinnerVariant, SpinnerVariantOverrides>;
}

export type SpinnerProps = MergeHtmlProps<SpinnerOwnProps, HTMLAttributes>;
