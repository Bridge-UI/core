// ** External Imports
import {
  clamp,
  isFinite,
  isNil,
  partition,
  range,
  round,
  sum,
  times,
} from "es-toolkit/compat";

/** Default step (percent) for an arrow key on a resizable handle. */
export const DEFAULT_RESIZABLE_KEYBOARD_STEP = 10;

/** Tolerance used when comparing panel sizes. */
const SIZE_EPSILON = 1e-6;

/**
 * Size constraints for one panel, in percent of the group (`0`–`100`).
 */
export type ResizablePanelConstraints = {
  /**
   * Size while collapsed.
   */
  collapsedSize?: number;

  /**
   * Whether the panel can collapse below `minSize`.
   */
  collapsible?: boolean;

  /**
   * Initial size. Panels without one share the space left.
   */
  defaultSize?: number;

  /**
   * Largest size.
   */
  maxSize?: number;

  /**
   * Smallest size while expanded.
   */
  minSize?: number;
};

/**
 * Panel constraints with every bound filled in and kept in order
 * (`collapsedSize` ≤ `minSize` ≤ `maxSize`).
 */
export type ResolvedResizablePanelConstraints = {
  /**
   * Size while collapsed.
   */
  collapsedSize: number;

  /**
   * Whether the panel can collapse below `minSize`.
   */
  collapsible: boolean;

  /**
   * Largest size.
   */
  maxSize: number;

  /**
   * Smallest size while expanded.
   */
  minSize: number;
};

/**
 * Inputs for moving a handle.
 */
export type ResizeResizableLayoutOptions = {
  /**
   * Distance in percent. Positive grows the panel before the handle.
   */
  delta: number;

  /**
   * 0-based handle index. Handle `0` sits between panels `0` and `1`.
   */
  handleIndex: number;

  /**
   * Current sizes, in percent.
   */
  layout: number[];

  /**
   * Constraints for each panel, in layout order.
   */
  panels: ResizablePanelConstraints[];
};

/**
 * Inputs for setting one panel to a size.
 */
export type ResizeResizablePanelOptions = {
  /**
   * 0-based panel index.
   */
  index: number;

  /**
   * Current sizes, in percent.
   */
  layout: number[];

  /**
   * Constraints for each panel, in layout order.
   */
  panels: ResizablePanelConstraints[];

  /**
   * Target size, in percent.
   */
  size: number;
};

/**
 * Inputs for a key press on a handle.
 */
export type GetResizableLayoutFromKeyOptions = {
  /**
   * Size `Enter` restores when it expands a collapsed panel.
   */
  expandedSize?: number;

  /**
   * 0-based handle index.
   */
  handleIndex: number;

  /**
   * `KeyboardEvent.key`.
   */
  key: string;

  /**
   * Current sizes, in percent.
   */
  layout: number[];

  /**
   * Group axis. Horizontal groups use left/right, vertical groups up/down.
   */
  orientation: "vertical" | "horizontal";

  /**
   * Constraints for each panel, in layout order.
   */
  panels: ResizablePanelConstraints[];

  /**
   * Flip the horizontal arrows for right-to-left.
   */
  rtl?: boolean;

  /**
   * Arrow key step, in percent.
   */
  step?: number;
};

/**
 * Inputs for turning a pointer move into a percent delta.
 */
export type GetResizablePointerDeltaOptions = {
  /**
   * Pointer position along the group axis, in px.
   */
  current: number;

  /**
   * Group axis.
   */
  orientation: "vertical" | "horizontal";

  /**
   * Flip the horizontal axis for right-to-left.
   */
  rtl?: boolean;

  /**
   * Group length along the axis, in px.
   */
  size: number;

  /**
   * Pointer position when the drag started, in px.
   */
  start: number;
};

/**
 * ARIA values for a handle. They describe the panel before it.
 */
export type ResizableHandleAria = {
  /**
   * Largest size of the panel before the handle (rounded percent).
   */
  "aria-valuemax": number;

  /**
   * Smallest size of the panel before the handle (rounded percent).
   */
  "aria-valuemin": number;

  /**
   * Current size of the panel before the handle (rounded percent).
   */
  "aria-valuenow": number;
};

/**
 * A panel or handle registered with a resizable group.
 */
export type ResizableItem = {
  /**
   * Unique id within the group.
   */
  id: string;

  /**
   * Item kind.
   */
  kind: "panel" | "handle";
};

function toFinite(value: unknown, fallback: number): number {
  return isFinite(value) ? value : fallback;
}

/**
 * Fills in missing bounds and keeps `collapsedSize` ≤ `minSize` ≤ `maxSize`
 * inside `0`–`100`.
 */
export function resolveResizablePanelConstraints(
  panel: ResizablePanelConstraints = {},
): ResolvedResizablePanelConstraints {
  const minSize = clamp(toFinite(panel.minSize, 0), 0, 100);
  const maxSize = clamp(toFinite(panel.maxSize, 100), minSize, 100);
  const collapsedSize = clamp(toFinite(panel.collapsedSize, 0), 0, minSize);

  return {
    maxSize,
    minSize,
    collapsedSize,
    collapsible: panel.collapsible === true,
  };
}

/**
 * Fits `size` into a panel's constraints. Below `minSize`, a collapsible
 * panel snaps to `collapsedSize` once `size` passes the halfway point.
 */
export function clampResizablePanelSize(
  panel: undefined | ResizablePanelConstraints,
  size: number,
): number {
  const { maxSize, minSize, collapsible, collapsedSize } =
    resolveResizablePanelConstraints(panel);
  const value = toFinite(size, minSize);

  if (collapsible && value < minSize) {
    const halfway = collapsedSize + (minSize - collapsedSize) / 2;

    return value < halfway ? collapsedSize : minSize;
  }

  return clamp(value, minSize, maxSize);
}

/**
 * Whether a collapsible panel sits at its `collapsedSize`.
 */
export function isResizablePanelCollapsed(
  panel: undefined | ResizablePanelConstraints,
  size: number | undefined,
): boolean {
  if (!isFinite(size)) {
    return false;
  }

  const { collapsible, collapsedSize } =
    resolveResizablePanelConstraints(panel);

  return collapsible && Math.abs(size - collapsedSize) < SIZE_EPSILON;
}

/**
 * Scales `sizes` to add up to 100 and fits each panel's constraints.
 * Space left over goes to the first panels that still have room.
 * Collapsed panels stay collapsed.
 */
export function fitResizableLayout(
  panels: ResizablePanelConstraints[],
  sizes: Array<number | undefined>,
): number[] {
  const count = panels.length;

  if (count === 0) {
    return [];
  }

  const raw = times(count, (index) => {
    return Math.max(0, toFinite(sizes[index], 0));
  });
  const total = sum(raw);
  const scaled =
    total > 0
      ? raw.map((size) => (size / total) * 100)
      : times(count, () => 100 / count);
  const next = scaled.map((size, index) => {
    return clampResizablePanelSize(panels[index], size);
  });

  let remaining = 100 - sum(next);

  for (const index of range(count)) {
    if (Math.abs(remaining) < SIZE_EPSILON) {
      break;
    }

    if (isResizablePanelCollapsed(panels[index], next[index])) {
      continue;
    }

    const { maxSize, minSize } = resolveResizablePanelConstraints(
      panels[index],
    );
    const current = next[index] ?? 0;
    const target = clamp(current + remaining, minSize, maxSize);

    remaining -= target - current;
    next[index] = target;
  }

  return next;
}

/**
 * Sizes for `panels`, in percent. Each panel takes its entry in `sizes`,
 * then `defaultSize`. Panels without either share the space left (an even
 * share when nothing is left). The result fits every constraint and adds
 * up to 100.
 */
export function resolveResizableLayout(
  panels: ResizablePanelConstraints[],
  sizes: Array<number | undefined> = [],
): number[] {
  const count = panels.length;

  if (count === 0) {
    return [];
  }

  const known = panels.map((panel, index) => {
    const size = sizes[index] ?? panel.defaultSize;

    return isFinite(size) && size >= 0 ? size : undefined;
  });
  const knownSizes = known.filter(isFinite);
  const unknownCount = count - knownSizes.length;
  const left = 100 - sum(knownSizes);
  const share = left > SIZE_EPSILON ? left / unknownCount : 100 / count;

  return fitResizableLayout(
    panels,
    known.map((size) => size ?? share),
  );
}

/**
 * Moves handle `handleIndex` by `delta` percent. The panel on the growing
 * side takes the space; the shrinking side gives it, starting next to the
 * handle and moving outward once a panel reaches its `minSize`.
 * A collapsible panel holds at `minSize` until the move passes its halfway
 * point, then collapses. Returns `layout` unchanged when the move does not fit.
 */
export function resizeResizableLayout(
  options: ResizeResizableLayoutOptions,
): number[] {
  const { delta, layout, panels, handleIndex } = options;
  const count = layout.length;

  if (
    !isFinite(delta) ||
    Math.abs(delta) < SIZE_EPSILON ||
    handleIndex < 0 ||
    handleIndex >= count - 1
  ) {
    return layout;
  }

  const growIndex = delta > 0 ? handleIndex : handleIndex + 1;
  const shrinkOrder =
    delta > 0 ? range(handleIndex + 1, count) : range(handleIndex, -1, -1);
  const growStart = layout[growIndex] ?? 0;
  const wanted =
    clampResizablePanelSize(panels[growIndex], growStart + Math.abs(delta)) -
    growStart;

  if (wanted < SIZE_EPSILON) {
    return layout;
  }

  const next = [...layout];
  let remaining = wanted;

  for (const index of shrinkOrder) {
    if (remaining < SIZE_EPSILON) {
      break;
    }

    const panel = panels[index];
    const start = layout[index] ?? 0;
    const requested = start - remaining;
    const size = Math.min(start, clampResizablePanelSize(panel, requested));

    next[index] = size;
    remaining -= start - size;

    if (
      panel?.collapsible &&
      requested < size &&
      !isResizablePanelCollapsed(panel, size)
    ) {
      break;
    }
  }

  const taken = wanted - remaining;

  if (taken < SIZE_EPSILON) {
    return layout;
  }

  const grown = clampResizablePanelSize(panels[growIndex], growStart + taken);

  if (Math.abs(grown - (growStart + taken)) > SIZE_EPSILON) {
    return layout;
  }

  next[growIndex] = grown;

  return next;
}

/**
 * Sets panel `index` to `size` through its nearest handle (the one after it,
 * or the one before for the last panel).
 */
export function resizeResizablePanel(
  options: ResizeResizablePanelOptions,
): number[] {
  const { size, index, layout, panels } = options;
  const count = layout.length;

  if (count < 2 || index < 0 || index >= count) {
    return layout;
  }

  const current = layout[index] ?? 0;
  const target = clampResizablePanelSize(panels[index], size);

  if (index < count - 1) {
    return resizeResizableLayout({
      layout,
      panels,
      handleIndex: index,
      delta: target - current,
    });
  }

  return resizeResizableLayout({
    layout,
    panels,
    handleIndex: index - 1,
    delta: current - target,
  });
}

/**
 * Next layout for a key press on a handle, or `null` when the key does not
 * resize. Arrows move by `step`; `Home` / `End` take the panel before the
 * handle to its smallest / largest size; `Enter` collapses or expands it.
 */
export function getResizableLayoutFromKey(
  options: GetResizableLayoutFromKeyOptions,
): null | number[] {
  const { key, layout, panels, handleIndex } = options;
  const step = Math.abs(
    toFinite(options.step, DEFAULT_RESIZABLE_KEYBOARD_STEP),
  );
  const panel = panels[handleIndex];
  const size = layout[handleIndex] ?? 0;
  const { maxSize, minSize, collapsible, collapsedSize } =
    resolveResizablePanelConstraints(panel);
  const vertical = options.orientation === "vertical";
  const flip = !vertical && options.rtl === true;
  const decreaseKey = vertical ? "ArrowUp" : flip ? "ArrowRight" : "ArrowLeft";
  const increaseKey = vertical
    ? "ArrowDown"
    : flip
      ? "ArrowLeft"
      : "ArrowRight";

  const collapsed = isResizablePanelCollapsed(panel, size);
  const expandedSize = clamp(
    toFinite(options.expandedSize, minSize),
    minSize,
    maxSize,
  );

  const deltaByKey: Record<string, null | number> = {
    [increaseKey]: step,
    End: maxSize - size,
    [decreaseKey]: -step,
    Home: (collapsible ? collapsedSize : minSize) - size,
    Enter: collapsible
      ? (collapsed ? expandedSize : collapsedSize) - size
      : null,
  };

  const delta = Object.hasOwn(deltaByKey, key) ? deltaByKey[key] : null;

  if (isNil(delta)) {
    return null;
  }

  return resizeResizableLayout({ delta, layout, panels, handleIndex });
}

/**
 * Pointer travel as a percent of the group. Horizontal right-to-left groups
 * flip the sign so a positive delta always grows the panel before the handle.
 */
export function getResizablePointerDelta(
  options: GetResizablePointerDeltaOptions,
): number {
  const { size, start, current } = options;

  if (!isFinite(size) || size <= 0) {
    return 0;
  }

  const delta = ((current - start) / size) * 100;

  if (options.rtl && options.orientation !== "vertical") {
    return -delta;
  }

  return delta;
}

/**
 * Flex style for a panel `size` (percent). Without a size the panel takes
 * an even share.
 */
export function getResizablePanelStyle(
  size: number | undefined,
): Record<string, string> {
  return {
    flex: `${round(isFinite(size) ? size : 1, 3)} 1 0px`,
  };
}

/**
 * Cursor shown while dragging a handle.
 */
export function getResizableCursor(
  orientation: "vertical" | "horizontal",
): "col-resize" | "row-resize" {
  return orientation === "vertical" ? "row-resize" : "col-resize";
}

/**
 * ARIA values for handle `handleIndex`, from the panel before it.
 */
export function getResizableHandleAria(
  layout: number[],
  panels: ResizablePanelConstraints[],
  handleIndex: number,
): ResizableHandleAria {
  const { maxSize, minSize, collapsible, collapsedSize } =
    resolveResizablePanelConstraints(panels[handleIndex]);

  return {
    "aria-valuemax": round(maxSize),
    "aria-valuenow": round(layout[handleIndex] ?? 0),
    "aria-valuemin": round(collapsible ? collapsedSize : minSize),
  };
}

/**
 * Sorts `items` by where their elements sit in the document. Items without
 * an element keep their relative order at the end.
 */
export function sortResizableItemsByDocumentOrder<T>(
  items: T[],
  getElement: (item: T) => null | Element | undefined,
): T[] {
  const [placed, missing] = partition(items, (item) => {
    return !isNil(getElement(item));
  });

  const sorted = placed.sort((left, right) => {
    const leftElement = getElement(left);
    const rightElement = getElement(right);

    if (!leftElement || !rightElement || leftElement === rightElement) {
      return 0;
    }

    const position = leftElement.compareDocumentPosition(rightElement);

    return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });

  return [...sorted, ...missing];
}

/**
 * Panel ids in order and, for each handle, the index of the panel before it
 * (`-1` before the first panel).
 */
export function getResizableItemIndexes(items: ResizableItem[]): {
  handleIndexes: Record<string, number>;
  panelIds: string[];
} {
  const panelIds: string[] = [];
  const handleIndexes: Record<string, number> = {};

  for (const item of items) {
    if (item.kind === "panel") {
      panelIds.push(item.id);
    } else {
      handleIndexes[item.id] = panelIds.length - 1;
    }
  }

  return { panelIds, handleIndexes };
}
