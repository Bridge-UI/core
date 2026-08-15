// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import {
  isFieldOverlayDialog,
  resolveFieldOverlay,
  resolveFieldShowFooter,
} from "@bridge-ui/core/Domain";
import {
  listboxColorProps as colorProps,
  listboxInvalidatedProps as invalidatedProps,
  listboxSizeProps as sizeProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  ListboxClasses,
  ListboxOwnProps,
  ListboxProps,
} from "@/Components/Listbox/listbox.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

export const listboxBridgeKeys = [
  "size",
  "color",
  "classes",
  "maxHeight",
  "showFooter",
  "customProps",
  "invalidated",
  "disableMaxHeight",
] as const satisfies readonly (keyof ListboxOwnProps)[];

type ListboxLibDefaults = LibDefaultsShape<ListboxOwnProps, "size" | "color">;

type ListboxMerged = MergeLibDefaults<ListboxOwnProps, ListboxLibDefaults>;

/**
 * Options for {@link useListbox}.
 */
export type ListboxOptions = {
  /**
   * Public registry key that owns nested `tokens.listbox` defaults.
   */
  componentName?: "Select" | "Autocomplete";
};

export function useListbox(
  props: ListboxOwnProps,
  libDefaults: ListboxLibDefaults,
  options: ListboxOptions = {},
) {
  const attrs = useAttrs();
  const breakpoint = useBreakpoint();
  const resolveMessage = useResolveMessage();

  const split = computed(() => {
    return splitComponentProps<ListboxProps, typeof listboxBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: listboxBridgeKeys,
    });
  });

  const { merged, entry: bridgeListbox } = useBridgeUIComponent<
    ListboxMerged,
    NonNullable<ListboxOptions["componentName"]>
  >({
    libDefaults,
    componentName: options.componentName,
    props: () => {
      return split.value.componentProps;
    },
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ListboxClasses>({
    entry: bridgeListbox,
    props: () => {
      return split.value.componentProps;
    },
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const showFooter = computed(() => {
    return resolveFieldShowFooter(merged.value.showFooter, breakpoint.mobile);
  });

  const isDialogOverlay = computed(() => {
    return isFieldOverlayDialog(
      resolveFieldOverlay(props.overlay, breakpoint.mobile),
    );
  });

  const listboxTokens = computed(() => {
    return get(bridgeListbox.value, ["tokens", "listbox"]) as
      | undefined
      | {
          color?: object;
          invalidated?: object;
          size?: object;
        };
  });

  const colorPalette = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      listboxTokens.value?.color,
    );

    return get(classes, merged.value.color ?? "primary");
  });

  const invalidatedPalette = computed(() => {
    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      listboxTokens.value?.invalidated,
    );
  });

  const colorClasses = computed(() => {
    return merged.value.invalidated
      ? invalidatedPalette.value
      : colorPalette.value;
  });

  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      listboxTokens.value?.size,
    );

    return get(classes, merged.value.size ?? "md");
  });

  const optionSelectedClass = computed(() => {
    return colorClasses.value?.selected;
  });

  const optionHighlightedClass = computed(() => {
    return colorClasses.value?.highlighted;
  });

  const checkClass = computed(() => {
    return cn(sizeClasses.value?.check, colorClasses.value?.check);
  });

  const scrollBind = computed(() => {
    const maxHeightClass = merged.value.maxHeight ?? "max-h-60";
    const disableMaxHeight = merged.value.disableMaxHeight === true;

    return mergePartBind(
      merged.value.customProps?.scroll,
      {},
      cn({
        "overflow-y-auto overscroll-contain": !disableMaxHeight,
        [maxHeightClass]: !disableMaxHeight,
        [mergedClasses.value.scroll ?? ""]: true,
      }),
    );
  });

  const messageBind = computed(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "text-dark-500": true,
        [sizeClasses.value?.message ?? ""]: true,
      }),
    );
  });

  const surfaceBind = computed(() => {
    return cn({
      "overflow-hidden ring-1 ring-black/5 outline-hidden dark:ring-white/10":
        isDialogOverlay.value,
      "w-full rounded-lg bg-white text-dark-900 shadow-lg dark:bg-dark-800 dark:text-dark-100":
        isDialogOverlay.value,
    });
  });

  const footerBind = computed(() => {
    return mergePartBind(
      customProps.value?.footer,
      {},
      cn({
        "flex items-center justify-end gap-2 border-t border-dark-100 bg-dark-50 px-3 py-2 dark:border-dark-800 dark:bg-dark-950/40": true,
        [mergedClasses.value.footer ?? ""]: true,
      }),
    );
  });

  const applyLabel = computed(() => {
    return resolveMessage("Apply");
  });
  const cancelLabel = computed(() => {
    return resolveMessage("Cancel");
  });

  const applyButtonProps = computed(() => {
    return customProps.value?.applyButton;
  });
  const cancelButtonProps = computed(() => {
    return customProps.value?.cancelButton;
  });

  return {
    merged,
    checkClass,
    scrollBind,
    footerBind,
    showFooter,
    applyLabel,
    cancelLabel,
    messageBind,
    surfaceBind,
    sizeClasses,
    mergedClasses,
    applyButtonProps,
    cancelButtonProps,
    optionSelectedClass,
    optionHighlightedClass,
  };
}
