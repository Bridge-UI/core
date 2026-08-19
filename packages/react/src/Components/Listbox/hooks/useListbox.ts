// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  isFieldOverlayDialog,
  resolveFieldOverlay,
  type FieldOverlayMode,
} from "@bridge-ui/core/Domain";
import {
  listboxColorProps as colorProps,
  listboxRoundedProps as roundedProps,
  listboxSizeProps as sizeProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  getColorToken,
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
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
  useFieldShowFooter,
} from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

export const listboxBridgeKeys = [
  "size",
  "color",
  "error",
  "classes",
  "maxHeight",
  "showFooter",
  "customProps",
  "disableMaxHeight",
] as const satisfies readonly (keyof ListboxOwnProps)[];

type ListboxLibDefaults = LibDefaultsShape<ListboxOwnProps, "size" | "color">;

type ListboxMerged = MergeLibDefaults<ListboxOwnProps, ListboxLibDefaults>;

/**
 * Options for {@link useListbox}.
 */
export type ListboxOptions = {
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

  const customProps = derived(() => {
    return merged.customProps;
  });

  const resolvedOverlay = useMemo(() => {
    return resolveFieldOverlay(options.overlay, breakpoint.mobile);
  }, [options.overlay, breakpoint.mobile]);

  const isDialogOverlay = derived(() => {
    return isFieldOverlayDialog(resolvedOverlay);
  });

  const isDrawerOverlay = derived(() => {
    return resolvedOverlay === "drawer";
  });

  const showFooter = useFieldShowFooter({
    overlay: resolvedOverlay,
    componentName: "Listbox",
    showFooter: merged.showFooter,
  });

  const colorClasses = derived(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeListbox?.tokens?.color,
    );

    return getColorToken({
      tokens: classes,
      color: merged.color,
      invalid: merged.error,
    });
  });

  const roundedToken = derived(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeListbox?.tokens?.rounded,
    );

    return get(classes, props.rounded ?? "md");
  });

  const sizeClasses = derived(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeListbox?.tokens?.size,
    );
    const sizeItem = get(classes, merged.size ?? "md");
    const overlayKey = isDialogOverlay ? "panel" : "menu";

    return get(sizeItem, overlayKey);
  });

  const optionSelectedClass = derived(() => {
    return colorClasses?.selected;
  });

  const optionHighlightedClass = derived(() => {
    return colorClasses?.highlighted;
  });

  const optionHoverClass = derived(() => {
    return colorClasses?.hover;
  });

  const checkClass = derived(() => {
    return cn(sizeClasses?.check, colorClasses?.check);
  });

  const scrollBind = derived(() => {
    const maxHeightClass =
      merged.maxHeight ??
      (isDialogOverlay ? "max-h-[min(60dvh,28rem)]" : "max-h-60");
    const disableMaxHeight = merged.disableMaxHeight === true;

    return mergePartBind(
      merged.customProps?.scroll,
      {},
      cn({
        "min-h-0 overflow-y-auto overscroll-contain bridge-soft-scrollbar":
          !disableMaxHeight,
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

  const surfaceRoundedClass = derived(() => {
    const panelRounded = roundedToken;

    if (!panelRounded) {
      return undefined;
    }

    return cn({
      [panelRounded]: true,
      "rounded-b-none": isDrawerOverlay,
    });
  });

  const surfaceBind = derived(() => {
    return cn({
      "flex w-full flex-col overflow-hidden bg-white text-dark-900 shadow-lg outline-hidden ring-1 ring-black/5 dark:bg-dark-800 dark:text-dark-100 dark:ring-white/10": true,
      [String(surfaceRoundedClass ?? "")]: Boolean(surfaceRoundedClass),
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
    optionHoverClass,
    optionSelectedClass,
    optionHighlightedClass,
    applyLabel: resolveMessage("Apply"),
    cancelLabel: resolveMessage("Cancel"),
    applyButtonProps: customProps?.applyButton,
    cancelButtonProps: customProps?.cancelButton,
  };
}
