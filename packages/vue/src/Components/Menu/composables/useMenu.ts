// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { computed, toValue, useAttrs, useId, type Ref } from "vue";

// ** Core Imports
import { claimOpenMenu } from "@bridge-ui/core/Layer";
import { createFocusable } from "@bridge-ui/core/Runtime";
import {
  menuRoundedProps as roundedProps,
  menuShadowProps as shadowProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type { MenuOwnProps, MenuProps } from "@/Components/Menu/menu.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
  useFloatingOverlay,
} from "@/Utils";

const menuBridgeKeys = [
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
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeMenu,
    props: () => split.value.componentProps,
  });

  const isPortaled = computed(() => {
    return merged.value.teleportTo !== false;
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeMenu.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const shadowClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      shadowProps,
      bridgeMenu.value?.tokens?.shadow,
    );

    return get(classes, merged.value.shadow);
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["anchorEl", "onShowChange"]);
  });

  const overlay = useFloatingOverlay({
    show,
    setShow,
    id: menuId,
    config: merged,
    claimOpen: claimOpenMenu,
    anchorEl: () => props.anchorEl,
    isClickAwayIgnored: (target) => {
      return Boolean(
        target.closest('[aria-haspopup="menu"], button, [role="button"]'),
      );
    },
  });

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
    const container = overlay.contentRef.value;

    if (!container) {
      return;
    }

    const focusable = createFocusable(container);

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        overlay.requestClose();
        overlay.focusReference();
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
        "aria-haspopup": "menu" as const,
        "aria-controls": show.value ? menuId : undefined,
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
        id: menuId,
        role: "menu",
        onKeydown: handleContentKeyDown,
        style: {
          zIndex: overlay.stackZIndex.value,
        },
        "aria-hidden": overlay.isHiddenWhileMounted.value ? true : undefined,
        class: cn({
          "bg-white text-dark-900 dark:bg-dark-800 dark:text-dark-100 ring-1 ring-black/5 dark:ring-white/10 outline-hidden overflow-hidden max-w-[calc(100vw-16px)]": true,
          "min-w-0 w-full": merged.value.matchWidth === true,
          "min-w-32 w-max": merged.value.matchWidth !== true,
          "invisible pointer-events-none": overlay.isHiddenWhileMounted.value,
          [roundedClass.value ?? ""]: true,
          [shadowClass.value ?? ""]: true,
          [get(mergedClasses.value, "content") ?? ""]: true,
        }),
      },
    );
  });

  return {
    merged,
    menuId,
    rootBind,
    isPortaled,
    triggerBind,
    contentBind,
    mounted: overlay.mounted,
    setTriggerRef: overlay.setTriggerRef,
    setContentRef: overlay.setContentRef,
  };
}
