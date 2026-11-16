// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useId, type KeyboardEvent } from "react";

// ** Core Imports
import { claimOpenMenu, isMenuClickAwayIgnored } from "@bridge-ui/core/Layer";
import { createFocusable } from "@bridge-ui/core/Runtime";
import {
  menuRoundedProps as roundedProps,
  menuShadowProps as shadowProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type { MenuOwnProps, MenuProps } from "@/Components/Menu/menu.types";
import {
  createPopoverSetShow,
  getPopoverRootBind,
  getPopoverTriggerBind,
  usePopoverPanelClasses,
} from "@/Components/Popover/hooks/popoverParts";
import { usePopoverBase } from "@/Components/Popover/hooks/usePopoverBase";
import {
  derived,
  hasNamedSlot,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const menuBridgeKeys = [
  "slots",
  "offset",
  "shadow",
  "classes",
  "rounded",
  "strategy",
  "placement",
  "matchWidth",
  "persistent",
  "teleportTo",
  "customProps",
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
  const menuId = useId();
  const { onClose, onShowChange, show = false } = options;

  const { componentProps, inheritedAttrs } = splitComponentProps<
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
    props: componentProps,
    componentName: "Menu",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const slots = derived(() => {
    return props.slots;
  });

  const hasTrigger = derived(() => {
    return hasNamedSlot(props.slots, "trigger");
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
    props: componentProps,
  });

  const isPortaled = derived(() => {
    return merged.teleportTo !== false;
  });

  const { shadowClass, roundedClass } = usePopoverPanelClasses({
    shadowProps,
    roundedProps,
    shadow: merged.shadow,
    rounded: merged.rounded,
    shadowOverrides: bridgeMenu?.tokens?.shadow,
    roundedOverrides: bridgeMenu?.tokens?.rounded,
  });

  const setShow = createPopoverSetShow({ onClose, onShowChange });

  const overlay = usePopoverBase({
    show,
    setShow,
    anchorEl,
    id: menuId,
    offset: merged.offset,
    claimOpen: claimOpenMenu,
    strategy: merged.strategy,
    placement: merged.placement,
    matchWidth: merged.matchWidth,
    persistent: merged.persistent,
    keepMounted: merged.keepMounted,
    closeOnEscape: merged.closeOnEscape,
    closeOnClickAway: merged.closeOnClickAway,
    disableAutoFocus: merged.disableAutoFocus,
    isClickAwayIgnored: isMenuClickAwayIgnored,
    disableScrollLock: merged.disableScrollLock,
  });

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
    const container = overlay.contentRef.current;

    if (!container) {
      return;
    }

    // A key already handled by a field inside the menu (a Select opening its
    // listbox on ArrowDown) does not move focus.
    if (event.defaultPrevented) {
      return;
    }

    const target = event.target as Node;

    // Keys from an overlay opened inside the menu (a portaled Popover still
    // bubbles through the React tree) belong to that overlay.
    if (!container.contains(target) || overlay.isInsideNestedLayer(target)) {
      return;
    }

    const focusable = createFocusable(container);

    // Escape goes through the layer stack, which honors `closeOnEscape` and
    // `persistent` and only closes the top-most layer.
    switch (event.key) {
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

  const rootBind = derived(() => {
    return getPopoverRootBind({
      hasTrigger,
      classes: mergedClasses,
      customProps: customProps?.root,
      inheritedAttrs: rootInheritedAttrs,
    });
  });

  const triggerBind = derived(() => {
    return getPopoverTriggerBind({
      show,
      hasPopup: "menu",
      controlsId: menuId,
      toggle: overlay.toggle,
      classes: mergedClasses,
      triggerRef: overlay.triggerRef,
      onKeyDown: handleTriggerKeyDown,
      customProps: customProps?.trigger,
    });
  });

  const contentBind = derived(() => {
    return mergePartBind(
      customProps?.content,
      { ref: overlay.contentRef },
      {
        id: menuId,
        role: "menu",
        onKeyDown: handleContentKeyDown,
        style: {
          zIndex: overlay.stackZIndex,
        },
        "aria-hidden": overlay.isHiddenWhileMounted ? true : undefined,
        className: cn({
          "bg-white text-dark-900 dark:bg-dark-800 dark:text-dark-100 ring-1 ring-black/5 dark:ring-white/10 outline-hidden overflow-hidden max-w-[calc(100vw-16px)]": true,
          "min-w-0 w-full": merged.matchWidth === true,
          "min-w-32 w-max": merged.matchWidth !== true,
          "invisible pointer-events-none": overlay.isHiddenWhileMounted,
          [roundedClass ?? ""]: true,
          [shadowClass ?? ""]: true,
          [get(mergedClasses, "content") ?? ""]: true,
        }),
      },
    );
  });

  return {
    slots,
    merged,
    menuId,
    children,
    rootBind,
    hasTrigger,
    isPortaled,
    triggerBind,
    contentBind,
    mounted: overlay.mounted,
  };
}
