// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  computed,
  ref,
  toValue,
  useAttrs,
  watchEffect,
  type MaybeRefOrGetter,
} from "vue";

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
} from "@bridge-ui/core/Components/Checkbox";

// ** Local Imports
import type {
  CheckboxClasses,
  CheckboxOwnProps,
} from "@/Components/Checkbox/checkbox.types";
import { useFormControl } from "@/Components/FormControl";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const checkboxBridgeKeys = [
  "size",
  "color",
  "classes",
  "rounded",
  "partsProps",
  "indeterminate",
] as const satisfies readonly (keyof CheckboxOwnProps)[];

type CheckboxLibDefaults = LibDefaultsShape<
  CheckboxOwnProps,
  "size" | "color" | "rounded"
>;

type CheckboxMerged = MergeLibDefaults<CheckboxOwnProps, CheckboxLibDefaults>;

export function useCheckbox(
  props: MaybeRefOrGetter<CheckboxOwnProps>,
  libDefaults: CheckboxLibDefaults,
  checked: MaybeRefOrGetter<boolean | undefined>,
) {
  // Setup
  const attrs = useAttrs();
  const inputRef = ref<HTMLInputElement | null>(null);

  const formControl = useFormControl(() => ({ ...attrs, ...toValue(props) }), {
    error: false,
    withoutErrorMessage: false,
    size: libDefaults.size ?? "sm",
  });

  const split = computed(() => {
    return splitComponentProps<CheckboxOwnProps, typeof checkboxBridgeKeys>({
      bridgeKeys: checkboxBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged, entry: bridgeCheckbox } = useBridgeUIComponent<
    CheckboxMerged,
    "Checkbox"
  >({
    libDefaults,
    componentName: "Checkbox",
    props: () => split.value.customProps,
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CheckboxClasses>({
    entry: bridgeCheckbox,
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
      bridgeCheckbox.value?.customProps?.size,
    );

    return get(classes, merged.value.size ?? "sm");
  });

  const colorClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeCheckbox.value?.customProps?.color,
    );

    return get(classes, colorKey.value);
  });

  const roundedClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeCheckbox.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded ?? "sm");
  });

  // Handlers
  watchEffect(() => {
    if (inputRef.value) {
      inputRef.value.indeterminate = Boolean(merged.value.indeterminate);
    }
  });

  // Binds
  const inputBind = computed(() => {
    return mergePartBind(
      {
        ...partsProps.value?.input,
        ...formControl.controlBind.value,
        type: "checkbox",
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

  const iconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.icon,
      {},
      cn({
        "text-white": true,
        [mergedClasses.value.icon ?? ""]: true,
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
        [colorClasses.value?.focus ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    iconBind,
    inputRef,
    fieldBind,
    inputBind,
    isChecked,
    formControl,
    controlBind,
  };
}
