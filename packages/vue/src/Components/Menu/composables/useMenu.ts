// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  toValue,
  useAttrs,
  useId,
  watch,
  type ComponentPublicInstance,
  type Ref,
} from "vue";

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
   * Whether the menu is visible (`defineModel()` / `v-model`).
   *
   * @default false
   */
  show?: Ref<boolean>;
};

export function useMenu(
  props: MenuOwnProps,
  libDefaults: MenuLibDefaults,
  options: MenuOptions = {},
) {
  const attrs = useAttrs();

  const menuId = useId();

  const mounted = ref(false);

  const layerStackId = ref("");

  const triggerRef = ref<HTMLElement | null>(null);

  const contentRef = ref<HTMLElement | null>(null);

  let stackOrder: number | null = null;

  let stackHandle: LayerStackHandle | null = null;
  let unsubscribeLayerStack: (() => void) | null = null;
  let positionHandle: PositionHandle | null = null;
  let removePointerListener: (() => void) | null = null;
  let releaseOpenMenuClaim: (() => void) | null = null;
  let allowReferenceHiddenClose = false;

  const stackZIndex = ref(LAYER_STACK_BASE_Z_INDEX);

  const show = computed(() => {
    return toValue(options.show ?? false);
  });

  function setShow(next: boolean) {
    if (!next) {
      options.onClose?.();
    }

    if (options.show) {
      options.show.value = next;
    }

    options.onShowChange?.(next);
  }

  const split = computed(() => {
    return splitComponentProps<MenuProps, typeof menuBridgeKeys>({
      bridgeKeys: menuBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeMenu } = useBridgeUIComponent<
    MenuMerged,
    "Menu"
  >({
    libDefaults,
    componentName: "Menu",
    props: () => split.value.customProps,
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeMenu,
    props: () => split.value.customProps,
  });

  const isHiddenWhileMounted = computed(() => {
    return merged.value.keepMounted && !show.value;
  });

  const isPortaled = computed(() => {
    return merged.value.teleportTo !== false;
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeMenu.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const shadowClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      shadowProps,
      bridgeMenu.value?.customProps?.shadow,
    );

    return get(classes, merged.value.shadow);
  });

  const canClose = computed(() => {
    return !merged.value.persistent;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["anchorEl", "onShowChange"]);
  });

  function getReferenceElement(): HTMLElement | null {
    return props.anchorEl ?? triggerRef.value;
  }

  function focusReference() {
    getReferenceElement()?.focus({ preventScroll: true });
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

    if (contentRef.value?.contains(target)) {
      return false;
    }

    return Boolean(
      target.closest('[aria-haspopup="menu"], button, [role="button"]'),
    );
  }

  function requestClose() {
    if (!canClose.value || !show.value) {
      return;
    }

    setShow(false);
  }

  function handleTriggerClick() {
    if (merged.value.persistent && show.value) {
      return;
    }

    setShow(!show.value);
  }

  function handleTriggerKeyDown(event: KeyboardEvent) {
    if (
      event.key !== "ArrowDown" &&
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    event.preventDefault();

    if (!show.value) {
      setShow(true);
    }
  }

  function handleContentKeyDown(event: KeyboardEvent) {
    const container = contentRef.value;

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
    allowReferenceHiddenClose = false;
    positionHandle?.destroy();
    positionHandle = null;
  }

  function syncPositionable() {
    destroyPositionable();

    const reference = getReferenceElement();
    const floating = contentRef.value;

    if (!show.value || !reference || !floating) {
      return;
    }

    positionHandle = createPositionable({
      floating,
      reference,
      offset: merged.value.offset,
      strategy: merged.value.strategy,
      placement: merged.value.placement,
      onReferenceHidden: () => {
        if (!allowReferenceHiddenClose || !canClose.value || !show.value) {
          return;
        }

        requestClose();
      },
    });

    positionHandle.start();

    void nextTick(() => {
      allowReferenceHiddenClose = true;
    });
  }

  function syncAutoFocus() {
    if (!show.value || merged.value.disableAutoFocus || !contentRef.value) {
      return;
    }

    createFocusable(contentRef.value).focusFirst();
  }

  function attachPointerListener() {
    removePointerListener?.();

    if (!show.value) {
      removePointerListener = null;

      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (isInsideReference(target)) {
        return;
      }

      if (contentRef.value?.contains(target)) {
        return;
      }

      if (merged.value.closeOnClickAway === false || !canClose.value) {
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
  }

  function resolveHTMLElement(
    element: Element | ComponentPublicInstance | null,
  ): HTMLElement | null {
    if (element instanceof HTMLElement) {
      return element;
    }

    if (element && "$el" in element) {
      const el = element.$el;

      return el instanceof HTMLElement ? el : null;
    }

    return null;
  }

  function setTriggerRef(element: Element | ComponentPublicInstance | null) {
    const next = resolveHTMLElement(element);

    if (triggerRef.value === next) {
      return;
    }

    triggerRef.value = next;

    if (!next) {
      return;
    }

    void nextTick(() => {
      syncPositionable();
    });
  }

  function setContentRef(element: Element | ComponentPublicInstance | null) {
    const next = resolveHTMLElement(element);

    if (contentRef.value === next) {
      return;
    }

    contentRef.value = next;

    if (!next) {
      return;
    }

    void nextTick(() => {
      syncPositionable();
      syncAutoFocus();
    });
  }

  function handleEscape() {
    if (
      !show.value ||
      merged.value.closeOnEscape === false ||
      !canClose.value
    ) {
      return;
    }

    requestClose();
    focusReference();
  }

  function syncZIndex() {
    const snapshot = getLayerStackEntry(layerStackId.value);

    if (snapshot) {
      stackZIndex.value = snapshot.zIndex;
    }
  }

  function teardownOpenState() {
    releaseOpenMenuClaim?.();
    releaseOpenMenuClaim = null;
    removePointerListener?.();
    removePointerListener = null;
    unsubscribeLayerStack?.();
    unsubscribeLayerStack = null;
    stackHandle?.release();
    stackHandle = null;
    stackOrder = null;
    layerStackId.value = "";
    stackZIndex.value = LAYER_STACK_BASE_Z_INDEX;
    destroyPositionable();
  }

  const rootBind = computed(() => {
    return mergePartBind(partsProps.value?.root, rootInheritedAttrs.value, {
      class: cn({
        "relative inline-block text-left": true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  const triggerBind = computed(() => {
    return mergePartBind(
      partsProps.value?.trigger,
      {},
      {
        tabindex: 0,
        role: "button",
        "aria-expanded": show.value,
        onKeydown: handleTriggerKeyDown,
        "aria-haspopup": "menu" as const,
        onClickCapture: handleTriggerClick,
        "aria-controls": show.value ? menuId : undefined,
        class: cn({
          "inline-block w-fit max-w-full cursor-pointer outline-hidden": true,
          [get(mergedClasses.value, "trigger") ?? ""]: true,
        }),
      },
    );
  });

  const contentBind = computed(() => {
    return mergePartBind(
      partsProps.value?.content,
      {},
      {
        id: menuId,
        role: "menu",
        onKeydown: handleContentKeyDown,
        style: {
          zIndex: stackZIndex.value,
        },
        "aria-hidden": isHiddenWhileMounted.value ? true : undefined,
        class: cn({
          "bg-white ring-1 ring-black/5 outline-hidden overflow-hidden min-w-32 w-max max-w-[calc(100vw-16px)]": true,
          "invisible pointer-events-none": isHiddenWhileMounted.value,
          [roundedClass.value ?? ""]: true,
          [shadowClass.value ?? ""]: true,
          [get(mergedClasses.value, "content") ?? ""]: true,
        }),
      },
    );
  });

  watch(
    show,
    (isShown) => {
      if (isShown) {
        mounted.value = true;

        void nextTick(() => {
          if (!show.value) {
            return;
          }

          releaseOpenMenuClaim = claimOpenMenu({ id: menuId, requestClose });
        });

        stackOrder = acquireLayerStackOrder();
        stackHandle = pushLayerStack({
          order: stackOrder,
          onEscape: handleEscape,
          lockScroll: merged.value.disableScrollLock !== true,
        });

        layerStackId.value = stackHandle.id;
        stackZIndex.value = stackHandle.zIndex;
        syncZIndex();
        unsubscribeLayerStack = subscribeLayerStack(syncZIndex);

        void nextTick(() => {
          syncPositionable();
          syncAutoFocus();
          attachPointerListener();
        });

        return;
      }

      teardownOpenState();

      if (!merged.value.keepMounted) {
        mounted.value = false;
      }
    },
    { immediate: true },
  );

  watch(
    [
      show,
      () => props.anchorEl,
      () => merged.value.offset,
      () => merged.value.strategy,
      () => merged.value.placement,
    ],
    () => {
      void nextTick(() => {
        syncPositionable();
      });
    },
  );

  watch([show, () => merged.value.disableAutoFocus], () => {
    void nextTick(() => {
      syncAutoFocus();
    });
  });

  onBeforeUnmount(() => {
    teardownOpenState();
  });

  return {
    merged,
    menuId,
    mounted,
    rootBind,
    isPortaled,
    triggerBind,
    contentBind,
    setTriggerRef,
    setContentRef,
  };
}
