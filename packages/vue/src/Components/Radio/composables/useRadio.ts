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
} from "@bridge-ui/core/Components/Radio";

// ** Local Imports
import type {
  RadioClasses,
  RadioOwnProps,
} from "@/Components/Radio/radio.types";
import { useSwitcher } from "@/Components/Switcher";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const radioBridgeKeys = [
  "name",
  "size",
  "color",
  "value",
  "classes",
  "rounded",
  "partsProps",
] as const satisfies readonly (keyof RadioOwnProps)[];

type RadioLibDefaults = LibDefaultsShape<
  RadioOwnProps,
  "size" | "color" | "rounded"
>;

type RadioMerged = MergeLibDefaults<RadioOwnProps, RadioLibDefaults>;

export function useRadio(
  props: MaybeRefOrGetter<RadioOwnProps>,
  libDefaults: RadioLibDefaults,
  modelValue: MaybeRefOrGetter<string | number | undefined>,
) {
  // Setup
  const attrs = useAttrs();

  const switcher = useSwitcher(() => ({ ...attrs, ...toValue(props) }), {
    error: false,
    withoutErrorMessage: false,
    size: libDefaults.size ?? "sm",
  });

  const split = computed(() => {
    return splitComponentProps<RadioOwnProps, typeof radioBridgeKeys>({
      bridgeKeys: radioBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { entry: bridgeRadio, merged } = useBridgeUIComponent<
    RadioMerged,
    "Radio"
  >({
    libDefaults,
    componentName: "Radio",
    props: () => split.value.customProps,
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<RadioClasses>({
    entry: bridgeRadio,
    props: () => split.value.customProps,
  });

  // Elements
  const isChecked = computed(() => {
    return toValue(modelValue) === merged.value.value;
  });

  const colorKey = computed(() => {
    if (switcher.invalidated.value) {
      return "error";
    }

    return merged.value.color;
  });

  // Classes
  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeRadio.value?.customProps?.size,
    );

    return get(classes, merged.value.size ?? "sm");
  });

  const colorClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeRadio.value?.customProps?.color,
    );

    return get(classes, colorKey.value);
  });

  const roundedClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeRadio.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded ?? "full");
  });

  // Binds
  const inputBind = computed(() => {
    return mergePartBind(
      {
        ...partsProps.value?.input,
        ...switcher.controlBind.value,
        type: "radio",
        name: merged.value.name,
        value: merged.value.value,
      },
      omit(split.value.inheritedAttrs, ["class"]),
      cn({
        "sr-only": true,
        [mergedClasses.value.input ?? ""]: true,
      }),
    );
  });

  const controlBind = computed(() => {
    return mergePartBind(
      partsProps.value?.control,
      { "aria-hidden": true },
      cn({
        "inline-flex shrink-0 items-center justify-center border shadow-sm transition ease-in-out duration-100": true,
        "pointer-events-none": true,
        [sizeClasses.value ?? ""]: true,
        [roundedClasses.value ?? ""]: true,
        [colorClasses.value?.base ?? ""]: !isChecked.value,
        [colorClasses.value?.checked ?? ""]: isChecked.value,
        [mergedClasses.value.control ?? ""]: true,
      }),
    );
  });

  const dotBind = computed(() => {
    return mergePartBind(
      partsProps.value?.dot,
      {},
      cn({
        "rounded-full bg-white transition-transform duration-100": true,
        "scale-0": !isChecked.value,
        "scale-100": isChecked.value,
        "h-[42%] w-[42%]": true,
        [mergedClasses.value.dot ?? ""]: true,
      }),
    );
  });

  const fieldBind = computed(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "relative inline-flex shrink-0 items-center": true,
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2": true,
        [roundedClasses.value ?? ""]: true,
        [colorClasses.value?.focus ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    dotBind,
    switcher,
    fieldBind,
    inputBind,
    isChecked,
    controlBind,
  };
}
