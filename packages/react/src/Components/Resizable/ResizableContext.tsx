// ** External Imports
import type { RefObject } from "react";
import { createContext, useContext } from "react";

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
   * Controlled `collapsed` prop. A collapsed panel starts at `collapsedSize`.
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
 * Shared group state for `ResizablePanel` and `ResizableHandle` children.
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
   * Registers a handle and returns unregister.
   */
  registerHandle: (
    id: string,
    entry: RefObject<ResizableHandleEntry>,
  ) => () => void;

  /**
   * Registers a panel and returns unregister.
   */
  registerPanel: (
    id: string,
    entry: RefObject<ResizablePanelEntry>,
  ) => () => void;

  /**
   * Applies a key press on a handle. Returns whether the key resized.
   */
  resizeFromKey: (id: string, key: string) => boolean;

  /**
   * Starts dragging a handle from a pointer position.
   */
  startDrag: (id: string, point: { clientX: number; clientY: number }) => void;
};

export const ResizableContext = createContext<null | ResizableContextValue>(
  null,
);

/**
 * Reads the nearest `Resizable` context. Throws when used outside `Resizable`.
 */
export function useResizableContext(): ResizableContextValue {
  const context = useContext(ResizableContext);

  if (!context) {
    throw new Error(
      "ResizablePanel and ResizableHandle must be used within a Resizable",
    );
  }

  return context;
}
