// ** External Imports
import { ReactNode } from "react";

// ** Local Imports
import type {
  AlertColor,
  AlertPadding,
  AlertRounded,
  AlertShadow,
} from "@/Components/Alert/props";
import type { MergeProps, UnionProps } from "@/Utils";

export interface AlertColorOverrides {}
export interface AlertShadowOverrides {}
export interface AlertPaddingOverrides {}
export interface AlertRoundedOverrides {}
export interface AlertVariantOverrides {}

export interface AlertClasses {
  /**
   * The classes to apply to the description.
   */
  description?: string;

  /**
   * The classes to apply to the icon.
   */
  icon?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the title.
   */
  title?: string;
}

export interface AlertProps {
  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the alert.
   *
   * @default undefined
   */
  classes?: AlertClasses;

  /**
   * The color to apply to the alert.
   *
   * @default "primary"
   */
  color?: MergeProps<AlertColor, AlertColorOverrides>;

  /**
   * The icon to apply to the alert.
   *
   * @default undefined
   */
  icon?: any;

  /**
   * The padding to apply to the alert.
   *
   * @default "none"
   */
  padding?: MergeProps<AlertPadding, AlertPaddingOverrides>;

  /**
   * The roundedness of the alert.
   *
   * @default "none"
   */
  rounded?: MergeProps<AlertRounded, AlertRoundedOverrides>;

  /**
   * The shadow to apply to the alert.
   *
   * @default "none"
   */
  shadow?: MergeProps<AlertShadow, AlertShadowOverrides>;

  /**
   * The title to apply to the alert.
   *
   * @default undefined
   */
  title?: string;

  /**
   * The variant of the alert.
   *
   * @default "flat"
   */
  variant?: UnionProps<"flat" | "solid" | "outline", AlertVariantOverrides>;
}

export interface AlertSlots {
  /**
   * The slot to apply to the action.
   */
  action?: ReactNode;

  /**
   * The slot to apply to the footer.
   */
  footer?: ReactNode;

  /**
   * The slot to apply to the header.
   */
  header?: ReactNode;
}
