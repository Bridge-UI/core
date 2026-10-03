// ** External Imports
import { get, isEqual } from "es-toolkit/compat";
import {
  computed,
  onScopeDispose,
  provide,
  ref,
  useAttrs,
  useId,
  watch,
  type SetupContext,
} from "vue";

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
  ResizableEmits,
  ResizableOwnProps,
  ResizableProps,
} from "@/Components/Resizable/resizable.types";
import {
  RESIZABLE_INJECTION_KEY,
  type ResizableContextValue,
  type ResizableHandleEntry,
  type ResizablePanelEntry,
} from "@/Components/Resizable/resizableInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const resizableBridgeKeys = [
  "classes",
  "disabled",
  "orientation",
  "keyboardStep",
] as const satisfies readonly (keyof ResizableOwnProps)[];

type ResizableLibDefaults = LibDefaultsShape<
  ResizableOwnProps,
  "disabled" | "orientation" | "keyboardStep"
>;

type ResizableMerged = MergeLibDefaults<
  ResizableOwnProps,
  ResizableLibDefaults
>;

function isRtl(element: null | HTMLElement): boolean {
  return element ? getComputedStyle(element).direction === "rtl" : false;
}

export function useResizable(
  props: ResizableOwnProps,
  libDefaults: ResizableLibDefaults,
  emit?: SetupContext<ResizableEmits>["emit"],
) {
  const attrs = useAttrs();
  const vueId = useId();
  const groupId = `bridge-resizable${vueId}`;

  const rootRef = ref<null | HTMLElement>(null);
  const items = ref<ResizableItem[]>([]);
  const layout = ref<Record<string, number>>({});
  const draggingHandleId = ref<null | string>(null);

  const panels = new Map<string, () => ResizablePanelEntry>();
  const handles = new Map<string, () => ResizableHandleEntry>();
  const expanded: Record<string, number> = {};

  let stopDrag: null | (() => void) = null;

  const split = computed(() => {
    return splitComponentProps<ResizableProps, typeof resizableBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: resizableBridgeKeys,
    });
  });

  const { merged, entry: bridgeResizable } = useBridgeUIComponent<
    ResizableMerged,
    "Resizable"
  >({
    libDefaults,
    componentName: "Resizable",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeResizable,
    props: () => split.value.componentProps,
  });

  const orientationClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeResizable.value?.tokens?.orientation,
    );
  });

  const orientation = computed(() => {
    return merged.value.orientation === "vertical" ? "vertical" : "horizontal";
  });

  const orientationItem = computed(() => {
    return get(orientationClasses.value, orientation.value);
  });

  const indexes = computed(() => {
    return getResizableItemIndexes(items.value);
  });

  const panelIds = computed(() => {
    return indexes.value.panelIds;
  });

  function syncItems() {
    const entries = [
      ...Array.from(panels, ([id, entry]) => ({
        id,
        kind: "panel" as const,
        element: entry().element,
      })),
      ...Array.from(handles, ([id, entry]) => ({
        id,
        kind: "handle" as const,
        element: entry().element,
      })),
    ];

    const next = sortResizableItemsByDocumentOrder(entries, (item) => {
      return item.element;
    }).map(({ id, kind }) => ({ id, kind }));

    if (!isEqual(items.value, next)) {
      items.value = next;
    }
  }

  function registerPanel(id: string, entry: () => ResizablePanelEntry) {
    panels.set(id, entry);
    syncItems();

    return () => {
      panels.delete(id);
      syncItems();
    };
  }

  function registerHandle(id: string, entry: () => ResizableHandleEntry) {
    handles.set(id, entry);
    syncItems();

    return () => {
      handles.delete(id);
      syncItems();
    };
  }

  function getConstraints(ids: string[]) {
    return ids.map((id): ResizablePanelConstraints => {
      return panels.get(id)?.().constraints ?? {};
    });
  }

  function getSizes(ids: string[]) {
    return ids.map((id) => layout.value[id] ?? 0);
  }

  watch(panelIds, (ids) => {
    const constraints = ids.map((id): ResizablePanelConstraints => {
      const entry = panels.get(id)?.();
      const panel = entry?.constraints ?? {};

      if (entry?.collapsed && panel.collapsible) {
        return { ...panel, defaultSize: panel.collapsedSize ?? 0 };
      }

      return panel;
    });

    const sizes = resolveResizableLayout(
      constraints,
      ids.map((id) => layout.value[id]),
    );

    const next = Object.fromEntries(
      ids.map((id, index) => [id, sizes[index] ?? 0]),
    );

    if (!isEqual(layout.value, next)) {
      layout.value = next;
    }
  });

  function commitSizes(sizes: number[], origin?: number[]) {
    const ids = panelIds.value;
    const previous = layout.value;
    const constraints = getConstraints(ids);

    let changed = false;

    ids.forEach((id, index) => {
      const before = previous[id];
      const after = sizes[index] ?? 0;
      const from = origin?.[index] ?? before;

      if (before === undefined || Math.abs(before - after) > 1e-6) {
        changed = true;
      }

      if (
        from !== undefined &&
        !isResizablePanelCollapsed(constraints[index], from) &&
        isResizablePanelCollapsed(constraints[index], after)
      ) {
        expanded[id] = from;
      }
    });

    if (!changed) {
      return;
    }

    layout.value = Object.fromEntries(
      ids.map((id, index) => [id, sizes[index] ?? 0]),
    );

    emit?.("layoutChange", sizes);
  }

  function getHandleIndex(id: string) {
    const index = indexes.value.handleIndexes[id];

    if (
      index === undefined ||
      index < 0 ||
      index >= panelIds.value.length - 1
    ) {
      return null;
    }

    return index;
  }

  function startDrag(id: string, point: { clientX: number; clientY: number }) {
    const root = rootRef.value;
    const handleIndex = getHandleIndex(id);

    if (!root || handleIndex === null) {
      return;
    }

    stopDrag?.();

    const ids = panelIds.value;
    const axis = orientation.value;
    const vertical = axis === "vertical";
    const rect = root.getBoundingClientRect();
    const rtl = isRtl(root);
    const origin = getSizes(ids);
    const constraints = getConstraints(ids);
    const start = vertical ? point.clientY : point.clientX;
    const size = vertical ? rect.height : rect.width;
    const body = document.body;
    const previousCursor = body.style.cursor;
    const previousUserSelect = body.style.userSelect;

    body.style.userSelect = "none";
    body.style.cursor = getResizableCursor(axis);
    draggingHandleId.value = id;

    const onMove = (event: PointerEvent) => {
      const delta = getResizablePointerDelta({
        rtl,
        size,
        start,
        orientation: axis,
        current: vertical ? event.clientY : event.clientX,
      });

      commitSizes(
        resizeResizableLayout({
          delta,
          handleIndex,
          layout: origin,
          panels: constraints,
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
      stopDrag = null;
      draggingHandleId.value = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    stopDrag = stop;
  }

  onScopeDispose(() => {
    stopDrag?.();
  });

  function resizeFromKey(id: string, key: string) {
    const handleIndex = getHandleIndex(id);

    if (handleIndex === null) {
      return false;
    }

    const ids = panelIds.value;
    const panelId = ids[handleIndex] ?? "";

    const next = getResizableLayoutFromKey({
      key,
      handleIndex,
      layout: getSizes(ids),
      rtl: isRtl(rootRef.value),
      panels: getConstraints(ids),
      orientation: orientation.value,
      expandedSize: expanded[panelId],
      step: merged.value.keyboardStep,
    });

    if (!next) {
      return false;
    }

    commitSizes(next);

    return true;
  }

  function collapsePanel(id: string) {
    const ids = panelIds.value;
    const index = ids.indexOf(id);
    const constraints = getConstraints(ids);
    const panel = constraints[index];

    if (index < 0 || !panel?.collapsible) {
      return;
    }

    const sizes = getSizes(ids);

    if (isResizablePanelCollapsed(panel, sizes[index])) {
      return;
    }

    commitSizes(
      resizeResizablePanel({
        index,
        layout: sizes,
        panels: constraints,
        size: resolveResizablePanelConstraints(panel).collapsedSize,
      }),
    );
  }

  function expandPanel(id: string) {
    const ids = panelIds.value;
    const index = ids.indexOf(id);
    const constraints = getConstraints(ids);
    const panel = constraints[index];
    const sizes = getSizes(ids);

    if (index < 0 || !isResizablePanelCollapsed(panel, sizes[index])) {
      return;
    }

    const { minSize } = resolveResizablePanelConstraints(panel);
    const target =
      expanded[id] ?? panel?.defaultSize ?? 100 / Math.max(ids.length, 1);

    commitSizes(
      resizeResizablePanel({
        index,
        layout: sizes,
        panels: constraints,
        size: Math.max(minSize, target),
      }),
    );
  }

  function getHandleState(id: string) {
    const index = getHandleIndex(id);

    if (index === null) {
      return null;
    }

    const ids = panelIds.value;
    const panelId = ids[index] ?? "";

    return {
      index,
      controls: panels.get(panelId)?.().elementId,
      aria: getResizableHandleAria(getSizes(ids), getConstraints(ids), index),
    };
  }

  const contextValue = computed<ResizableContextValue>(() => {
    return {
      startDrag,
      expandPanel,
      id: groupId,
      collapsePanel,
      registerPanel,
      resizeFromKey,
      getHandleState,
      registerHandle,
      layout: layout.value,
      orientation: orientation.value,
      orientationItem: orientationItem.value,
      draggingHandleId: draggingHandleId.value,
      disabled: merged.value.disabled === true,
    };
  });

  provide(RESIZABLE_INJECTION_KEY, contextValue);

  const rootBind = computed(() => {
    return mergePartBind({}, split.value.inheritedAttrs, {
      id: groupId,
      "data-orientation": orientation.value,
      "data-dragging": draggingHandleId.value ? "" : undefined,
      class: cn({
        [get(orientationItem.value, "root") ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  const dragging = computed(() => {
    return draggingHandleId.value !== null;
  });

  return {
    layout,
    rootRef,
    dragging,
    panelIds,
    rootBind,
    orientation,
  };
}
