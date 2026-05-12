// ** Local Imports
import type { AlertColor } from "@/Components/Alert/props/Color";
import type { AlertPadding } from "@/Components/Alert/props/Padding";
import type { AlertRounded } from "@/Components/Alert/props/Rounded";
import type { AlertShadow } from "@/Components/Alert/props/Shadow";
import type { MergeProps, UnionProps } from "@/Utils";

export interface AlertColorOverrides {}
export interface AlertShadowOverrides {}
export interface AlertPaddingOverrides {}
export interface AlertRoundedOverrides {}
export interface AlertVariantOverrides {}

export interface AlertProps {
  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: any;

  /**
   * The classes to apply to the alert.
   *
   * @default undefined
   */
  classes?: any;

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
  title?: string | undefined;

  /**
   * The variant of the alert.
   *
   * @default "flat"
   */
  variant?: UnionProps<"flat" | "solid" | "outline", AlertVariantOverrides>;
}
