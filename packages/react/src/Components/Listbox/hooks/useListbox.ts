// ** External Imports
import { get } from "es-toolkit/compat";

// ** Core Imports
import {
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { colorProps } from "@bridge-ui/core/Components/Listbox";

// ** Local Imports
import type {
  ListboxClasses,
  ListboxOwnProps,
  ListboxProps,
} from "@/Components/Listbox/listbox.types";
import {
  derived,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const listboxBridgeKeys = [
  "color",
  "classes",
  "partsProps",
] as const satisfies readonly (keyof ListboxOwnProps)[];

type ListboxLibDefaults = LibDefaultsShape<ListboxOwnProps, "color">;

type ListboxMerged = MergeLibDefaults<ListboxOwnProps, ListboxLibDefaults>;

export function useListbox(
  props: ListboxOwnProps,
  libDefaults: ListboxLibDefaults,
) {
  const { customProps } = splitComponentProps<
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
    props: customProps,
    componentName: "Listbox",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ListboxClasses>({
    props: customProps,
    entry: bridgeListbox,
  });

  const colorClasses = derived(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeListbox?.customProps?.color,
    );

    return get(classes, merged.color ?? "primary");
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

  return {
    merged,
    checkClass,
    mergedClasses,
    optionSelectedClass,
    optionHighlightedClass,
  };
}
