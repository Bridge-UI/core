// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface ResizableHandleClasses {
  /**
   * Classes merged onto the grip (`withHandle`).
   */
  grip?: string;

  /**
   * Classes merged onto the handle root.
   */
  root?: string;
}

export interface ResizableHandleCustomProps {
  /**
   * Props forwarded to the grip (`withHandle`).
   *
   * @default undefined
   */
  grip?: HTMLAttributes;
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
   * Show a visible grip on the handle.
   *
   * @default false
   */
  withHandle?: boolean;
}

export interface ResizableHandleSlots {
  /**
   * Content inside the grip (`withHandle`).
   */
  grip?: Slot<undefined>;
}

export type ResizableHandleProps = MergeHtmlProps<
  ResizableHandleOwnProps,
  HTMLAttributes
>;
