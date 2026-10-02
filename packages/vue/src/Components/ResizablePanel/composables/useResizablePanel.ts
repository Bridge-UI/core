// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  watch,
  type Ref,
  type SetupContext,
} from "vue";

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
import { RESIZABLE_INJECTION_KEY } from "@/Components/Resizable/resizableInjectionKey";
import type {
  ResizablePanelEmits,
  ResizablePanelOwnProps,
  ResizablePanelProps,
} from "@/Components/ResizablePanel/resizablePanel.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const resizablePanelBridgeKeys = [
  "classes",
  "maxSize",
  "minSize",
  "collapsible",
  "defaultSize",
  "collapsedSize",
] as const satisfies readonly (keyof ResizablePanelOwnProps)[];

type ResizablePanelLibDefaults = LibDefaultsShape<
  ResizablePanelOwnProps,
  "maxSize" | "minSize" | "collapsible" | "collapsedSize"
>;

type ResizablePanelMerged = MergeLibDefaults<
  ResizablePanelOwnProps,
  ResizablePanelLibDefaults
>;

function cssStyle(value: unknown): Record<string, string> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, string>;
  }

  return {};
}

export function useResizablePanel(
  props: ResizablePanelOwnProps,
  libDefaults: ResizablePanelLibDefaults,
  model: Ref<boolean | undefined>,
  emit?: SetupContext<ResizablePanelEmits>["emit"],
) {
  const attrs = useAttrs();
  const panelUid = useId();
  const injected = inject(RESIZABLE_INJECTION_KEY, null);

  if (!injected) {
    throw new Error("ResizablePanel must be used within a Resizable");
  }

  const group = injected;
  const elementRef = ref<null | HTMLElement>(null);

  const split = computed(() => {
    return splitComponentProps<
      ResizablePanelProps,
      typeof resizablePanelBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: resizablePanelBridgeKeys,
    });
  });

  const { merged, entry: bridgePanel } = useBridgeUIComponent<
    ResizablePanelMerged,
    "ResizablePanel"
  >({
    libDefaults,
    componentName: "ResizablePanel",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgePanel,
    props: () => split.value.componentProps,
  });

  const elementId = computed(() => {
    const id = split.value.inheritedAttrs.id;

    return typeof id === "string" && id
      ? id
      : `${group.value.id}-panel${panelUid}`;
  });

  const constraints = computed<ResizablePanelConstraints>(() => {
    return {
      maxSize: merged.value.maxSize,
      minSize: merged.value.minSize,
      collapsible: merged.value.collapsible,
      defaultSize: merged.value.defaultSize,
      collapsedSize: merged.value.collapsedSize,
    };
  });

  let unregister: null | (() => void) = null;

  onMounted(() => {
    unregister = group.value.registerPanel(panelUid, () => ({
      collapsed: model.value,
      element: elementRef.value,
      elementId: elementId.value,
      constraints: constraints.value,
    }));
  });

  onBeforeUnmount(() => {
    unregister?.();
    unregister = null;
  });

  const size = computed(() => {
    return group.value.layout[panelUid];
  });

  const collapsed = computed(() => {
    return isResizablePanelCollapsed(constraints.value, size.value);
  });

  watch(size, (next, previous) => {
    if (
      next === undefined ||
      previous === undefined ||
      Math.abs(previous - next) < 1e-6
    ) {
      return;
    }

    emit?.("resize", next);

    const wasCollapsed = isResizablePanelCollapsed(constraints.value, previous);

    if (wasCollapsed !== collapsed.value) {
      model.value = collapsed.value;
    }
  });

  watch(model, (next) => {
    if (next === true) {
      group.value.collapsePanel(panelUid);
    } else if (next === false) {
      group.value.expandPanel(panelUid);
    }
  });

  const initialSize = computed(() => {
    if (model.value && merged.value.collapsible) {
      return merged.value.collapsedSize;
    }

    return merged.value.defaultSize;
  });

  const rootBind = computed(() => {
    const inherited = split.value.inheritedAttrs;

    return mergePartBind({}, omit(inherited, ["style"]), {
      id: elementId.value,
      "data-part": "panel",
      "data-orientation": group.value.orientation,
      "data-collapsed": collapsed.value ? "" : undefined,
      style: {
        ...getResizablePanelStyle(size.value ?? initialSize.value),
        ...cssStyle(inherited.style),
      },
      class: cn({
        [get(group.value.orientationItem, "panel") ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  return {
    size,
    rootBind,
    collapsed,
    elementRef,
    id: panelUid,
  };
}
