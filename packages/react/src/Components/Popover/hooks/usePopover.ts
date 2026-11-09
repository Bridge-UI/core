// ** External Imports
import { get, isFunction, omit } from "es-toolkit/compat";
import {
  useId,
  useMemo,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

// ** Core Imports
import { closeOpenMenu } from "@bridge-ui/core/Layer";
import {
  popoverRoundedProps as roundedProps,
  popoverShadowProps as shadowProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  PopoverOwnProps,
  PopoverProps,
} from "@/Components/Popover/popover.types";
import {
  derived,
  hasNamedSlot,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
  useFloatingOverlay,
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
    return merged.title !== undefined && merged.title !== null;
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

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgePopover?.tokens?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgePopover?.tokens?.rounded]);

  const shadowClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      shadowProps,
      bridgePopover?.tokens?.shadow,
    );

    return get(classes, merged.shadow);
  }, [merged.shadow, bridgePopover?.tokens?.shadow]);

  function setShow(next: boolean) {
    if (!next) {
      onClose?.();
    }

    onShowChange?.(next);
  }

  const overlay = useFloatingOverlay({
    show,
    setShow,
    anchorEl,
    id: popoverId,
    arrow: merged.arrow,
    onOpen: closeOpenMenu,
    offset: merged.offset,
    autoFocusContent: true,
    strategy: merged.strategy,
    placement: merged.placement,
    matchWidth: merged.matchWidth,
    persistent: merged.persistent,
    keepMounted: merged.keepMounted,
    closeOnEscape: merged.closeOnEscape,
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

  function handleContentBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;

    if (!(next instanceof Node) || overlay.isInsideOverlay(next)) {
      return;
    }

    if (merged.closeOnClickAway === false) {
      return;
    }

    overlay.requestClose();
  }

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "relative inline-flex": hasTrigger,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    );
  });

  const triggerBind = derived(() => {
    return mergePartBind(
      customProps?.trigger,
      { ref: overlay.triggerRef },
      {
        tabIndex: 0,
        role: "button",
        "aria-expanded": show,
        onClickCapture: overlay.toggle,
        onKeyDown: handleTriggerKeyDown,
        "aria-haspopup": "dialog" as const,
        "aria-controls": show ? popoverId : undefined,
        className: cn({
          "inline-flex w-fit max-w-full cursor-pointer outline-hidden": true,
          [get(mergedClasses, "trigger") ?? ""]: true,
        }),
      },
    );
  });

  const contentBind = derived(() => {
    return mergePartBind(
      customProps?.content,
      { ref: overlay.contentRef },
      {
        tabIndex: -1,
        id: popoverId,
        role: "dialog",
        onBlur: handleContentBlur,
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
