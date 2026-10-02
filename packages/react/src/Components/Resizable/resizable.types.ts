// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { ResizableOrientation } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface ResizableCallbacks {
  /**
   * Called when a drag, key press, or collapse changes the panel sizes.
   * Sizes are percentages, in panel order.
   *
   * @default undefined
   */
  onLayoutChange?: (layout: number[]) => void;
}

export interface ResizableClasses {
  /**
   * Classes merged onto the group root.
   */
  root?: string;
}

/**
 * Group of panels the user can resize. Compose with `ResizablePanel` and
 * `ResizableHandle`.
 */
export interface ResizableOwnProps {
  /**
   * Panels and handles (`ResizablePanel`, `ResizableHandle`).
   *
   * @default undefined
   */
  children?: ReactNode;

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

export type ResizableProps = MergeHtmlProps<
  ResizableOwnProps & ResizableCallbacks,
  HTMLAttributes<HTMLDivElement>
>;
