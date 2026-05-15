// ** External Imports
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// ** Core Imports
import type {
  AlertColor,
  AlertPadding,
  AlertRounded,
  AlertShadow,
  AlertVariant,
  MergeProps,
} from "@bridge-ui/core";

export interface AlertColorOverrides {}
export interface AlertShadowOverrides {}
export interface AlertPaddingOverrides {}
export interface AlertRoundedOverrides {}
export interface AlertVariantOverrides {}

export interface AlertClasses {
  /**
   * The classes to apply to the body.
   */
  body?: string;

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
   * The icon to apply to the alert. Use `null` to omit the prop icon.
   *
   * @default undefined
   */
  icon?: LucideIcon | null;

  /**
   * The padding to apply to the alert.
   *
   * @default "medium"
   */
  padding?: MergeProps<AlertPadding, AlertPaddingOverrides>;

  /**
   * The roundedness of the alert.
   *
   * @default "sm"
   */
  rounded?: MergeProps<AlertRounded, AlertRoundedOverrides>;

  /**
   * The shadow to apply to the alert.
   *
   * @default "sm"
   */
  shadow?: MergeProps<AlertShadow, AlertShadowOverrides>;

  /**
   * The slots to apply to the alert.
   *
   * @default undefined
   */
  slots?: AlertSlots;

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
  variant?: MergeProps<AlertVariant, AlertVariantOverrides>;
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

  /**
   * The slot to apply to the icon.
   */
  icon?: ReactNode;
}
