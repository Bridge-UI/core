// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { computed, toValue, useAttrs, type MaybeRefOrGetter } from "vue";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { colorProps, sizeProps } from "@bridge-ui/core/Components/Toggle";

// ** Local Imports
import { useSwitcher } from "@/Components/Switcher";
import type {
  ToggleClasses,
  ToggleOwnProps,
} from "@/Components/Toggle/toggle.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const toggleBridgeKeys = [
  "size",
  "color",
  "classes",
  "partsProps",
] as const satisfies readonly (keyof ToggleOwnProps)[];

type ToggleLibDefaults = LibDefaultsShape<ToggleOwnProps, "size" | "color">;

type ToggleMerged = MergeLibDefaults<ToggleOwnProps, ToggleLibDefaults>;

export function useToggle(
  props: MaybeRefOrGetter<ToggleOwnProps>,
  libDefaults: ToggleLibDefaults,
  checked: MaybeRefOrGetter<boolean | undefined>,
) {
  const attrs = useAttrs();

  const switcher = useSwitcher(() => ({ ...attrs, ...toValue(props) }), {
    size: libDefaults.size ?? "sm",
    withValidationColors: true,
    errorless: false,
    withoutErrorMessage: false,
  });

  const split = computed(() => {
    return splitComponentProps<ToggleOwnProps, typeof toggleBridgeKeys>({
      bridgeKeys: toggleBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { entry: bridgeToggle, merged } = useBridgeUIComponent<
    ToggleMerged,
    "Toggle"
  >({
    libDefaults,
    componentName: "Toggle",
    props: () => split.value.customProps,
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ToggleClasses>({
    entry: bridgeToggle,
    props: () => split.value.customProps,
  });

  const isChecked = computed(() => {
    return Boolean(toValue(checked));
  });

  const invalidated = computed(() => {
    return switcher.invalidated.value;
  });

  const withValidationColors = computed(() => {
    return switcher.withValidationColors.value;
  });

  const colorKey = computed(() => {
    if (withValidationColors.value && invalidated.value) {
      return "error";
    }

    return merged.value.color;
  });

  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeToggle.value?.customProps?.size,
    );

    return get(classes, merged.value.size ?? "sm");
  });

  const colorClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeToggle.value?.customProps?.color,
    );

    return get(classes, colorKey.value);
  });

  const inputBind = computed(() => {
    return mergePartBind(
      {
        ...partsProps.value?.input,
        ...switcher.controlBind.value,
        type: "checkbox",
        role: "switch",
      },
      omit(split.value.inheritedAttrs, ["class"]),
      cn({
        "sr-only": true,
        [mergedClasses.value.input ?? ""]: true,
      }),
    );
  });

  const trackBind = computed(() => {
    return mergePartBind(
      partsProps.value?.track,
      { "aria-hidden": true },
      cn({
        "block cursor-pointer rounded-full transition ease-in-out duration-100": true,
        [sizeClasses.value?.track ?? ""]: true,
        [colorClasses.value?.track ?? ""]: !isChecked.value,
        [colorClasses.value?.trackChecked ?? ""]: isChecked.value,
        [mergedClasses.value.track ?? ""]: true,
      }),
    );
  });

  const thumbBind = computed(() => {
    return mergePartBind(
      partsProps.value?.thumb,
      { "aria-hidden": true },
      cn({
        "pointer-events-none absolute start-0.5 top-1/2 -translate-y-1/2 rounded-full shadow-sm transition ease-in-out duration-200": true,
        [sizeClasses.value?.thumb ?? ""]: true,
        [sizeClasses.value?.thumbCheckedTranslate ?? ""]: isChecked.value,
        [colorClasses.value?.thumb ?? ""]: true,
        [mergedClasses.value.thumb ?? ""]: true,
      }),
    );
  });

  const fieldBind = computed(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "relative inline-flex shrink-0 select-none": true,
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 rounded-full": true,
        [colorClasses.value?.focus ?? ""]: true,
      }),
    );
  });

  return {
    switcher,
    isChecked,
    inputBind,
    thumbBind,
    trackBind,
    fieldBind,
  };
}
