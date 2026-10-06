// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { ResizableOrientation } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface ResizableClasses {
  /**
   * Classes merged onto the group root.
   */
  root?: string;
}

export interface ResizableEmits {
  /**
   * Emitted when a drag, key press, or collapse changes the panel sizes.
   * Sizes are percentages, in panel order.
   */
  layoutChange: [layout: number[]];
}

/**
 * Group of panels the user can resize. Compose with `ResizablePanel` and
 * `ResizableHandle`.
 */
export interface ResizableOwnProps {
  /**
   * Classes for the group root.
   *
   * @default undefined
   */
  classes?: ResizableClasses;

  /**
   * Lock every handle in the group.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Percent an arrow key moves a focused handle.
   *
   * @default 10
   */
  keyboardStep?: number;

  /**
   * Axis the panels are laid out on. Horizontal places panels side by side.
   *
   * @default "horizontal"
   */
  orientation?: keyof ResizableOrientation;
}

export interface ResizableSlots {
  /**
   * Panels and handles (`ResizablePanel`, `ResizableHandle`).
   */
  default?: Slot<undefined>;
}

export type ResizableProps = MergeHtmlProps<ResizableOwnProps, HTMLAttributes>;
