// ** External Imports
import { get, isFunction, omit } from "es-toolkit/compat";
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
} from "vue";

// ** Core Imports
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { RESIZABLE_INJECTION_KEY } from "@/Components/Resizable/resizableInjectionKey";
import type {
  ResizableHandleOwnProps,
  ResizableHandleProps,
} from "@/Components/ResizableHandle/resizableHandle.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const resizableHandleBridgeKeys = [
  "classes",
  "disabled",
  "withHandle",
  "customProps",
] as const satisfies readonly (keyof ResizableHandleOwnProps)[];

type ResizableHandleLibDefaults = LibDefaultsShape<
  ResizableHandleOwnProps,
  "disabled" | "withHandle"
>;

type ResizableHandleMerged = MergeLibDefaults<
  ResizableHandleOwnProps,
  ResizableHandleLibDefaults
>;

const rootEventKeys = ["onKeydown", "onPointerdown"] as const;

function asListener<E extends Event>(
  value: unknown,
): undefined | ((event: E) => void) {
  return isFunction(value) ? (value as (event: E) => void) : undefined;
}

export function useResizableHandle(
  props: ResizableHandleOwnProps,
  libDefaults: ResizableHandleLibDefaults,
) {
  const attrs = useAttrs();
  const handleUid = useId();
  const resolveMessage = useResolveMessage();
  const injected = inject(RESIZABLE_INJECTION_KEY, null);

  if (!injected) {
    throw new Error("ResizableHandle must be used within a Resizable");
  }

  const group = injected;
  const elementRef = ref<null | HTMLElement>(null);

  const split = computed(() => {
    return splitComponentProps<
      ResizableHandleProps,
      typeof resizableHandleBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: resizableHandleBridgeKeys,
    });
  });

  const { merged, entry: bridgeHandle } = useBridgeUIComponent<
    ResizableHandleMerged,
    "ResizableHandle"
  >({
    libDefaults,
    componentName: "ResizableHandle",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeHandle,
    props: () => split.value.componentProps,
  });

  let unregister: null | (() => void) = null;

  onMounted(() => {
    unregister = group.value.registerHandle(handleUid, () => ({
      element: elementRef.value,
    }));
  });

  onBeforeUnmount(() => {
    unregister?.();
    unregister = null;
  });

  const state = computed(() => {
    return group.value.getHandleState(handleUid);
  });

  const disabled = computed(() => {
    return group.value.disabled || merged.value.disabled === true;
  });

  const dragging = computed(() => {
    return group.value.draggingHandleId === handleUid;
  });

  const showGrip = computed(() => {
    return merged.value.withHandle === true;
  });

  const index = computed(() => {
    return state.value?.index ?? -1;
  });

  const rootBind = computed(() => {
    const inherited = split.value.inheritedAttrs;
    const userKeydown = asListener<KeyboardEvent>(inherited.onKeydown);
    const userPointerdown = asListener<PointerEvent>(inherited.onPointerdown);
    const orientation = group.value.orientation;

    return mergePartBind({}, omit(inherited, [...rootEventKeys]), {
      ...state.value?.aria,
      "data-part": "handle",
      role: "separator" as const,
      "data-orientation": orientation,
      tabindex: disabled.value ? -1 : 0,
      "aria-controls": state.value?.controls,
      "aria-disabled": disabled.value || undefined,
      "aria-label": resolveMessage("Resize panels"),
      "data-dragging": dragging.value ? "" : undefined,
      "data-disabled": disabled.value ? "" : undefined,
      "aria-orientation":
        orientation === "vertical"
          ? ("horizontal" as const)
          : ("vertical" as const),
      class: cn({
        [get(group.value.orientationItem, "handle") ?? ""]: true,
        [get(group.value.orientationItem, "handleDisabled") ?? ""]:
          disabled.value,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
      onKeydown: (event: KeyboardEvent) => {
        userKeydown?.(event);

        if (disabled.value || event.defaultPrevented) {
          return;
        }

        if (group.value.resizeFromKey(handleUid, event.key)) {
          event.preventDefault();
        }
      },
      onPointerdown: (event: PointerEvent) => {
        userPointerdown?.(event);

        if (
          disabled.value ||
          event.defaultPrevented ||
          (event.pointerType === "mouse" && event.button !== 0)
        ) {
          return;
        }

        event.preventDefault();
        (event.currentTarget as null | HTMLElement)?.focus();
        group.value.startDrag(handleUid, event);
      },
    });
  });

  const gripBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.grip,
      {},
      {
        "aria-hidden": true,
        "data-part": "grip",
        class: cn({
          [get(group.value.orientationItem, "grip") ?? ""]: true,
          [get(mergedClasses.value, "grip") ?? ""]: true,
        }),
      },
    );
  });

  return {
    index,
    dragging,
    disabled,
    gripBind,
    rootBind,
    showGrip,
    elementRef,
    id: handleUid,
  };
}
