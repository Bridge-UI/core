// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface ResizablePanelClasses {
  /**
   * Classes merged onto the panel root.
   */
  root?: string;
}

export interface ResizablePanelEmits {
  /**
   * Emitted when the panel size changes (percent of the group).
   */
  resize: [size: number];

  /**
   * Emitted when the panel collapses or expands (`v-model:collapsed`).
   */
  "update:collapsed": [collapsed: boolean];
}

/**
 * One panel inside `Resizable`. Sizes are percentages of the group.
 */
export interface ResizablePanelOwnProps {
  /**
   * Classes for the panel.
   *
   * @default undefined
   */
  classes?: ResizablePanelClasses;

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

export interface ResizablePanelSlots {
  /**
   * Panel content.
   */
  default?: Slot<undefined>;
}

export type ResizablePanelProps = MergeHtmlProps<
  ResizablePanelOwnProps,
  HTMLAttributes
> & {
  /**
   * Collapsed state, bound with `v-model:collapsed`. Needs `collapsible`.
   */
  collapsed?: boolean;
};
