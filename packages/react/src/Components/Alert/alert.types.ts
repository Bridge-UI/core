// ** External Imports
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

// ** Local Imports
import type {
  AlertColor,
  AlertPadding,
  AlertRounded,
  AlertShadow,
  AlertVariant,
} from "@/Components/Alert/props";
import type { MergeProps } from "@/Utils";

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
  icon?: LucideIcon;

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
