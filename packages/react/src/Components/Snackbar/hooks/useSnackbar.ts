// ** External Imports
import { get, isNull, omit } from "es-toolkit/compat";
import type { LucideIcon } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type TransitionEvent,
} from "react";

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
  snackbarPositionProps,
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
  derived,
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
  "slots",
  "classes",
  "duration",
  "position",
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
  | "position"
>;

type SnackbarMerged = MergeLibDefaults<SnackbarOwnProps, SnackbarLibDefaults>;

export type SnackbarOptions = {
  /**
   * Whether the snackbar is visible.
   *
   * @default false
   */
  show?: boolean;

  /**
   * Pre-assigned stack id (BridgeSnackbarHost).
   */
  stackId?: string;

  /**
   * Called when the snackbar requests to close.
   */
  onClose?: () => void;

  /**
   * Called when `show` should change (controlled state).
   */
  onShowChange?: (show: boolean) => void;
};

export function useSnackbar(
  props: SnackbarProps,
  libDefaults: SnackbarLibDefaults,
  options: SnackbarOptions = {},
) {
  const { onClose, onShowChange, show = false, stackId } = options;

  const [rendered, setRendered] = useState(false);

  const [transitionState, setTransitionState] = useState<"open" | "closed">(
    "closed",
  );

  const [timerPaused, setTimerPaused] = useState(false);

  const [progressActive, setProgressActive] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const remainingMsRef = useRef(0);

  const timerStartedAtRef = useRef(0);

  const layerStackIdRef = useRef("");

  const stackOrderRef = useRef<number | null>(null);

  const stackHandleRef = useRef<LayerStackHandle | null>(null);

  const [stackZIndex, setStackZIndex] = useState(LAYER_STACK_BASE_Z_INDEX);

  const { customProps, inheritedAttrs } = splitComponentProps<
    SnackbarProps,
    typeof snackbarBridgeKeys
  >({
    props,
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

  const partsProps = merged.partsProps;

  const rootInheritedAttrs = omit(inheritedAttrs, [
    "show",
    "onClose",
    "children",
    "onShowChange",
  ]);

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeSnackbar,
    props: customProps,
  });

  const effectiveTransition = useMemo((): keyof SnackbarTransition => {
    const value = merged.transition ?? "none";

    return value in snackbarTransitionProps ? value : "none";
  }, [merged.transition]);

  const transitionEnabled = hasSnackbarTransition(effectiveTransition);

  const panelTransitionClass = getSnackbarTransitionClass(effectiveTransition);

  const colorClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      snackbarColorProps,
      bridgeSnackbar?.customProps?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeSnackbar?.customProps?.color]);

  const resolvedIcon = useMemo(() => {
    if (isNull(merged.icon)) {
      return null;
    }

    if (merged.icon) {
      return merged.icon;
    }

    const themeIcon = get(colorClass, "icon") as LucideIcon | undefined;

    return themeIcon ?? get(snackbarDefaultIcons, merged.color);
  }, [merged.icon, merged.color, colorClass]);

  const durationMs = merged.duration === false ? 0 : (merged.duration ?? 0);

  const isPortaled = merged.teleportTo !== false;

  if (show && stackOrderRef.current === null && isPortaled) {
    stackOrderRef.current = acquireLayerStackOrder();
  }

  if (!show && !rendered && stackOrderRef.current !== null) {
    stackOrderRef.current = null;
  }

  const positionClass = useMemo(() => {
    if (!isPortaled) {
      return "";
    }

    const classes = mergeBridgeUILayeredClasses(
      snackbarPositionProps,
      bridgeSnackbar?.customProps?.position,
    );

    return get(classes, merged.position ?? "bottom-center");
  }, [isPortaled, merged.position, bridgeSnackbar?.customProps?.position]);

  const showProgress =
    durationMs > 0 && merged.progressbar !== false && show && rendered;

  function clearDismissTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function setShow(next: boolean) {
    if (!next) {
      onClose?.();
    }

    onShowChange?.(next);
  }

  function finishLeave() {
    setTransitionState("closed");
    clearDismissTimer();

    if (show) {
      setShow(false);
    } else {
      onShowChange?.(false);
    }

    setRendered(false);
  }

  function startLeave() {
    clearDismissTimer();

    if (!transitionEnabled) {
      finishLeave();

      return;
    }

    setTransitionState("closed");
  }

  function scheduleOpen() {
    if (!transitionEnabled) {
      setTransitionState("open");

      return;
    }

    setTransitionState("closed");

    requestAnimationFrame(() => {
      setTransitionState("open");
    });
  }

  function requestClose() {
    if (!transitionEnabled) {
      setShow(false);

      return;
    }

    if (!rendered) {
      return;
    }

    startLeave();
  }

  function startDismissTimer(ms: number) {
    clearDismissTimer();
    remainingMsRef.current = ms;
    timerStartedAtRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      requestClose();
    }, ms);
  }

  function pauseDismissTimer() {
    if (!timerRef.current || durationMs <= 0) {
      return;
    }

    clearDismissTimer();
    remainingMsRef.current -= Date.now() - timerStartedAtRef.current;
    setTimerPaused(true);
  }

  function resumeDismissTimer() {
    if (durationMs <= 0 || !timerPaused) {
      return;
    }

    setTimerPaused(false);
    startDismissTimer(Math.max(remainingMsRef.current, 0));
  }

  function handlePanelTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (!rendered || transitionState !== "closed") {
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

  useEffect(() => {
    if (show) {
      setRendered(true);
      scheduleOpen();

      return;
    }

    if (!rendered) {
      return;
    }

    startLeave();
  }, [show]);

  useEffect(() => {
    if (!show || !rendered || durationMs <= 0) {
      clearDismissTimer();

      return;
    }

    setTimerPaused(false);
    startDismissTimer(durationMs);

    return clearDismissTimer;
  }, [show, rendered, durationMs]);

  useEffect(() => {
    if (!showProgress) {
      setProgressActive(false);

      return;
    }

    setProgressActive(false);

    const frame = requestAnimationFrame(() => {
      setProgressActive(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [showProgress, durationMs]);

  useLayoutEffect(() => {
    if (!isPortaled || !rendered) {
      return;
    }

    const handle = pushLayerStack({
      id: stackId,
      order: stackOrderRef.current ?? undefined,
      lockScroll: false,
      onEscape: () => {
        requestClose();
      },
    });

    stackHandleRef.current = handle;
    layerStackIdRef.current = handle.id;
    setStackZIndex(handle.zIndex);

    return () => {
      handle.release();
      stackHandleRef.current = null;
      layerStackIdRef.current = "";
      setStackZIndex(LAYER_STACK_BASE_Z_INDEX);
    };
  }, [rendered, isPortaled, stackId]);

  useEffect(() => {
    if (!rendered || !isPortaled) {
      return;
    }

    function syncZIndex() {
      const snapshot = getLayerStackEntry(layerStackIdRef.current);

      if (!snapshot) {
        return;
      }

      setStackZIndex((previous) => {
        return previous === snapshot.zIndex ? previous : snapshot.zIndex;
      });
    }

    syncZIndex();

    return subscribeLayerStack(syncZIndex);
  }, [rendered, isPortaled]);

  const portalBind = mergePartBind(
    partsProps?.portal,
    {},
    {
      "data-snackbar-layer": true,
      className: cn({
        "fixed inset-0 flex pointer-events-none px-4 py-6 sm:p-5 sm:pt-4": true,
        [positionClass]: true,
        [get(mergedClasses, "portal") ?? ""]: true,
      }),
      style: {
        zIndex: stackZIndex,
      },
    },
  );

  const panelBind = mergePartBind(
    partsProps?.root,
    {
      ...rootInheritedAttrs,
      role: rootInheritedAttrs.role ?? "status",
      "aria-live": rootInheritedAttrs["aria-live"] ?? "polite",
      "data-snackbar-part": "panel",
      "data-state": transitionState,
      onTransitionEnd: handlePanelTransitionEnd,
      onMouseEnter: pauseDismissTimer,
      onMouseLeave: resumeDismissTimer,
    },
    cn({
      "relative w-full max-w-sm overflow-hidden pointer-events-auto": true,
      "bg-white shadow-lg ring-1 ring-black/5 rounded-lg": true,
      "dark:bg-dark-800 dark:border dark:border-dark-700": true,
      [panelTransitionClass]: transitionEnabled,
      [get(mergedClasses, "root") ?? ""]: true,
    }),
  );

  const iconBind = mergePartBind(
    partsProps?.icon,
    {},
    cn({
      "w-6 h-6 shrink-0": true,
      [get(colorClass, "iconColor") ?? ""]: true,
      [get(mergedClasses, "icon") ?? ""]: true,
    }),
  );

  const titleBind = mergePartBind(
    partsProps?.title,
    {},
    cn({
      "text-sm font-medium text-dark-900 dark:text-dark-400": true,
      [get(mergedClasses, "title") ?? ""]: true,
    }),
  );

  const descriptionBind = mergePartBind(
    partsProps?.description,
    {},
    cn({
      "mt-1 text-sm text-dark-500 dark:text-dark-500": true,
      [get(mergedClasses, "description") ?? ""]: true,
    }),
  );

  const progressBind = mergePartBind(
    partsProps?.progress,
    {},
    {
      className: cn({
        "absolute top-0 left-0 h-0.5 w-full rounded-full bg-dark-300 dark:bg-dark-600": true,
        [get(mergedClasses, "progress") ?? ""]: true,
      }),
      style: showProgress
        ? {
            transformOrigin: "left center",
            transform: progressActive ? "scaleX(0)" : "scaleX(1)",
            transition:
              progressActive && !timerPaused
                ? `transform ${durationMs}ms linear`
                : "none",
          }
        : undefined,
    },
  );

  return {
    merged,
    rendered,
    isPortaled,
    stackId,
    portalBind,
    panelBind,
    iconBind,
    titleBind,
    descriptionBind,
    progressBind,
    resolvedIcon,
    slots: derived(() => props.slots),
    children: derived(() => props.children),
    requestClose,
  };
}
