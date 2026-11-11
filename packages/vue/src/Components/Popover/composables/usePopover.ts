// ** External Imports
import { get, isEmpty, isNil, omit } from "es-toolkit/compat";
import { computed, toValue, useAttrs, useId, type Ref } from "vue";

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
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
  useFloatingOverlay,
} from "@/Utils";

const popoverBridgeKeys = [
  "arrow",
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
   * Whether the `title` slot is provided (labels the dialog).
   */
  hasTitleSlot?: () => boolean;

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
   * Whether the popover is visible (`defineModel()` / `v-model`).
   *
   * @default false
   */
  show?: Ref<boolean>;
};

export function usePopover(
  props: PopoverOwnProps,
  libDefaults: PopoverLibDefaults,
  options: PopoverOptions = {},
) {
  const attrs = useAttrs();

  const popoverId = useId();

  const titleId = `${popoverId}-title`;

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
    return splitComponentProps<PopoverProps, typeof popoverBridgeKeys>({
      bridgeKeys: popoverBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgePopover } = useBridgeUIComponent<
    PopoverMerged,
    "Popover"
  >({
    libDefaults,
    componentName: "Popover",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgePopover,
    props: () => split.value.componentProps,
  });

  const hasTitle = computed(() => {
    if (options.hasTitleSlot?.()) {
      return true;
    }

    return !isNil(merged.value.title) && !isEmpty(merged.value.title);
  });

  const isPortaled = computed(() => {
    return merged.value.teleportTo !== false;
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgePopover.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const shadowClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      shadowProps,
      bridgePopover.value?.tokens?.shadow,
    );

    return get(classes, merged.value.shadow);
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["anchorEl", "onShowChange"]);
  });

  const overlay = useFloatingOverlay({
    show,
    setShow,
    id: popoverId,
    config: merged,
    restoreFocus: true,
    onOpen: closeOpenMenu,
    autoFocusContent: true,
    anchorEl: () => props.anchorEl,
  });

  /**
   * Explicit close from the content (default slot `close`).
   * Works even when `persistent` is set.
   */
  function close() {
    if (!show.value) {
      return;
    }

    setShow(false);
  }

  function handleTriggerKeyDown(event: KeyboardEvent) {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    overlay.toggle();
  }

  function handleContentFocusOut(event: FocusEvent) {
    overlay.handleContentFocusOut(event.relatedTarget);
  }

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "relative inline-flex": true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    );
  });

  const triggerBind = computed(() => {
    return mergePartBind(
      customProps.value?.trigger,
      {},
      {
        tabindex: 0,
        role: "button",
        "aria-expanded": show.value,
        onClickCapture: overlay.toggle,
        onKeydown: handleTriggerKeyDown,
        "aria-haspopup": "dialog" as const,
        "aria-controls": show.value ? popoverId : undefined,
        class: cn({
          "inline-flex w-fit max-w-full cursor-pointer outline-hidden": true,
          [get(mergedClasses.value, "trigger") ?? ""]: true,
        }),
      },
    );
  });

  const contentBind = computed(() => {
    return mergePartBind(
      customProps.value?.content,
      {},
      {
        tabindex: -1,
        id: popoverId,
        role: "dialog",
        onFocusout: handleContentFocusOut,
        "aria-labelledby": hasTitle.value ? titleId : undefined,
        style: {
          zIndex: overlay.stackZIndex.value,
        },
        "aria-hidden": overlay.isHiddenWhileMounted.value ? true : undefined,
        class: cn({
          "bg-white text-dark-900 dark:bg-dark-800 dark:text-dark-100 ring-1 ring-black/5 dark:ring-white/10 outline-hidden p-3 max-w-[calc(100vw-16px)]": true,
          "min-w-0 w-full": merged.value.matchWidth === true,
          "w-max": merged.value.matchWidth !== true,
          "invisible pointer-events-none": overlay.isHiddenWhileMounted.value,
          [roundedClass.value ?? ""]: true,
          [shadowClass.value ?? ""]: true,
          [get(mergedClasses.value, "content") ?? ""]: true,
        }),
      },
    );
  });

  const titleBind = computed(() => {
    return mergePartBind(
      customProps.value?.title,
      {},
      {
        id: titleId,
        class: cn({
          "mb-2 text-sm font-semibold": true,
          [get(mergedClasses.value, "title") ?? ""]: true,
        }),
      },
    );
  });

  const arrowBind = computed(() => {
    if (!merged.value.arrow) {
      return null;
    }

    return mergePartBind(
      customProps.value?.arrow,
      {},
      {
        "aria-hidden": true,
        class: cn({
          "pointer-events-none absolute size-2 rotate-45 bg-white dark:bg-dark-800": true,
          [get(mergedClasses.value, "arrow") ?? ""]: true,
        }),
      },
    );
  });

  return {
    close,
    merged,
    hasTitle,
    rootBind,
    popoverId,
    titleBind,
    arrowBind,
    isPortaled,
    triggerBind,
    contentBind,
    mounted: overlay.mounted,
    setArrowRef: overlay.setArrowRef,
    setTriggerRef: overlay.setTriggerRef,
    setContentRef: overlay.setContentRef,
  };
}
