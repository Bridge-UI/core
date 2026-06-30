// ** External Imports
import { get } from "es-toolkit/compat";

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
} from "@bridge-ui/core/Components/Listbox";

// ** Local Imports
import type {
  ListboxClasses,
  ListboxOwnProps,
  ListboxProps,
} from "@/Components/Listbox/listbox.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const listboxBridgeKeys = [
  "color",
  "classes",
  "maxHeight",
  "customProps",
  "invalidated",
  "disableMaxHeight",
] as const satisfies readonly (keyof ListboxOwnProps)[];

type ListboxLibDefaults = LibDefaultsShape<ListboxOwnProps, "color">;

type ListboxMerged = MergeLibDefaults<ListboxOwnProps, ListboxLibDefaults>;

export function useListbox(
  props: ListboxOwnProps,
  libDefaults: ListboxLibDefaults,
) {
  const { componentProps } = splitComponentProps<
    ListboxProps,
    typeof listboxBridgeKeys
  >({
    props,
    bridgeKeys: listboxBridgeKeys,
  });

  const { merged, entry: bridgeListbox } = useBridgeUIComponent<
    ListboxMerged,
    "Listbox"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Listbox",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ListboxClasses>({
    entry: bridgeListbox,
    props: componentProps,
  });

  const colorPalette = derived(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeListbox?.customProps?.color,
    );

    return get(classes, merged.color ?? "primary");
  });

  const invalidatedPalette = derived(() => {
    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      bridgeListbox?.customProps?.invalidated,
    );
  });

  const colorClasses = derived(() => {
    return merged.invalidated ? invalidatedPalette : colorPalette;
  });

  const optionSelectedClass = derived(() => {
    return colorClasses?.selected;
  });

  const optionHighlightedClass = derived(() => {
    return colorClasses?.highlighted;
  });

  const checkClass = derived(() => {
    return colorClasses?.check;
  });

  const scrollBind = derived(() => {
    const maxHeightClass = merged.maxHeight ?? "max-h-60";
    const disableMaxHeight = merged.disableMaxHeight === true;

    return mergePartBind(
      merged.customProps?.scroll,
      {},
      cn({
        "overflow-y-auto overscroll-contain": !disableMaxHeight,
        [maxHeightClass]: !disableMaxHeight,
        [mergedClasses.scroll ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    checkClass,
    scrollBind,
    mergedClasses,
    optionSelectedClass,
    optionHighlightedClass,
  };
}
