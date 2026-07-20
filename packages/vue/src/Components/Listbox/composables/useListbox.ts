// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  colorProps,
  invalidatedProps,
  sizeProps,
} from "@bridge-ui/core/Components/Listbox";

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

export function useListbox(
  props: ListboxOwnProps,
  libDefaults: ListboxLibDefaults,
) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<ListboxProps, typeof listboxBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: listboxBridgeKeys,
    });
  });

  const { merged, entry: bridgeListbox } = useBridgeUIComponent<
    ListboxMerged,
    "Listbox"
  >({
    libDefaults,
    componentName: "Listbox",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ListboxClasses>({
    entry: bridgeListbox,
    props: () => split.value.componentProps,
  });

  const colorPalette = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeListbox.value?.customProps?.color,
    );

    return get(classes, merged.value.color ?? "primary");
  });

  const invalidatedPalette = computed(() => {
    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      bridgeListbox.value?.customProps?.invalidated,
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
      bridgeListbox.value?.customProps?.size,
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

  const contentBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.content,
      {},
      cn({
        relative: true,
      }),
    );
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

  const loadingTrackBind = computed(() => {
    return mergePartBind(
      {},
      {
        role: "progressbar",
        "aria-hidden": true,
      },
      cn({
        "h-0.5 w-full shrink-0 overflow-hidden": true,
      }),
    );
  });

  const loadingBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.loading,
      {},
      cn({
        "h-full w-1/3 animate-bridge-listbox-indeterminate": true,
        [colorPalette.value?.progressColor ?? ""]: true,
        [mergedClasses.value.loading ?? ""]: true,
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

  return {
    merged,
    checkClass,
    scrollBind,
    contentBind,
    messageBind,
    loadingBind,
    sizeClasses,
    mergedClasses,
    loadingTrackBind,
    optionSelectedClass,
    optionHighlightedClass,
  };
}
