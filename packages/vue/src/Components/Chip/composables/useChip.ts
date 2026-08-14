// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs, type SetupContext } from "vue";

// ** Core Imports
import { sizeProps } from "@bridge-ui/core/Tokens/Chip";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ChipClasses,
  ChipEmits,
  ChipOwnProps,
  ChipProps,
} from "@/Components/Chip/chip.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export const chipBridgeKeys = [
  "size",
  "label",
  "classes",
  "disabled",
  "clearLabel",
  "customProps",
  "dismissible",
] as const satisfies readonly (keyof ChipOwnProps)[];

type ChipLibDefaults = LibDefaultsShape<ChipOwnProps, "size">;

type ChipMerged = MergeLibDefaults<ChipOwnProps, ChipLibDefaults>;

export function useChip(
  props: ChipOwnProps,
  libDefaults: ChipLibDefaults,
  emit: SetupContext<ChipEmits>["emit"],
) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<ChipProps, typeof chipBridgeKeys>({
      bridgeKeys: chipBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeChip } = useBridgeUIComponent<
    ChipMerged,
    "Chip"
  >({
    libDefaults,
    componentName: "Chip",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ChipClasses>({
    entry: bridgeChip,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeChip.value?.tokens?.size,
    );

    return get(classes, merged.value.size ?? "md");
  });

  const clearIconSize = computed(() => {
    return sizeClasses.value?.clear ?? "md";
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      split.value.inheritedAttrs,
      cn({
        "inline-flex max-w-full items-center bg-dark-100 text-dark-800 dark:bg-dark-700 dark:text-dark-100": true,
        "opacity-50 pointer-events-none": merged.value.disabled === true,
        [sizeClasses.value?.root ?? ""]: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const labelBind = computed(() => {
    return mergePartBind(
      customProps.value?.label,
      {},
      cn({
        truncate: true,
        [sizeClasses.value?.label ?? ""]: true,
        [mergedClasses.value.label ?? ""]: true,
      }),
    );
  });

  const clearBind = computed(() => {
    return mergePartBind(
      customProps.value?.clear,
      {
        role: "button",
        tabindex: merged.value.disabled ? -1 : 0,
        "aria-label": merged.value.clearLabel ?? "Remove",
        "aria-disabled": merged.value.disabled ? true : undefined,
      },
      cn({
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm text-dark-400 transition-colors duration-150 hover:text-dark-700 dark:text-dark-500 dark:hover:text-dark-200": true,
        [mergedClasses.value.clear ?? ""]: true,
      }),
    );
  });

  function handleDismiss(event: MouseEvent | KeyboardEvent) {
    if (merged.value.disabled) {
      return;
    }

    emit("dismiss", event);
  }

  function handleClearKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleDismiss(event);
    }
  }

  return {
    merged,
    rootBind,
    labelBind,
    clearBind,
    clearIconSize,
    mergedClasses,
    handleDismiss,
    handleClearKeyDown,
  };
}
