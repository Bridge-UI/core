// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useEffect, useId, useLayoutEffect, useMemo, useRef } from "react";

// ** Core Imports
import {
  getResizablePanelStyle,
  isResizablePanelCollapsed,
  type ResizablePanelConstraints,
} from "@bridge-ui/core/Domain";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import {
  useResizableContext,
  type ResizablePanelEntry,
} from "@/Components/Resizable/ResizableContext";
import type {
  ResizablePanelOwnProps,
  ResizablePanelProps,
} from "@/Components/ResizablePanel/resizablePanel.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const resizablePanelBridgeKeys = [
  "classes",
  "maxSize",
  "minSize",
  "children",
  "onResize",
  "collapsed",
  "collapsible",
  "defaultSize",
  "collapsedSize",
  "onCollapsedChange",
] as const satisfies readonly (
  "onResize" | "onCollapsedChange" | keyof ResizablePanelOwnProps
)[];

type ResizablePanelLibDefaults = LibDefaultsShape<
  ResizablePanelOwnProps,
  "maxSize" | "minSize" | "collapsible" | "collapsedSize"
>;

type ResizablePanelMerged = MergeLibDefaults<
  ResizablePanelOwnProps,
  ResizablePanelLibDefaults
> &
  Pick<ResizablePanelProps, "onResize" | "onCollapsedChange">;

export function useResizablePanel(
  props: ResizablePanelProps,
  libDefaults: ResizablePanelLibDefaults,
) {
  const panelUid = useId();
  const group = useResizableContext();

  const elementRef = useRef<HTMLDivElement>(null);
  const previousSizeRef = useRef<number | undefined>(undefined);
  const syncedCollapsedRef = useRef(props.collapsed);

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ResizablePanelProps,
    typeof resizablePanelBridgeKeys
  >({
    props,
    bridgeKeys: resizablePanelBridgeKeys,
  });

  const { merged, entry: bridgePanel } = useBridgeUIComponent<
    ResizablePanelMerged,
    "ResizablePanel"
  >({
    libDefaults,
    props: componentProps,
    componentName: "ResizablePanel",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgePanel,
    props: componentProps,
  });

  const children = derived(() => {
    return props.children;
  });

  const elementId = derived(() => {
    return (
      inheritedAttrs.id ?? `${group.id}-panel${panelUid.replace(/:/g, "")}`
    );
  });

  const constraints = useMemo<ResizablePanelConstraints>(() => {
    return {
      maxSize: merged.maxSize,
      minSize: merged.minSize,
      collapsible: merged.collapsible,
      defaultSize: merged.defaultSize,
      collapsedSize: merged.collapsedSize,
    };
  }, [
    merged.maxSize,
    merged.minSize,
    merged.collapsible,
    merged.defaultSize,
    merged.collapsedSize,
  ]);

  const entryRef = useRef<ResizablePanelEntry>({
    elementId,
    constraints,
    element: null,
    collapsed: props.collapsed,
  });

  useLayoutEffect(() => {
    entryRef.current = {
      elementId,
      constraints,
      collapsed: props.collapsed,
      element: elementRef.current,
    };
  });

  useLayoutEffect(() => {
    return group.registerPanel(panelUid, entryRef);
  }, [group.registerPanel, panelUid]);

  const size = derived(() => {
    return group.layout[panelUid];
  });

  const collapsed = derived(() => {
    return isResizablePanelCollapsed(constraints, size);
  });

  useEffect(() => {
    if (size === undefined) {
      return;
    }

    const previous = previousSizeRef.current;

    previousSizeRef.current = size;

    if (previous === undefined || Math.abs(previous - size) < 1e-6) {
      return;
    }

    merged.onResize?.(size);

    const wasCollapsed = isResizablePanelCollapsed(constraints, previous);

    if (wasCollapsed !== collapsed) {
      merged.onCollapsedChange?.(collapsed);
    }
  }, [size]);

  useEffect(() => {
    if (props.collapsed === syncedCollapsedRef.current) {
      return;
    }

    syncedCollapsedRef.current = props.collapsed;

    if (props.collapsed === true) {
      group.collapsePanel(panelUid);
    } else if (props.collapsed === false) {
      group.expandPanel(panelUid);
    }
  }, [props.collapsed, panelUid, group.expandPanel, group.collapsePanel]);

  const initialSize = derived(() => {
    if (props.collapsed && merged.collapsible) {
      return merged.collapsedSize;
    }

    return merged.defaultSize;
  });

  const rootBind = derived(() => {
    return mergePartBind({}, omit(inheritedAttrs, ["style"]), {
      id: elementId,
      "data-part": "panel",
      "data-orientation": group.orientation,
      "data-collapsed": collapsed ? "" : undefined,
      style: {
        ...getResizablePanelStyle(size ?? initialSize),
        ...inheritedAttrs.style,
      },
      className: cn({
        [get(group.orientationItem, "panel") ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  return {
    size,
    children,
    rootBind,
    collapsed,
    elementRef,
    id: panelUid,
  };
}
