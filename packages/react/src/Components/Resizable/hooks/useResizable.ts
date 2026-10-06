// ** External Imports
import { get, isEqual } from "es-toolkit/compat";
import type { RefObject } from "react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ** Core Imports
import {
  getResizableCursor,
  getResizableHandleAria,
  getResizableItemIndexes,
  getResizableLayoutFromKey,
  getResizablePointerDelta,
  isResizablePanelCollapsed,
  resizeResizableLayout,
  resizeResizablePanel,
  resolveResizableLayout,
  resolveResizablePanelConstraints,
  sortResizableItemsByDocumentOrder,
  type ResizableItem,
  type ResizablePanelConstraints,
} from "@bridge-ui/core/Domain";
import { resizableOrientationProps as orientationProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ResizableOwnProps,
  ResizableProps,
} from "@/Components/Resizable/resizable.types";
import type {
  ResizableContextValue,
  ResizableHandleEntry,
  ResizablePanelEntry,
} from "@/Components/Resizable/ResizableContext";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const resizableBridgeKeys = [
  "classes",
  "children",
  "disabled",
  "orientation",
  "keyboardStep",
  "onLayoutChange",
] as const satisfies readonly ("onLayoutChange" | keyof ResizableOwnProps)[];

type ResizableLibDefaults = LibDefaultsShape<
  ResizableOwnProps,
  "disabled" | "orientation" | "keyboardStep"
>;

type ResizableMerged = MergeLibDefaults<
  ResizableOwnProps,
  ResizableLibDefaults
> &
  Pick<ResizableProps, "onLayoutChange">;

function isRtl(element: null | HTMLElement): boolean {
  return element ? getComputedStyle(element).direction === "rtl" : false;
}

export function useResizable(
  props: ResizableProps,
  libDefaults: ResizableLibDefaults,
) {
  const reactId = useId();
  const groupId = `bridge-resizable${reactId.replace(/:/g, "")}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<Record<string, number>>({});
  const stopDragRef = useRef<null | (() => void)>(null);
  const layoutRef = useRef<Record<string, number>>({});
  const panelsRef = useRef(new Map<string, RefObject<ResizablePanelEntry>>());
  const handlesRef = useRef(new Map<string, RefObject<ResizableHandleEntry>>());

  const [items, setItems] = useState<ResizableItem[]>([]);
  const [layout, setLayout] = useState<Record<string, number>>({});
  const [draggingHandleId, setDraggingHandleId] = useState<null | string>(null);

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ResizableProps,
    typeof resizableBridgeKeys
  >({
    props,
    bridgeKeys: resizableBridgeKeys,
  });

  const { merged, entry: bridgeResizable } = useBridgeUIComponent<
    ResizableMerged,
    "Resizable"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Resizable",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgeResizable,
  });

  const orientationClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeResizable?.tokens?.orientation,
    );
  }, [bridgeResizable?.tokens?.orientation]);

  const orientation = derived(() => {
    return merged.orientation === "vertical" ? "vertical" : "horizontal";
  });

  const orientationItem = derived(() => {
    return get(orientationClasses, orientation);
  });

  const children = derived(() => {
    return props.children;
  });

  const { panelIds, handleIndexes } = useMemo(() => {
    return getResizableItemIndexes(items);
  }, [items]);

  const syncItems = useCallback(() => {
    const entries = [
      ...Array.from(panelsRef.current, ([id, entry]) => ({
        id,
        kind: "panel" as const,
        element: entry.current?.element,
      })),
      ...Array.from(handlesRef.current, ([id, entry]) => ({
        id,
        kind: "handle" as const,
        element: entry.current?.element,
      })),
    ];

    const next = sortResizableItemsByDocumentOrder(entries, (item) => {
      return item.element;
    }).map(({ id, kind }) => ({ id, kind }));

    setItems((current) => {
      return isEqual(current, next) ? current : next;
    });
  }, []);

  const registerPanel = useCallback(
    (id: string, entry: RefObject<ResizablePanelEntry>) => {
      panelsRef.current.set(id, entry);
      syncItems();

      return () => {
        panelsRef.current.delete(id);
        syncItems();
      };
    },
    [syncItems],
  );

  const registerHandle = useCallback(
    (id: string, entry: RefObject<ResizableHandleEntry>) => {
      handlesRef.current.set(id, entry);
      syncItems();

      return () => {
        handlesRef.current.delete(id);
        syncItems();
      };
    },
    [syncItems],
  );

  const getConstraints = useCallback((ids: string[]) => {
    return ids.map((id): ResizablePanelConstraints => {
      return panelsRef.current.get(id)?.current?.constraints ?? {};
    });
  }, []);

  const getSizes = useCallback((ids: string[]) => {
    return ids.map((id) => layoutRef.current[id] ?? 0);
  }, []);

  useLayoutEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useLayoutEffect(() => {
    setLayout((current) => {
      const panels = panelIds.map((id): ResizablePanelConstraints => {
        const entry = panelsRef.current.get(id)?.current;
        const constraints = entry?.constraints ?? {};

        if (entry?.collapsed && constraints.collapsible) {
          return {
            ...constraints,
            defaultSize: constraints.collapsedSize ?? 0,
          };
        }

        return constraints;
      });

      const sizes = resolveResizableLayout(
        panels,
        panelIds.map((id) => current[id]),
      );

      const next = Object.fromEntries(
        panelIds.map((id, index) => [id, sizes[index] ?? 0]),
      );

      if (isEqual(current, next)) {
        return current;
      }

      layoutRef.current = next;

      return next;
    });
  }, [panelIds]);

  const commitSizes = useCallback(
    (sizes: number[], origin?: number[]) => {
      const previous = layoutRef.current;
      const panels = getConstraints(panelIds);

      let changed = false;

      panelIds.forEach((id, index) => {
        const before = previous[id];
        const after = sizes[index] ?? 0;
        const from = origin?.[index] ?? before;

        if (before === undefined || Math.abs(before - after) > 1e-6) {
          changed = true;
        }

        if (
          from !== undefined &&
          !isResizablePanelCollapsed(panels[index], from) &&
          isResizablePanelCollapsed(panels[index], after)
        ) {
          expandedRef.current[id] = from;
        }
      });

      if (!changed) {
        return;
      }

      const next = Object.fromEntries(
        panelIds.map((id, index) => [id, sizes[index] ?? 0]),
      );

      layoutRef.current = next;
      setLayout(next);
      merged.onLayoutChange?.(sizes);
    },
    [panelIds, getConstraints, merged.onLayoutChange],
  );

  const getHandleIndex = useCallback(
    (id: string) => {
      const index = handleIndexes[id];

      if (index === undefined || index < 0 || index >= panelIds.length - 1) {
        return null;
      }

      return index;
    },
    [handleIndexes, panelIds.length],
  );

  const startDrag = useCallback(
    (id: string, point: { clientX: number; clientY: number }) => {
      const root = rootRef.current;
      const handleIndex = getHandleIndex(id);

      if (!root || handleIndex === null) {
        return;
      }

      stopDragRef.current?.();

      const vertical = orientation === "vertical";
      const rect = root.getBoundingClientRect();
      const rtl = isRtl(root);
      const origin = getSizes(panelIds);
      const panels = getConstraints(panelIds);
      const start = vertical ? point.clientY : point.clientX;
      const size = vertical ? rect.height : rect.width;
      const body = document.body;
      const previousCursor = body.style.cursor;
      const previousUserSelect = body.style.userSelect;

      body.style.userSelect = "none";
      body.style.cursor = getResizableCursor(orientation);
      setDraggingHandleId(id);

      const onMove = (event: PointerEvent) => {
        const delta = getResizablePointerDelta({
          rtl,
          size,
          start,
          orientation,
          current: vertical ? event.clientY : event.clientX,
        });

        commitSizes(
          resizeResizableLayout({
            delta,
            panels,
            handleIndex,
            layout: origin,
          }),
          origin,
        );
      };

      const stop = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", stop);
        window.removeEventListener("pointercancel", stop);
        body.style.cursor = previousCursor;
        body.style.userSelect = previousUserSelect;
        stopDragRef.current = null;
        setDraggingHandleId(null);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
      stopDragRef.current = stop;
    },
    [
      panelIds,
      getSizes,
      orientation,
      commitSizes,
      getHandleIndex,
      getConstraints,
    ],
  );

  useEffect(() => {
    return () => {
      stopDragRef.current?.();
    };
  }, []);

  const resizeFromKey = useCallback(
    (id: string, key: string) => {
      const handleIndex = getHandleIndex(id);

      if (handleIndex === null) {
        return false;
      }

      const panelId = panelIds[handleIndex] ?? "";

      const next = getResizableLayoutFromKey({
        key,
        orientation,
        handleIndex,
        step: merged.keyboardStep,
        layout: getSizes(panelIds),
        rtl: isRtl(rootRef.current),
        panels: getConstraints(panelIds),
        expandedSize: expandedRef.current[panelId],
      });

      if (!next) {
        return false;
      }

      commitSizes(next);

      return true;
    },
    [
      panelIds,
      getSizes,
      orientation,
      commitSizes,
      getHandleIndex,
      getConstraints,
      merged.keyboardStep,
    ],
  );

  const collapsePanel = useCallback(
    (id: string) => {
      const index = panelIds.indexOf(id);
      const panels = getConstraints(panelIds);
      const panel = panels[index];

      if (index < 0 || !panel?.collapsible) {
        return;
      }

      const sizes = getSizes(panelIds);

      if (isResizablePanelCollapsed(panel, sizes[index])) {
        return;
      }

      commitSizes(
        resizeResizablePanel({
          index,
          panels,
          layout: sizes,
          size: resolveResizablePanelConstraints(panel).collapsedSize,
        }),
      );
    },
    [panelIds, getSizes, commitSizes, getConstraints],
  );

  const expandPanel = useCallback(
    (id: string) => {
      const index = panelIds.indexOf(id);
      const panels = getConstraints(panelIds);
      const panel = panels[index];
      const sizes = getSizes(panelIds);

      if (index < 0 || !isResizablePanelCollapsed(panel, sizes[index])) {
        return;
      }

      const { minSize } = resolveResizablePanelConstraints(panel);
      const target =
        expandedRef.current[id] ??
        panel?.defaultSize ??
        100 / Math.max(panelIds.length, 1);

      commitSizes(
        resizeResizablePanel({
          index,
          panels,
          layout: sizes,
          size: Math.max(minSize, target),
        }),
      );
    },
    [panelIds, getSizes, commitSizes, getConstraints],
  );

  const getHandleState = useCallback(
    (id: string) => {
      const index = getHandleIndex(id);

      if (index === null) {
        return null;
      }

      const panelId = panelIds[index] ?? "";

      return {
        index,
        controls: panelsRef.current.get(panelId)?.current?.elementId,
        aria: getResizableHandleAria(
          panelIds.map((panel) => layout[panel] ?? 0),
          getConstraints(panelIds),
          index,
        ),
      };
    },
    [layout, panelIds, getHandleIndex, getConstraints],
  );

  const contextValue = useMemo<ResizableContextValue>(() => {
    return {
      layout,
      startDrag,
      orientation,
      expandPanel,
      id: groupId,
      collapsePanel,
      registerPanel,
      resizeFromKey,
      getHandleState,
      registerHandle,
      orientationItem,
      draggingHandleId,
      disabled: merged.disabled === true,
    };
  }, [
    layout,
    groupId,
    startDrag,
    expandPanel,
    orientation,
    collapsePanel,
    registerPanel,
    resizeFromKey,
    getHandleState,
    registerHandle,
    merged.disabled,
    orientationItem,
    draggingHandleId,
  ]);

  const rootBind = derived(() => {
    return mergePartBind({}, inheritedAttrs, {
      id: groupId,
      "data-orientation": orientation,
      "data-dragging": draggingHandleId ? "" : undefined,
      className: cn({
        [get(orientationItem, "root") ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  return {
    layout,
    rootRef,
    children,
    rootBind,
    panelIds,
    orientation,
    contextValue,
    dragging: draggingHandleId !== null,
  };
}
