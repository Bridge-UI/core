// ** External Imports
import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";

// ** Core Imports
import type { ChipSize, MergeHtmlProps, MergeProps } from "@bridge-ui/core";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

export interface ChipSizeOverrides {}

export interface ChipClasses {
  /**
   * Classes merged onto the dismiss control.
   */
  clear?: string;

  /**
   * Classes merged onto the label.
   */
  label?: string;

  /**
   * Classes merged onto the root element.
   */
  root?: string;
}

export interface ChipCustomProps {
  /**
   * Props forwarded to the dismiss control.
   */
  clear?: HTMLAttributes<HTMLSpanElement>;

  /**
   * Props forwarded to the dismiss `Icon` (`icon` is set by the chip).
   */
  clearIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the label element.
   */
  label?: HTMLAttributes<HTMLSpanElement>;

  /**
   * Props forwarded to the root element.
   */
  root?: HTMLAttributes<HTMLSpanElement>;
}

export interface ChipOwnProps {
  /**
   * Classes for chip parts.
   *
   * @default undefined
   */
  classes?: ChipClasses;

  /**
   * Accessible name for the dismiss control.
   *
   * @default "Remove"
   */
  clearLabel?: string;

  /**
   * Extra props for internal parts (`root`, `label`, `clear`, …).
   *
   * @default undefined
   */
  customProps?: ChipCustomProps;

  /**
   * Whether the chip is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Shows a dismiss control that calls `onDismiss`.
   *
   * @default false
   */
  dismissible?: boolean;

  /**
   * Chip label text. Prefer `children` for custom content.
   *
   * @default undefined
   */
  label?: ReactNode;

  /**
   * Called when the dismiss control is activated.
   */
  onDismiss?: (event: MouseEvent | KeyboardEvent) => void;

  /**
   * Typography and padding scale, aligned with `FormField` / `Select`.
   *
   * @default "md"
   */
  size?: MergeProps<ChipSize, ChipSizeOverrides>;
}

export type ChipProps = MergeHtmlProps<
  ChipOwnProps,
  HTMLAttributes<HTMLSpanElement>
>;
