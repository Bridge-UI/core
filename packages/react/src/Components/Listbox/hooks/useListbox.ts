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

  const contentBind = derived(() => {
    return mergePartBind(
      merged.customProps?.content,
      {},
      cn({
        relative: true,
      }),
    );
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

  const loadingTrackBind = derived(() => {
    return mergePartBind(
      {},
      {
        role: "progressbar",
        "aria-hidden": true,
      },
      cn({
        "pointer-events-none absolute top-0 right-0 left-0 z-10 h-0.5 overflow-hidden": true,
      }),
    );
  });

  const loadingBind = derived(() => {
    return mergePartBind(
      merged.customProps?.loading,
      {},
      cn({
        "h-full w-1/3 animate-bridge-listbox-indeterminate": true,
        [colorPalette?.progressColor ?? ""]: true,
        [mergedClasses.loading ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    checkClass,
    scrollBind,
    contentBind,
    loadingBind,
    mergedClasses,
    loadingTrackBind,
    optionSelectedClass,
    optionHighlightedClass,
  };
}
