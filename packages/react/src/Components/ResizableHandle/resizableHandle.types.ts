// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface ResizableHandleClasses {
  /**
   * Classes merged onto the grip.
   */
  grip?: string;

  /**
   * Classes merged onto the handle root.
   */
  root?: string;
}

export interface ResizableHandleCustomProps {
  /**
   * Props forwarded to the grip.
   *
   * @default undefined
   */
  grip?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Drag handle between two `ResizablePanel`s. Focusable, with arrow keys,
 * `Home` / `End`, and `Enter` to collapse a collapsible panel.
 */
export interface ResizableHandleOwnProps {
  /**
   * Classes for handle parts.
   *
   * @default undefined
   */
  classes?: ResizableHandleClasses;

  /**
   * Extra props for internal parts (`grip`).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  customProps?: ResizableHandleCustomProps;

  /**
   * Lock this handle.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Hide the grip on the handle and show only the line.
   *
   * @default false
   */
  hideGrip?: boolean;

  /**
   * Custom grip content.
   *
   * @default undefined
   */
  slots?: ResizableHandleSlots;
}

export interface ResizableHandleSlots {
  /**
   * Content inside the grip.
   */
  grip?: ReactNode;
}

export type ResizableHandleProps = MergeHtmlProps<
  ResizableHandleOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
