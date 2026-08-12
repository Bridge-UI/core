// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  isFieldOverlayDialog,
  mergeBridgeUILayeredClasses,
  resolveFieldOverlay,
  resolveFieldShowFooter,
  splitComponentProps,
  type FieldOverlayMode,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  colorProps,
  invalidatedProps,
  sizeProps,
} from "@bridge-ui/core/Tokens/Listbox";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
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

  /**
   * Overlay mode forwarded from `Listbox` — dialogs need Listbox surface chrome.
   */
  overlay?: FieldOverlayMode;
};

export function useListbox(
  props: ListboxOwnProps,
  libDefaults: ListboxLibDefaults,
  options: ListboxOptions = {},
) {
  const breakpoint = useBreakpoint();
  const resolveMessage = useResolveMessage();

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

  const customProps = derived(() => {
    return merged.customProps;
  });

  const showFooter = derived(() => {
    return resolveFieldShowFooter(merged.showFooter, breakpoint.mobile);
  });

  const isDialogOverlay = useMemo(() => {
    return isFieldOverlayDialog(
      resolveFieldOverlay(options.overlay, breakpoint.mobile),
    );
  }, [options.overlay, breakpoint.mobile]);

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
        "text-dark-500": true,
        [sizeClasses?.message ?? ""]: true,
      }),
    );
  });

  const surfaceBind = derived(() => {
    return cn({
      "overflow-hidden ring-1 ring-black/5 outline-hidden dark:ring-white/10":
        isDialogOverlay,
      "w-full rounded-lg bg-white text-dark-900 shadow-lg dark:bg-dark-800 dark:text-dark-100":
        isDialogOverlay,
    });
  });

  const footerBind = derived(() => {
    return mergePartBind(
      customProps?.footer,
      {},
      cn({
        "flex items-center justify-end gap-2 border-t border-dark-100 bg-dark-50 px-3 py-2 dark:border-dark-800 dark:bg-dark-950/40": true,
        [mergedClasses.footer ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    checkClass,
    scrollBind,
    footerBind,
    showFooter,
    messageBind,
    surfaceBind,
    sizeClasses,
    mergedClasses,
    optionSelectedClass,
    optionHighlightedClass,
    applyLabel: resolveMessage("Apply"),
    cancelLabel: resolveMessage("Cancel"),
    applyButtonProps: customProps?.applyButton,
    cancelButtonProps: customProps?.cancelButton,
  };
}
