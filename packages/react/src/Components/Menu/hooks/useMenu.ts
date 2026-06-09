// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

// ** Core Imports
import {
  acquireLayerStackOrder,
  claimOpenMenu,
  cn,
  createFocusable,
  createPositionable,
  getLayerStackEntry,
  LAYER_STACK_BASE_Z_INDEX,
  mergeBridgeUILayeredClasses,
  pushLayerStack,
  splitComponentProps,
  subscribeLayerStack,
  type LayerStackHandle,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type PositionHandle,
} from "@bridge-ui/core";
import { roundedProps, shadowProps } from "@bridge-ui/core/Components/Menu";

// ** Local Imports
import type { MenuOwnProps, MenuProps } from "@/Components/Menu/menu.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const menuBridgeKeys = [
  "offset",
  "shadow",
  "rounded",
  "classes",
  "strategy",
  "placement",
  "partsProps",
  "persistent",
  "teleportTo",
  "keepMounted",
  "closeOnEscape",
  "closeOnClickAway",
  "disableAutoFocus",
  "disableScrollLock",
  "slots",
] as const satisfies readonly (keyof MenuOwnProps)[];

type MenuLibDefaults = LibDefaultsShape<
  MenuOwnProps,
  | "offset"
  | "shadow"
  | "rounded"
  | "strategy"
  | "placement"
  | "teleportTo"
  | "closeOnEscape"
  | "closeOnClickAway"
  | "disableScrollLock"
>;

type MenuMerged = MergeLibDefaults<MenuOwnProps, MenuLibDefaults>;

export type MenuOptions = {
  /**
   * Called when the menu requests to close.
   * Sugar for `onShowChange(false)`.
   */
  onClose?: () => void;

  /**
   * Called when `show` should change (controlled state).
   */
  onShowChange?: (show: boolean) => void;

  /**
   * Whether the menu is visible.
   *
   * @default false
   */
  show?: boolean;
};

export function useMenu(
  props: MenuProps,
  libDefaults: MenuLibDefaults,
  options: MenuOptions = {},
) {
  const { onClose, onShowChange, show = false } = options;

  const menuId = useId();

  const layerStackIdRef = useRef("");

  const [mounted, setMounted] = useState(show);

  const triggerRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const stackOrderRef = useRef<number | null>(null);

  const stackHandleRef = useRef<LayerStackHandle | null>(null);

  const positionHandleRef = useRef<PositionHandle | null>(null);

  const releaseOpenMenuClaimRef = useRef<(() => void) | null>(null);

  const allowReferenceHiddenCloseRef = useRef(false);

  const [stackZIndex, setStackZIndex] = useState(LAYER_STACK_BASE_Z_INDEX);

  const { customProps, inheritedAttrs } = splitComponentProps<
    MenuProps,
    typeof menuBridgeKeys
  >({
    props,
    bridgeKeys: menuBridgeKeys,
  });

  const { merged, entry: bridgeMenu } = useBridgeUIComponent<
    MenuMerged,
    "Menu"
  >({
    libDefaults,
    props: customProps,
    componentName: "Menu",
  });

  const partsProps = merged.partsProps;

  const slots = derived(() => {
    return props.slots;
  });

  const hasTrigger = derived(() => {
    return Boolean(props.slots?.trigger);
  });

  const children = derived(() => {
    return props.children;
  });

  const anchorEl = derived(() => {
    return props.anchorEl ?? null;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [
      "show",
      "onClose",
      "anchorEl",
      "children",
      "onShowChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeMenu,
    props: customProps,
  });

  const isHiddenWhileMounted = merged.keepMounted && !show;

  const isPortaled = merged.teleportTo !== false;

  if (show && stackOrderRef.current === null) {
    stackOrderRef.current = acquireLayerStackOrder();
  }

  if (!show && !mounted && stackOrderRef.current !== null) {
    stackOrderRef.current = null;
  }

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeMenu?.customProps?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeMenu?.customProps?.rounded]);

  const shadowClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      shadowProps,
      bridgeMenu?.customProps?.shadow,
    );

    return get(classes, merged.shadow);
  }, [merged.shadow, bridgeMenu?.customProps?.shadow]);

  function setShow(next: boolean) {
    if (!next) {
      onClose?.();
    }

    onShowChange?.(next);
  }

  function getReferenceElement(): HTMLElement | null {
    if (anchorEl instanceof HTMLElement) {
      return anchorEl;
    }

    if (anchorEl && "current" in anchorEl) {
      return anchorEl.current;
    }

    return triggerRef.current;
  }

  function focusReference() {
    const reference = getReferenceElement();

    if (reference instanceof HTMLElement) {
      reference.focus({ preventScroll: true });
    }
  }

  function isInsideReference(target: Node) {
    const reference = getReferenceElement();

    return reference?.contains(target) ?? false;
  }

  function isAnotherMenuOpener(target: Node) {
    if (!(target instanceof Element)) {
      return false;
    }

    if (isInsideReference(target)) {
      return false;
    }

    if (contentRef.current?.contains(target)) {
      return false;
    }

    return Boolean(
      target.closest('[aria-haspopup="menu"], button, [role="button"]'),
    );
  }

  function requestClose() {
    if (merged.persistent || !show) {
      return;
    }

    setShow(false);
  }

  function handleTriggerClick() {
    if (merged.persistent && show) {
      return;
    }

    setShow(!show);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      event.key !== "ArrowDown" &&
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    event.preventDefault();

    if (!show) {
      setShow(true);
    }
  }

  function handleContentKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const container = contentRef.current;

    if (!container) {
      return;
    }

    const focusable = createFocusable(container);

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        requestClose();
        focusReference();
        break;
      case "ArrowDown":
        event.preventDefault();
        focusable.next()?.focus({ preventScroll: true });
        break;
      case "ArrowUp":
        event.preventDefault();
        focusable.previous()?.focus({ preventScroll: true });
        break;
      case "Home":
        event.preventDefault();
        focusable.focusFirst();
        break;
      case "End":
        event.preventDefault();
        focusable.focusLast();
        break;
    }
  }

  function destroyPositionable() {
    allowReferenceHiddenCloseRef.current = false;
    positionHandleRef.current?.destroy();
    positionHandleRef.current = null;
  }

  function syncPositionable() {
    destroyPositionable();

    const reference = getReferenceElement();
    const floating = contentRef.current;

    if (!show || !reference || !floating) {
      return;
    }

    const handle = createPositionable({
      floating,
      reference,
      offset: merged.offset,
      strategy: merged.strategy,
      placement: merged.placement,
      onReferenceHidden: () => {
        if (
          !allowReferenceHiddenCloseRef.current ||
          merged.persistent ||
          !show
        ) {
          return;
        }

        requestClose();
      },
    });

    positionHandleRef.current = handle;
    handle.start();

    queueMicrotask(() => {
      allowReferenceHiddenCloseRef.current = true;
    });
  }

  useLayoutEffect(() => {
    if (show) {
      setMounted(true);

      let cancelled = false;

      queueMicrotask(() => {
        if (cancelled || !show) {
          return;
        }

        releaseOpenMenuClaimRef.current = claimOpenMenu({
          id: menuId,
          requestClose,
        });
      });

      return () => {
        cancelled = true;
      };
    }

    releaseOpenMenuClaimRef.current?.();
    releaseOpenMenuClaimRef.current = null;

    if (!merged.keepMounted) {
      setMounted(false);
    }
  }, [show, menuId, merged.keepMounted]);

  useLayoutEffect(() => {
    if (!show || !mounted) {
      destroyPositionable();

      return;
    }

    syncPositionable();

    return () => {
      destroyPositionable();
    };
  }, [
    show,
    mounted,
    anchorEl,
    merged.offset,
    merged.strategy,
    merged.placement,
    merged.persistent,
  ]);

  useLayoutEffect(() => {
    if (!show || merged.disableAutoFocus || !contentRef.current) {
      return;
    }

    createFocusable(contentRef.current).focusFirst();
  }, [show, merged.disableAutoFocus]);

  useLayoutEffect(() => {
    if (!show || stackOrderRef.current === null) {
      stackHandleRef.current?.release();
      stackHandleRef.current = null;
      setStackZIndex(LAYER_STACK_BASE_Z_INDEX);

      return;
    }

    function handleEscape() {
      if (!show || merged.closeOnEscape === false || merged.persistent) {
        return;
      }

      requestClose();
      focusReference();
    }

    const handle = pushLayerStack({
      onEscape: handleEscape,
      order: stackOrderRef.current,
      lockScroll: merged.disableScrollLock !== true,
    });

    stackHandleRef.current = handle;
    layerStackIdRef.current = handle.id;
    setStackZIndex((previous) => {
      return previous === handle.zIndex ? previous : handle.zIndex;
    });

    return () => {
      handle.release();
      stackHandleRef.current = null;
      layerStackIdRef.current = "";
    };
  }, [show, merged.persistent, merged.closeOnEscape, merged.disableScrollLock]);

  useEffect(() => {
    if (!show) {
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
  }, [show]);

  useEffect(() => {
    if (!show) {
      return;
    }

    let removePointerListener: (() => void) | null = null;

    const frameId = requestAnimationFrame(() => {
      function handlePointerDown(event: PointerEvent) {
        const target = event.target as Node;

        if (isInsideReference(target)) {
          return;
        }

        if (contentRef.current?.contains(target)) {
          return;
        }

        if (merged.closeOnClickAway === false || merged.persistent) {
          return;
        }

        if (isAnotherMenuOpener(target)) {
          return;
        }

        requestClose();
      }

      document.addEventListener("pointerdown", handlePointerDown, true);
      removePointerListener = () => {
        document.removeEventListener("pointerdown", handlePointerDown, true);
      };
    });

    return () => {
      cancelAnimationFrame(frameId);
      removePointerListener?.();
    };
  }, [show, anchorEl, merged.persistent, merged.closeOnClickAway]);

  const rootBind = mergePartBind(partsProps?.root, rootInheritedAttrs, {
    className: cn({
      "relative inline-block text-left": hasTrigger,
      [get(mergedClasses, "root") ?? ""]: true,
    }),
  });

  const triggerBind = mergePartBind(
    partsProps?.trigger,
    { ref: triggerRef },
    {
      tabIndex: 0,
      role: "button",
      "aria-expanded": show,
      onKeyDown: handleTriggerKeyDown,
      "aria-haspopup": "menu" as const,
      onClickCapture: handleTriggerClick,
      "aria-controls": show ? menuId : undefined,
      className: cn({
        "inline-block w-fit max-w-full cursor-pointer outline-hidden": true,
        [get(mergedClasses, "trigger") ?? ""]: true,
      }),
    },
  );

  const contentBind = mergePartBind(
    partsProps?.content,
    { ref: contentRef },
    {
      id: menuId,
      role: "menu",
      onKeyDown: handleContentKeyDown,
      style: {
        zIndex: stackZIndex,
      },
      "aria-hidden": isHiddenWhileMounted ? true : undefined,
      className: cn({
        "bg-white ring-1 ring-black/5 outline-hidden overflow-hidden min-w-32 w-max max-w-[calc(100vw-16px)]": true,
        "invisible pointer-events-none": isHiddenWhileMounted,
        [roundedClass ?? ""]: true,
        [shadowClass ?? ""]: true,
        [get(mergedClasses, "content") ?? ""]: true,
      }),
    },
  );

  return {
    slots,
    merged,
    menuId,
    mounted,
    children,
    rootBind,
    hasTrigger,
    isPortaled,
    triggerBind,
    contentBind,
  };
}
