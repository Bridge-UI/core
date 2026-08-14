// ** External Imports
import type { ButtonHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { IconProps } from "@/Components/Icon";

export interface ToggleItemClasses {
  /**
   * Classes merged onto the segment button.
   */
  root?: string;

  /**
   * Classes merged onto the start icon.
   */
  startIcon?: string;
}

export interface ToggleItemCustomProps {
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
 * Toggle group segment (`role="radio"`). Must be used inside `ToggleGroup`.
 */
export interface ToggleItemOwnProps {
  /**
   * The label content.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for toggle item parts.
   *
   * @default undefined
   */
  classes?: ToggleItemClasses;

  /**
   * Props forwarded to each toggle item part.
   *
   * @default undefined
   */
  customProps?: ToggleItemCustomProps;

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

export type ToggleItemProps = MergeHtmlProps<
  ToggleItemOwnProps,
  ButtonHTMLAttributes<HTMLButtonElement>
>;
