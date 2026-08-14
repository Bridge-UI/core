// ** External Imports
import type { ButtonHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { IconProps } from "@/Components/Icon";

export interface ToggleClasses {
  /**
   * Classes merged onto the segment button.
   */
  root?: string;

  /**
   * Classes merged onto the start icon.
   */
  startIcon?: string;
}

export interface ToggleCustomProps {
  /**
   * Props forwarded to the segment button.
   */
  root?: ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Props forwarded to the start `Icon`.
   */
  startIcon?: Partial<Omit<IconProps, "icon">>;
}

/**
 * Toggle segment (`role="radio"`). Must be used inside `ToggleGroup`.
 */
export interface ToggleOwnProps {
  /**
   * The label content.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for toggle parts.
   *
   * @default undefined
   */
  classes?: ToggleClasses;

  /**
   * Props forwarded to each toggle part.
   *
   * @default undefined
   */
  customProps?: ToggleCustomProps;

  /**
   * Whether this segment is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon at the inline start.
   *
   * @default undefined
   */
  startIcon?: IconSource;

  /**
   * Value when this segment is selected.
   */
  value: string;
}

export type ToggleProps = MergeHtmlProps<
  ToggleOwnProps,
  ButtonHTMLAttributes<HTMLButtonElement>
>;
