// ** External Imports
import type { ComputedRef, InjectionKey } from "vue";

// ** Core Imports
import type {
  ResizableHandleAria,
  ResizablePanelConstraints,
} from "@bridge-ui/core/Domain";
import type { ResizableOrientationItem } from "@bridge-ui/core/Tokens";

/**
 * What a `ResizablePanel` shares with its group.
 */
export type ResizablePanelEntry = {
  /**
   * Bound `collapsed` model. A collapsed panel starts at `collapsedSize`.
   */
  collapsed: boolean | undefined;

  /**
   * Size constraints, in percent.
   */
  constraints: ResizablePanelConstraints;

  /**
   * Rendered panel element.
   */
  element: null | HTMLElement;

  /**
   * DOM id the handles point to with `aria-controls`.
   */
  elementId: string;
};

/**
 * What a `ResizableHandle` shares with its group.
 */
export type ResizableHandleEntry = {
  /**
   * Rendered handle element.
   */
  element: null | HTMLElement;
};

/**
 * Position and ARIA values for a handle.
 */
export type ResizableHandleState = {
  /**
   * ARIA values for the panel before the handle.
   */
  aria: ResizableHandleAria;

  /**
   * DOM id of the panel before the handle.
   */
  controls: string | undefined;

  /**
   * 0-based handle index.
   */
  index: number;
};

/**
 * Shared group state for `ResizablePanel` and `ResizableHandle` descendants.
 */
export type ResizableContextValue = {
  /**
   * Collapses a collapsible panel.
   */
  collapsePanel: (id: string) => void;

  /**
   * Group-level `disabled`.
   */
  disabled: boolean;

  /**
   * Id of the handle being dragged.
   */
  draggingHandleId: null | string;

  /**
   * Expands a collapsed panel to its last expanded size.
   */
  expandPanel: (id: string) => void;

  /**
   * Position and ARIA values for a handle, or `null` outside two panels.
   */
  getHandleState: (id: string) => null | ResizableHandleState;

  /**
   * Stable id prefix for panel elements.
   */
  id: string;

  /**
   * Panel sizes (percent) by panel id. Empty until panels register.
   */
  layout: Record<string, number>;

  /**
   * Group axis.
   */
  orientation: "vertical" | "horizontal";

  /**
   * Orientation class map.
   */
  orientationItem: undefined | ResizableOrientationItem;

  /**
   * Registers a handle and returns unregister. `entry` is read on demand.
   */
  registerHandle: (id: string, entry: () => ResizableHandleEntry) => () => void;

  /**
   * Registers a panel and returns unregister. `entry` is read on demand.
   */
  registerPanel: (id: string, entry: () => ResizablePanelEntry) => () => void;

  /**
   * Applies a key press on a handle. Returns whether the key resized.
   */
  resizeFromKey: (id: string, key: string) => boolean;

  /**
   * Starts dragging a handle from a pointer position.
   */
  startDrag: (id: string, point: { clientX: number; clientY: number }) => void;
};

export const RESIZABLE_INJECTION_KEY = Symbol(
  "bridge-resizable",
) as InjectionKey<ComputedRef<ResizableContextValue>>;
