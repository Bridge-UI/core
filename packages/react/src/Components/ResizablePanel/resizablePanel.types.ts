// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface ResizablePanelCallbacks {
  /**
   * Called when the panel collapses (`true`) or expands (`false`).
   *
   * @default undefined
   */
  onCollapsedChange?: (collapsed: boolean) => void;

  /**
   * Called when the panel size changes (percent of the group).
   *
   * @default undefined
   */
  onResize?: (size: number) => void;
}

export interface ResizablePanelClasses {
  /**
   * Classes merged onto the panel root.
   */
  root?: string;
}

/**
 * One panel inside `Resizable`. Sizes are percentages of the group.
 */
export interface ResizablePanelOwnProps {
  /**
   * Panel content.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for the panel.
   *
   * @default undefined
   */
  classes?: ResizablePanelClasses;

  /**
   * Controlled collapsed state. Needs `collapsible`.
   *
   * @default undefined
   */
  collapsed?: boolean;

  /**
   * Size while collapsed, in percent.
   *
   * @default 0
   */
  collapsedSize?: number;

  /**
   * Let the panel collapse once it is dragged past half of `minSize`.
   *
   * @default false
   */
  collapsible?: boolean;

  /**
   * Initial size, in percent. Panels without one share the space left.
   *
   * @default undefined
   */
  defaultSize?: number;

  /**
   * Largest size, in percent.
   *
   * @default 100
   */
  maxSize?: number;

  /**
   * Smallest size while expanded, in percent.
   *
   * @default 0
   */
  minSize?: number;
}

export type ResizablePanelProps = MergeHtmlProps<
  ResizablePanelOwnProps & ResizablePanelCallbacks,
  HTMLAttributes<HTMLDivElement>
>;
