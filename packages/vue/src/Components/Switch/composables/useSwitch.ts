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
import {
  colorProps,
  roundedProps,
  sizeProps,
} from "@bridge-ui/core/Components/Switch";

// ** Local Imports
import { useFormControl } from "@/Components/FormControl";
import type {
  SwitchClasses,
  SwitchOwnProps,
} from "@/Components/Switch/switch.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const switchBridgeKeys = [
  "size",
  "color",
  "classes",
  "rounded",
  "partsProps",
] as const satisfies readonly (keyof SwitchOwnProps)[];

type SwitchLibDefaults = LibDefaultsShape<
  SwitchOwnProps,
  "size" | "color" | "rounded"
>;

type SwitchMerged = MergeLibDefaults<SwitchOwnProps, SwitchLibDefaults>;

export function useSwitch(
  props: MaybeRefOrGetter<SwitchOwnProps>,
  libDefaults: SwitchLibDefaults,
  checked: MaybeRefOrGetter<boolean | undefined>,
) {
  // Setup
  const attrs = useAttrs();

  const formControl = useFormControl(() => ({ ...attrs, ...toValue(props) }), {
    error: false,
    withoutErrorMessage: false,
    size: libDefaults.size ?? "sm",
  });

  const split = computed(() => {
    return splitComponentProps<SwitchOwnProps, typeof switchBridgeKeys>({
      bridgeKeys: switchBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged, entry: bridgeSwitch } = useBridgeUIComponent<
    SwitchMerged,
    "Switch"
  >({
    libDefaults,
    componentName: "Switch",
    props: () => split.value.customProps,
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SwitchClasses>({
    entry: bridgeSwitch,
    props: () => split.value.customProps,
  });

  // Elements
  const isChecked = computed(() => {
    return Boolean(toValue(checked));
  });

  const colorKey = computed(() => {
    if (formControl.invalidated.value) {
      return "error";
    }

    return merged.value.color;
  });

  // Classes
  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeSwitch.value?.customProps?.size,
    );

    return get(classes, merged.value.size ?? "sm");
  });

  const colorClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeSwitch.value?.customProps?.color,
    );

    return get(classes, colorKey.value);
  });

  const roundedClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeSwitch.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded ?? "full");
  });

  // Binds
  const inputBind = computed(() => {
    return mergePartBind(
      {
        ...partsProps.value?.input,
        ...formControl.controlBind.value,
        role: "switch",
        type: "checkbox",
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
        "block cursor-pointer transition ease-in-out duration-100": true,
        [sizeClasses.value?.track ?? ""]: true,
        [roundedClasses.value ?? ""]: true,
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
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2": true,
        [roundedClasses.value ?? ""]: true,
        [colorClasses.value?.focus ?? ""]: true,
      }),
    );
  });

  return {
    fieldBind,
    inputBind,
    isChecked,
    thumbBind,
    trackBind,
    formControl,
  };
}
