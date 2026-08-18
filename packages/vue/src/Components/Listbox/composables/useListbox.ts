// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import {
  isFieldOverlayDialog,
  resolveFieldOverlay,
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

export function useListbox(
  props: ListboxOwnProps,
  libDefaults: ListboxLibDefaults,
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
    "Listbox"
  >({
    libDefaults,
    componentName: "Listbox",
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

  const resolvedOverlay = computed(() => {
    return resolveFieldOverlay(props.overlay, breakpoint.mobile);
  });

  const isDialogOverlay = computed(() => {
    return isFieldOverlayDialog(resolvedOverlay.value);
  });

  const isDrawerOverlay = computed(() => {
    return resolvedOverlay.value === "drawer";
  });

  const showFooter = useFieldShowFooter({
    overlay: resolvedOverlay,
    componentName: "Listbox",
    showFooter: () => merged.value.showFooter,
  });

  const colorClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeListbox.value?.tokens?.color,
    );

    return getColorToken({
      tokens: classes,
      color: merged.value.color,
      invalid: merged.value.error,
    });
  });

  const roundedToken = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeListbox.value?.tokens?.rounded,
    );

    return get(classes, props.rounded ?? "md");
  });

  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeListbox.value?.tokens?.size,
    );

    const sizeItem = get(classes, merged.value.size ?? "md");
    const overlayKey = isDialogOverlay.value ? "panel" : "menu";

    return get(sizeItem, overlayKey);
  });

  const optionSelectedClass = computed(() => {
    return colorClasses.value?.selected;
  });

  const optionHighlightedClass = computed(() => {
    return colorClasses.value?.highlighted;
  });

  const optionHoverClass = computed(() => {
    return colorClasses.value?.hover;
  });

  const checkClass = computed(() => {
    return cn(sizeClasses.value?.check, colorClasses.value?.check);
  });

  const scrollBind = computed(() => {
    const maxHeightClass =
      merged.value.maxHeight ??
      (isDialogOverlay.value ? "max-h-[min(60dvh,28rem)]" : "max-h-60");
    const disableMaxHeight = merged.value.disableMaxHeight === true;

    return mergePartBind(
      merged.value.customProps?.scroll,
      {},
      cn({
        "min-h-0 overflow-y-auto overscroll-contain": !disableMaxHeight,
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

  const surfaceRoundedClass = computed(() => {
    const panelRounded = roundedToken.value;

    if (!panelRounded) {
      return undefined;
    }

    return cn({
      [panelRounded]: true,
      "rounded-b-none": isDrawerOverlay.value,
    });
  });

  const surfaceBind = computed(() => {
    return cn({
      "flex w-full flex-col overflow-hidden bg-white text-dark-900 shadow-lg outline-hidden ring-1 ring-black/5 dark:bg-dark-800 dark:text-dark-100 dark:ring-white/10": true,
      [String(surfaceRoundedClass.value ?? "")]: Boolean(
        surfaceRoundedClass.value,
      ),
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
    optionHoverClass,
    cancelButtonProps,
    optionSelectedClass,
    optionHighlightedClass,
  };
}
