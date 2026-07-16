// ** External Imports
import type { LucideIcon } from "@lucide/vue";
import { get, isNil, isNull, isObject, omit } from "es-toolkit/compat";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  toValue,
  useAttrs,
  watch,
  type Ref,
} from "vue";

// ** Core Imports
import {
  acquireLayerStackOrder,
  cn,
  getLayerStackEntry,
  getSnackbarTransitionClass,
  hasSnackbarTransition,
  LAYER_STACK_BASE_Z_INDEX,
  mergeBridgeUILayeredClasses,
  pushLayerStack,
  snackbarColorProps,
  snackbarPaddingProps,
  snackbarPositionProps,
  snackbarRoundedProps,
  snackbarTransitionProps,
  splitComponentProps,
  subscribeLayerStack,
  type LayerStackHandle,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type SnackbarTransition,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  SnackbarOwnProps,
  SnackbarProps,
} from "@/Components/Snackbar/snackbar.types";
import { snackbarDefaultIcons } from "@/Components/Snackbar/snackbarDefaultIcons";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const snackbarBridgeKeys = [
  "img",
  "icon",
  "color",
  "title",
  "classes",
  "padding",
  "rounded",
  "stackId",
  "duration",
  "position",
  "teleportTo",
  "transition",
  "closeButton",
  "customProps",
  "description",
  "progressbar",
] as const satisfies readonly (keyof SnackbarOwnProps)[];

type SnackbarLibDefaults = LibDefaultsShape<
  SnackbarOwnProps,
  | "color"
  | "padding"
  | "rounded"
  | "duration"
  | "position"
  | "teleportTo"
  | "transition"
  | "closeButton"
  | "progressbar"
>;

type SnackbarMerged = MergeLibDefaults<SnackbarOwnProps, SnackbarLibDefaults>;

export type SnackbarOptions = {
  /**
   * Called when the snackbar requests to close.
   */
  onClose?: () => void;

  /**
   * Called after the leave transition when `show` is already `false`.
   *
   * @internal Used by `BridgeSnackbarHost` to remove registry entries.
   */
  onLeaveComplete?: () => void;

  /**
   * Called when `show` should change (controlled state).
   */
  onShowChange?: (show: boolean) => void;

  /**
   * Whether the snackbar is visible.
   *
   * @default false
   */
  show?: boolean | Ref<boolean>;

  /**
   * Pre-assigned stack id (BridgeSnackbarHost).
   */
  stackId?: string;
};

export function useSnackbar(
  props: SnackbarProps,
  libDefaults: SnackbarLibDefaults,
  options: SnackbarOptions = {},
) {
  const attrs = useAttrs();

  const rendered = ref(false);

  const layerStackId = ref("");

  const progressScale = ref(1);

  const remainingMsRef = ref(0);

  const timerPaused = ref(false);

  const pendingLeave = ref(false);

  const timerStartedAtRef = ref(0);

  const progressActive = ref(false);

  const progressTransitionMsRef = ref(0);

  const stackZIndex = ref(LAYER_STACK_BASE_Z_INDEX);

  const transitionState = ref<"open" | "closed">("closed");

  const timerRef = ref<null | ReturnType<typeof setTimeout>>(null);

  let stackOrder: null | number = null;

  let stackHandle: null | LayerStackHandle = null;

  let unsubscribeLayerStack: null | (() => void) = null;

  const split = computed(() => {
    return splitComponentProps<SnackbarProps, typeof snackbarBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: snackbarBridgeKeys,
    });
  });

  const { merged, entry: bridgeSnackbar } = useBridgeUIComponent<
    SnackbarMerged,
    "Snackbar"
  >({
    libDefaults,
    componentName: "Snackbar",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => merged.value.customProps);

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["onShowChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeSnackbar,
    props: () => split.value.componentProps,
  });

  const show = computed(() => {
    if (!isNil(options.show)) {
      return toValue(options.show);
    }

    return false;
  });

  const effectiveTransition = computed((): keyof SnackbarTransition => {
    const value = merged.value.transition ?? "none";

    return value in snackbarTransitionProps ? value : "none";
  });

  const transitionEnabled = computed(() => {
    return hasSnackbarTransition(effectiveTransition.value);
  });

  const panelTransitionClass = computed(() => {
    return getSnackbarTransitionClass(effectiveTransition.value);
  });

  const colorClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      snackbarColorProps,
      bridgeSnackbar.value?.customProps?.color,
    );

    return get(classes, merged.value.color);
  });

  const paddingClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      snackbarPaddingProps,
      bridgeSnackbar.value?.customProps?.padding,
    );

    return get(classes, merged.value.padding);
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      snackbarRoundedProps,
      bridgeSnackbar.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const resolvedIcon = computed(() => {
    if (isNull(merged.value.icon)) {
      return null;
    }

    if (merged.value.icon) {
      return merged.value.icon;
    }

    const themeIcon = get(colorClass.value, "icon") as undefined | LucideIcon;

    return themeIcon ?? get(snackbarDefaultIcons, merged.value.color);
  });

  const durationMs = computed(() => {
    return merged.value.duration === false ? 0 : (merged.value.duration ?? 0);
  });

  const showProgress = computed(() => {
    return (
      show.value &&
      rendered.value &&
      durationMs.value > 0 &&
      merged.value.progressbar !== false
    );
  });

  const isPortaled = computed(() => merged.value.teleportTo !== false);

  const positionClass = computed(() => {
    if (!isPortaled.value) {
      return "";
    }

    const classes = mergeBridgeUILayeredClasses(
      snackbarPositionProps,
      bridgeSnackbar.value?.customProps?.position,
    );

    return get(classes, merged.value.position ?? "bottom-center");
  });

  function clearDismissTimer() {
    if (timerRef.value) {
      clearTimeout(timerRef.value);
      timerRef.value = null;
    }
  }

  function setShow(next: boolean) {
    if (!next) {
      options.onClose?.();
    }

    if (isObject(options.show) && "value" in options.show) {
      options.show.value = next;
    }

    options.onShowChange?.(next);
  }

  function finishLeave() {
    if (!pendingLeave.value) {
      return;
    }

    pendingLeave.value = false;
    transitionState.value = "closed";
    clearDismissTimer();

    if (show.value) {
      setShow(false);
    } else {
      options.onLeaveComplete?.();
    }

    rendered.value = false;
  }

  function startLeave() {
    clearDismissTimer();
    pendingLeave.value = true;

    if (!transitionEnabled.value) {
      finishLeave();

      return;
    }

    transitionState.value = "closed";
  }

  function scheduleOpen() {
    pendingLeave.value = false;

    if (!transitionEnabled.value) {
      transitionState.value = "open";

      return;
    }

    transitionState.value = "closed";

    void nextTick(() => {
      requestAnimationFrame(() => {
        transitionState.value = "open";
      });
    });
  }

  function requestClose() {
    if (!transitionEnabled.value) {
      setShow(false);

      return;
    }

    if (!rendered.value) {
      return;
    }

    startLeave();
  }

  function startDismissTimer(ms: number) {
    clearDismissTimer();
    remainingMsRef.value = ms;
    timerStartedAtRef.value = Date.now();
    progressTransitionMsRef.value = ms;

    timerRef.value = setTimeout(() => {
      requestClose();
    }, ms);
  }

  function pauseDismissTimer() {
    if (!timerRef.value || durationMs.value <= 0) {
      return;
    }

    clearDismissTimer();
    remainingMsRef.value -= Date.now() - timerStartedAtRef.value;
    progressScale.value = Math.max(remainingMsRef.value / durationMs.value, 0);
    progressActive.value = false;
    timerPaused.value = true;
  }

  function resumeDismissTimer() {
    if (durationMs.value <= 0 || !timerPaused.value) {
      return;
    }

    const remaining = Math.max(remainingMsRef.value, 0);

    timerPaused.value = false;
    progressActive.value = false;

    requestAnimationFrame(() => {
      progressActive.value = true;
    });

    startDismissTimer(remaining);
  }

  function handlePanelTransitionEnd(event: TransitionEvent) {
    if (!rendered.value || transitionState.value !== "closed") {
      return;
    }

    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.propertyName === "none" || event.elapsedTime === 0) {
      return;
    }

    finishLeave();
  }

  watch(
    show,
    (next) => {
      if (next) {
        rendered.value = true;
        scheduleOpen();

        return;
      }

      if (!rendered.value) {
        return;
      }

      startLeave();
    },
    { immediate: true },
  );

  watch(
    [show, rendered, durationMs],
    ([visible, mounted, duration]) => {
      if (!visible || !mounted || duration <= 0) {
        clearDismissTimer();

        return;
      }

      timerPaused.value = false;
      startDismissTimer(duration);
    },
    { immediate: true },
  );

  watch(
    [showProgress, durationMs],
    ([visible]) => {
      if (!visible) {
        progressActive.value = false;
        progressScale.value = 1;

        return;
      }

      progressActive.value = false;
      progressScale.value = 1;

      const frame = requestAnimationFrame(() => {
        progressActive.value = true;
      });

      return () => {
        cancelAnimationFrame(frame);
      };
    },
    { immediate: true },
  );

  function syncZIndex() {
    const snapshot = getLayerStackEntry(layerStackId.value);

    if (snapshot) {
      stackZIndex.value = snapshot.zIndex;
    }
  }

  watch(
    [rendered, isPortaled],
    ([isRendered, portaled]) => {
      if (!portaled) {
        return;
      }

      if (isRendered) {
        stackOrder = acquireLayerStackOrder();

        stackHandle = pushLayerStack({
          order: stackOrder,
          lockScroll: false,
          id: options.stackId,
          onEscape: () => {
            requestClose();
          },
        });

        layerStackId.value = stackHandle.id;
        stackZIndex.value = stackHandle.zIndex;
        syncZIndex();
        unsubscribeLayerStack = subscribeLayerStack(syncZIndex);
      } else {
        unsubscribeLayerStack?.();
        unsubscribeLayerStack = null;
        stackHandle?.release();
        stackHandle = null;
        stackOrder = null;
        layerStackId.value = "";
        stackZIndex.value = LAYER_STACK_BASE_Z_INDEX;
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    clearDismissTimer();
    unsubscribeLayerStack?.();
    unsubscribeLayerStack = null;
    stackHandle?.release();
    stackHandle = null;
  });

  const portalBind = computed(() => {
    return mergePartBind(
      customProps.value?.portal,
      {
        "data-snackbar-layer": true,
        style: {
          zIndex: stackZIndex.value,
        },
      },
      cn({
        "fixed inset-0 flex pointer-events-none px-4 py-6 sm:p-5 sm:pt-4": true,
        [positionClass.value ?? ""]: true,
        [get(mergedClasses.value, "portal") ?? ""]: true,
      }),
    );
  });

  const panelBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      {
        ...rootInheritedAttrs.value,
        "data-snackbar-part": "panel",
        onMouseenter: pauseDismissTimer,
        onMouseleave: resumeDismissTimer,
        "data-state": transitionState.value,
        onTransitionend: handlePanelTransitionEnd,
        role: rootInheritedAttrs.value.role ?? "status",
        "aria-live": rootInheritedAttrs.value["aria-live"] ?? "polite",
      },
      cn({
        "relative w-full max-w-sm overflow-hidden pointer-events-auto": true,
        "bg-white shadow-lg ring-1 ring-black/5": true,
        "dark:bg-dark-800 dark:border dark:border-dark-700": true,
        [get(roundedClass.value, "base") ?? ""]: true,
        [panelTransitionClass.value]: transitionEnabled.value,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    );
  });

  const iconBind = computed(() => {
    return mergePartBind(
      customProps.value?.icon,
      {},
      cn({
        "w-6 h-6 shrink-0": true,
        [get(colorClass.value, "iconColor") ?? ""]: true,
        [get(mergedClasses.value, "icon") ?? ""]: true,
      }),
    );
  });

  const titleBind = computed(() => {
    return mergePartBind(
      customProps.value?.title,
      {},
      cn({
        "text-sm font-medium": true,
        [get(colorClass.value, "titleColor") ?? ""]: true,
        [get(mergedClasses.value, "title") ?? ""]: true,
      }),
    );
  });

  const descriptionBind = computed(() => {
    return mergePartBind(
      customProps.value?.description,
      {},
      cn({
        "mt-1 text-sm text-dark-500 dark:text-dark-500": true,
        [get(mergedClasses.value, "description") ?? ""]: true,
      }),
    );
  });

  const progressBind = computed(() => {
    return mergePartBind(
      customProps.value?.progress,
      {},
      {
        class: cn({
          "absolute bottom-0 left-0 h-0.5 w-full rounded-full": true,
          [get(colorClass.value, "progressColor") ?? ""]: true,
          [get(mergedClasses.value, "progress") ?? ""]: true,
        }),
        style: showProgress.value
          ? {
              transformOrigin: "left center",
              transform: `scaleX(${progressActive.value && !timerPaused.value ? 0 : progressScale.value})`,
              transition:
                progressActive.value && !timerPaused.value
                  ? `transform ${progressTransitionMsRef.value}ms linear`
                  : "none",
            }
          : undefined,
      },
    );
  });

  function contentBind(hasRight: boolean) {
    return mergePartBind(
      customProps.value?.content,
      {},
      cn({
        [get(paddingClass.value, "contentRight") ?? ""]: hasRight,
        [get(paddingClass.value, "content") ?? ""]: !hasRight,
        [get(mergedClasses.value, "content") ?? ""]: true,
      }),
    );
  }

  return {
    merged,
    iconBind,
    rendered,
    panelBind,
    titleBind,
    isPortaled,
    portalBind,
    contentBind,
    showProgress,
    progressBind,
    requestClose,
    resolvedIcon,
    descriptionBind,
  };
}
