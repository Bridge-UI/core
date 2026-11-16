// ** External Imports
import { get, isFunction, omit } from "es-toolkit/compat";
import { useId, type KeyboardEvent, type ReactNode } from "react";

// ** Core Imports
import { closeOpenMenu } from "@bridge-ui/core/Layer";
import {
  popoverRoundedProps as roundedProps,
  popoverShadowProps as shadowProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { usePopoverBase } from "@/Components/Popover/hooks/usePopoverBase";
import type {
  PopoverOwnProps,
  PopoverProps,
} from "@/Components/Popover/popover.types";
import {
  createPopoverSetShow,
  derived,
  getPopoverRootBind,
  getPopoverTriggerBind,
  hasNamedSlot,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
  usePopoverPanelClasses,
} from "@/Utils";

const popoverBridgeKeys = [
  "arrow",
  "slots",
  "title",
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
  "closeOnFocusOut",
  "closeOnClickAway",
  "disableAutoFocus",
  "disableScrollLock",
] as const satisfies readonly (keyof PopoverOwnProps)[];

type PopoverLibDefaults = LibDefaultsShape<
  PopoverOwnProps,
  | "arrow"
  | "offset"
  | "shadow"
  | "rounded"
  | "strategy"
  | "placement"
  | "teleportTo"
  | "closeOnEscape"
  | "closeOnFocusOut"
  | "closeOnClickAway"
  | "disableScrollLock"
>;

type PopoverMerged = MergeLibDefaults<PopoverOwnProps, PopoverLibDefaults>;

export type PopoverOptions = {
  /**
   * Called when the user dismisses the popover.
   * Sugar for `onShowChange(false)`.
   */
  onClose?: () => void;

  /**
   * Called when `show` should change (controlled state).
   */
  onShowChange?: (show: boolean) => void;

  /**
   * Whether the popover is visible.
   *
   * @default false
   */
  show?: boolean;
};

export function usePopover(
  props: PopoverProps,
  libDefaults: PopoverLibDefaults,
  options: PopoverOptions = {},
) {
  const { onClose, onShowChange, show = false } = options;

  const popoverId = useId();

  const titleId = `${popoverId}-title`;

  const { componentProps, inheritedAttrs } = splitComponentProps<
    PopoverProps,
    typeof popoverBridgeKeys
  >({
    props,
    bridgeKeys: popoverBridgeKeys,
  });

  const { merged, entry: bridgePopover } = useBridgeUIComponent<
    PopoverMerged,
    "Popover"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Popover",
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

  const hasTitle = derived(() => {
    const title = merged.title;

    return (
      title !== undefined && title !== null && title !== false && title !== ""
    );
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
    entry: bridgePopover,
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
    shadowOverrides: bridgePopover?.tokens?.shadow,
    roundedOverrides: bridgePopover?.tokens?.rounded,
  });

  const setShow = createPopoverSetShow({ onClose, onShowChange });

  const overlay = usePopoverBase({
    show,
    setShow,
    anchorEl,
    id: popoverId,
    restoreFocus: true,
    arrow: merged.arrow,
    offset: merged.offset,
    onOpen: closeOpenMenu,
    autoFocusContent: true,
    strategy: merged.strategy,
    placement: merged.placement,
    matchWidth: merged.matchWidth,
    persistent: merged.persistent,
    keepMounted: merged.keepMounted,
    closeOnEscape: merged.closeOnEscape,
    closeOnFocusOut: merged.closeOnFocusOut,
    closeOnClickAway: merged.closeOnClickAway,
    disableAutoFocus: merged.disableAutoFocus,
    disableScrollLock: merged.disableScrollLock,
  });

  /**
   * Explicit close from the content (`children` render function).
   * Works even when `persistent` is set.
   */
  function close() {
    if (!show) {
      return;
    }

    setShow(false);
  }

  const children = derived((): ReactNode => {
    const content = props.children;

    return isFunction(content) ? content({ close }) : content;
  });

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    overlay.toggle();
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
      hasPopup: "dialog",
      controlsId: popoverId,
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
        tabIndex: -1,
        id: popoverId,
        role: "dialog",
        onKeyDown: overlay.handleContentEscape,
        "aria-labelledby": hasTitle ? titleId : undefined,
        style: {
          zIndex: overlay.stackZIndex,
        },
        "aria-hidden": overlay.isHiddenWhileMounted ? true : undefined,
        className: cn({
          "bg-white text-dark-900 dark:bg-dark-800 dark:text-dark-100 ring-1 ring-black/5 dark:ring-white/10 outline-hidden p-3 max-w-[calc(100vw-16px)]": true,
          "min-w-0 w-full": merged.matchWidth === true,
          "w-max": merged.matchWidth !== true,
          "invisible pointer-events-none": overlay.isHiddenWhileMounted,
          [roundedClass ?? ""]: true,
          [shadowClass ?? ""]: true,
          [get(mergedClasses, "content") ?? ""]: true,
        }),
      },
    );
  });

  const titleBind = derived(() => {
    return mergePartBind(
      customProps?.title,
      {},
      {
        id: titleId,
        className: cn({
          "mb-2 text-sm font-semibold": true,
          [get(mergedClasses, "title") ?? ""]: true,
        }),
      },
    );
  });

  const arrowBind = derived(() => {
    if (!merged.arrow) {
      return null;
    }

    return mergePartBind(
      customProps?.arrow,
      { ref: overlay.arrowRef },
      {
        "aria-hidden": true,
        className: cn({
          "pointer-events-none absolute size-2 rotate-45 bg-white dark:bg-dark-800": true,
          [get(mergedClasses, "arrow") ?? ""]: true,
        }),
      },
    );
  });

  return {
    close,
    slots,
    merged,
    children,
    hasTitle,
    rootBind,
    popoverId,
    titleBind,
    arrowBind,
    hasTrigger,
    isPortaled,
    triggerBind,
    contentBind,
    mounted: overlay.mounted,
  };
}
