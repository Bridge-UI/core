// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

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
  clear?: HTMLAttributes;

  /**
   * Props forwarded to the dismiss `Icon` (`icon` is set by the chip).
   */
  clearIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the label element.
   */
  label?: HTMLAttributes;

  /**
   * Props forwarded to the root element.
   */
  root?: HTMLAttributes;
}

export interface ChipEmits {
  /**
   * Emitted when the dismiss control is activated.
   */
  dismiss: [event: MouseEvent | KeyboardEvent];
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
   * Shows a dismiss control that emits `dismiss`.
   *
   * @default false
   */
  dismissible?: boolean;

  /**
   * Chip label text. Prefer the default slot for custom content.
   *
   * @default undefined
   */
  label?: string;

  /**
   * Typography and padding scale, aligned with `FormField` / `Select`.
   *
   * @default "md"
   */
  size?: MergeProps<ChipSize, ChipSizeOverrides>;
}

export interface ChipSlots {
  /**
   * Chip content. Falls back to `label` when omitted.
   */
  default?: Slot;
}

export type ChipProps = MergeHtmlProps<ChipOwnProps, HTMLAttributes>;
