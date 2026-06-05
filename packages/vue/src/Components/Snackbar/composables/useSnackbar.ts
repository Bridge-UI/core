// ** External Imports
import { get, isNull, omit } from "es-toolkit/compat";
import type { LucideIcon } from "lucide-vue-next";
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
  cn,
  getSnackbarTransitionClass,
  hasSnackbarTransition,
  mergeBridgeUILayeredClasses,
  snackbarColorProps,
  snackbarTransitionProps,
  splitComponentProps,
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
  "dense",
  "title",
  "classes",
  "duration",
  "stackId",
  "teleportTo",
  "transition",
  "partsProps",
  "description",
  "closeButton",
  "progressbar",
] as const satisfies readonly (keyof SnackbarOwnProps)[];

type SnackbarLibDefaults = LibDefaultsShape<
  SnackbarOwnProps,
  | "color"
  | "transition"
  | "duration"
  | "closeButton"
  | "progressbar"
  | "teleportTo"
>;

type SnackbarMerged = MergeLibDefaults<SnackbarOwnProps, SnackbarLibDefaults>;

export type SnackbarOptions = {
  show?: Ref<boolean> | boolean;
  stackId?: string;
  onClose?: () => void;
  onShowChange?: (show: boolean) => void;
};

export function useSnackbar(
  props: SnackbarProps,
  libDefaults: SnackbarLibDefaults,
  options: SnackbarOptions = {},
) {
  const attrs = useAttrs();

  const rendered = ref(false);

  const transitionState = ref<"open" | "closed">("closed");

  const timerPaused = ref(false);

  const progressActive = ref(false);

  const timerRef = ref<ReturnType<typeof setTimeout> | null>(null);

  const remainingMsRef = ref(0);

  const timerStartedAtRef = ref(0);

  const { customProps, inheritedAttrs } = splitComponentProps<
    SnackbarProps,
    typeof snackbarBridgeKeys
  >({
    props: { ...props, ...attrs },
    bridgeKeys: snackbarBridgeKeys,
  });

  const { merged, entry: bridgeSnackbar } = useBridgeUIComponent<
    SnackbarMerged,
    "Snackbar"
  >({
    libDefaults,
    props: customProps,
    componentName: "Snackbar",
  });

  const partsProps = computed(() => merged.value.partsProps);

  const rootInheritedAttrs = computed(() => {
    return omit(inheritedAttrs, ["onShowChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeSnackbar,
    props: customProps,
  });

  const show = computed(() => {
    if (options.show !== undefined) {
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

  const resolvedIcon = computed(() => {
    if (isNull(merged.value.icon)) {
      return null;
    }

    if (merged.value.icon) {
      return merged.value.icon;
    }

    const themeIcon = get(colorClass.value, "icon") as LucideIcon | undefined;

    return themeIcon ?? get(snackbarDefaultIcons, merged.value.color);
  });

  const durationMs = computed(() => {
    return merged.value.duration === false ? 0 : (merged.value.duration ?? 0);
  });

  const showProgress = computed(() => {
    return (
      durationMs.value > 0 &&
      merged.value.progressbar !== false &&
      show.value &&
      rendered.value
    );
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

    options.onShowChange?.(next);
  }

  function finishLeave() {
    transitionState.value = "closed";
    clearDismissTimer();

    if (show.value) {
      setShow(false);
    } else {
      options.onShowChange?.(false);
    }

    rendered.value = false;
  }

  function startLeave() {
    clearDismissTimer();

    if (!transitionEnabled.value) {
      finishLeave();

      return;
    }

    transitionState.value = "closed";
  }

  function scheduleOpen() {
    if (!transitionEnabled.value) {
      transitionState.value = "open";

      return;
    }

    transitionState.value = "closed";

    nextTick(() => {
      transitionState.value = "open";
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
    timerPaused.value = true;
  }

  function resumeDismissTimer() {
    if (durationMs.value <= 0 || !timerPaused.value) {
      return;
    }

    timerPaused.value = false;
    startDismissTimer(Math.max(remainingMsRef.value, 0));
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

        return;
      }

      progressActive.value = false;

      nextTick(() => {
        progressActive.value = true;
      });
    },
    { immediate: true },
  );

  onBeforeUnmount(clearDismissTimer);

  const rootBind = computed(() => {
    return mergePartBind(
      partsProps.value?.root,
      {
        ...rootInheritedAttrs.value,
        role: rootInheritedAttrs.value.role ?? "status",
        "aria-live": rootInheritedAttrs.value["aria-live"] ?? "polite",
        "data-snackbar-part": "panel",
        "data-state": transitionState.value,
        onTransitionend: handlePanelTransitionEnd,
        onMouseenter: pauseDismissTimer,
        onMouseleave: resumeDismissTimer,
      },
      cn({
        "relative w-full max-w-sm overflow-hidden pointer-events-auto": true,
        "bg-white shadow-lg ring-1 ring-black/5 rounded-lg": true,
        "dark:bg-dark-800 dark:border dark:border-dark-700": true,
        [panelTransitionClass.value]: transitionEnabled.value,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    );
  });

  const iconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.icon,
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
      partsProps.value?.title,
      {},
      cn({
        "text-sm font-medium text-dark-900 dark:text-dark-400": true,
        [get(mergedClasses.value, "title") ?? ""]: true,
      }),
    );
  });

  const descriptionBind = computed(() => {
    return mergePartBind(
      partsProps.value?.description,
      {},
      cn({
        "mt-1 text-sm text-dark-500 dark:text-dark-500": true,
        [get(mergedClasses.value, "description") ?? ""]: true,
      }),
    );
  });

  const progressBind = computed(() => {
    return mergePartBind(
      partsProps.value?.progress,
      {},
      {
        class: cn({
          "absolute top-0 left-0 h-0.5 w-full rounded-full bg-dark-300 dark:bg-dark-600": true,
          [get(mergedClasses.value, "progress") ?? ""]: true,
        }),
        style: showProgress.value
          ? {
              transformOrigin: "left center",
              transform: progressActive.value ? "scaleX(0)" : "scaleX(1)",
              transition:
                progressActive.value && !timerPaused.value
                  ? `transform ${durationMs.value}ms linear`
                  : "none",
            }
          : undefined,
      },
    );
  });

  return {
    merged,
    rendered,
    rootBind,
    iconBind,
    titleBind,
    descriptionBind,
    progressBind,
    resolvedIcon,
    requestClose,
  };
}
