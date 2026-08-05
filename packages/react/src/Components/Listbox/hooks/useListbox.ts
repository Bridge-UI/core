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
  sizeProps,
} from "@bridge-ui/core/Tokens/Listbox";

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
  const { componentProps } = splitComponentProps<
    ListboxProps,
    typeof listboxBridgeKeys
  >({
    props,
    bridgeKeys: listboxBridgeKeys,
  });

  const { merged, entry: bridgeListbox } = useBridgeUIComponent<
    ListboxMerged,
    NonNullable<ListboxOptions["componentName"]>
  >({
    libDefaults,
    props: componentProps,
    componentName: options.componentName,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ListboxClasses>({
    entry: bridgeListbox,
    props: componentProps,
  });

  const listboxTokens = derived(() => {
    return get(bridgeListbox, ["tokens", "listbox"]) as
      | undefined
      | {
          color?: object;
          invalidated?: object;
          size?: object;
        };
  });

  const colorPalette = derived(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      listboxTokens?.color,
    );

    return get(classes, merged.color ?? "primary");
  });

  const invalidatedPalette = derived(() => {
    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      listboxTokens?.invalidated,
    );
  });

  const colorClasses = derived(() => {
    return merged.invalidated ? invalidatedPalette : colorPalette;
  });

  const sizeClasses = derived(() => {
    const classes = mergeBridgeUILayeredClasses(sizeProps, listboxTokens?.size);

    return get(classes, merged.size ?? "md");
  });

  const optionSelectedClass = derived(() => {
    return colorClasses?.selected;
  });

  const optionHighlightedClass = derived(() => {
    return colorClasses?.highlighted;
  });

  const checkClass = derived(() => {
    return cn(sizeClasses?.check, colorClasses?.check);
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

  const messageBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "text-gray-500": true,
        [sizeClasses?.message ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    checkClass,
    scrollBind,
    messageBind,
    sizeClasses,
    mergedClasses,
    optionSelectedClass,
    optionHighlightedClass,
  };
}
