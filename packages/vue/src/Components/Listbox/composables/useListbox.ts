// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import {
  cn,
  isFieldOverlayDialog,
  mergeBridgeUILayeredClasses,
  resolveFieldOverlay,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  colorProps,
  invalidatedProps,
  sizeProps,
} from "@bridge-ui/core/Tokens/Listbox";

// ** Local Imports
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
        "text-gray-500": true,
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

  return {
    merged,
    checkClass,
    scrollBind,
    messageBind,
    surfaceBind,
    sizeClasses,
    mergedClasses,
    optionSelectedClass,
    optionHighlightedClass,
  };
}
