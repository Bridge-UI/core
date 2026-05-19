// ** External Imports
import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  AlertColor,
  AlertPadding,
  AlertRounded,
  AlertShadow,
  AlertVariant,
  MergeHtmlProps,
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

export interface AlertOwnProps {
  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Extra classes merged with the root element (and `classes.root`).
   *
   * @default undefined
   */
  className?: string;

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
   * Content aligned to the right of the title row (e.g. dismiss or link).
   */
  action?: ReactNode;

  /**
   * Footer below the body, with top border spacing.
   */
  footer?: ReactNode;

  /**
   * Replaces the entire alert header area (title row, icon, action).
   */
  header?: ReactNode;

  /**
   * Custom icon markup. When provided, it replaces the default `Icon` used from the `icon` prop.
   */
  icon?: ReactNode;
}

export type AlertProps = MergeHtmlProps<
  AlertOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
