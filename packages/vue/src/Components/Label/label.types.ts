// ** Core Imports
import type { LabelSize, MergeHtmlProps, MergeProps } from "@bridge-ui/core";

export interface LabelSizeOverrides {}

export interface LabelClasses {
  /**
   * Classes merged onto the `<label>` element.
   */
  root?: string;

  /**
   * Classes merged onto the required asterisk.
   */
  required?: string;
}

export interface LabelOwnProps {
  /**
   * Extra classes merged with `classes.root`.
   *
   * @default undefined
   */
  class?: string;

  /**
   * The classes to apply to the label.
   *
   * @default undefined
   */
  classes?: LabelClasses;

  /**
   * Applies error label colors.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Associates the label with a form control.
   *
   * @default undefined
   */
  for?: string;

  /**
   * Shows a red required asterisk after the label text.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Typography scale aligned with TextField sizes.
   *
   * @default "md"
   */
  size?: MergeProps<LabelSize, LabelSizeOverrides>;
}

export type LabelProps = MergeHtmlProps<LabelOwnProps, HTMLLabelElement>;
