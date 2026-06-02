// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  computed,
  toValue,
  useAttrs,
  useId,
  useSlots,
  type InputHTMLAttributes,
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
import { sizeProps as labelSizeProps } from "@bridge-ui/core/Components/Label";

// ** Local Imports
import type { LabelOwnProps } from "@/Components/Label/label.types";
import type {
  SwitcherClasses,
  SwitcherOwnProps,
} from "@/Components/Switcher/switcher.types";
import {
  hasSlotOrProp,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export const switcherBridgeKeys = [
  "size",
  "label",
  "error",
  "classes",
  "errorless",
  "leftLabel",
  "disabled",
  "readonly",
  "required",
  "controlId",
  "partsProps",
  "description",
  "errorMessage",
  "withValidationColors",
  "withoutErrorMessage",
] as const satisfies readonly (keyof SwitcherOwnProps)[];

type SwitcherLibDefaults = LibDefaultsShape<
  SwitcherOwnProps,
  "size" | "withValidationColors" | "errorless" | "withoutErrorMessage"
>;

type SwitcherMerged = MergeLibDefaults<SwitcherOwnProps, SwitcherLibDefaults>;

export function useSwitcher(
  props: MaybeRefOrGetter<Omit<SwitcherOwnProps, "field">>,
  libDefaults: SwitcherLibDefaults,
) {
  const autoId = useId();
  const slots = useSlots();
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<
      Omit<SwitcherOwnProps, "field">,
      typeof switcherBridgeKeys
    >({
      bridgeKeys: switcherBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { entry: bridgeSwitcher, merged } = useBridgeUIComponent<
    SwitcherMerged,
    "Switcher"
  >({
    libDefaults,
    componentName: "Switcher",
    props: () => split.value.customProps,
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SwitcherClasses>({
    entry: bridgeSwitcher,
    props: () => split.value.customProps,
  });

  const invalidated = computed(() => {
    return merged.value.error === true;
  });

  const isDisabled = computed(() => {
    return Boolean(merged.value.disabled);
  });

  const isReadonly = computed(() => {
    return Boolean(merged.value.readonly);
  });

  const withValidationColors = computed(() => {
    return merged.value.withValidationColors !== false;
  });

  const labelError = computed(() => {
    return withValidationColors.value && invalidated.value;
  });

  const controlId = computed(() => {
    return merged.value.controlId ?? autoId;
  });

  const reservesErrorMessageSpace = computed(() => {
    return !merged.value.withoutErrorMessage && !merged.value.errorless;
  });

  const showErrorMessageContent = computed(() => {
    return (
      invalidated.value &&
      hasSlotOrProp(slots, "errorMessage", merged.value.errorMessage)
    );
  });

  const ariaDescribedBy = computed(() => {
    const ids: string[] = [];

    if (
      !invalidated.value &&
      hasSlotOrProp(slots, "description", merged.value.description)
    ) {
      ids.push(`${controlId.value}-description`);
    }

    if (
      invalidated.value &&
      reservesErrorMessageSpace.value &&
      hasSlotOrProp(slots, "errorMessage", merged.value.errorMessage)
    ) {
      ids.push(`${controlId.value}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  const textSizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      labelSizeProps,
      bridgeSwitcher.value?.customProps?.size,
    );

    return get(classes, merged.value.size);
  });

  const rootBind = computed(() => {
    return mergePartBind(
      partsProps.value?.root,
      omit(split.value.inheritedAttrs, ["class"]),
      cn({
        "group/switcher relative w-full": true,
        "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60 aria-disabled:cursor-not-allowed": true,
        "aria-readonly:pointer-events-none aria-readonly:select-none": true,
        [mergedClasses.value.root ?? ""]: true,
        [attrs.class as string]: Boolean(attrs.class),
      }),
    );
  });

  const rowBind = computed(() => {
    return mergePartBind(
      partsProps.value?.row,
      {},
      cn({
        "flex items-center gap-x-2": true,
        [mergedClasses.value.row ?? ""]: true,
      }),
    );
  });

  const labelProps = computed(() => {
    return {
      size: merged.value.size,
      for: controlId.value,
      error: labelError.value,
      required: merged.value.required,
      classes: {
        root: cn("cursor-pointer", mergedClasses.value.label),
      },
      ...partsProps.value?.label,
    } satisfies Partial<LabelOwnProps>;
  });

  const leftLabelProps = computed(() => {
    return {
      size: merged.value.size,
      for: controlId.value,
      error: labelError.value,
      required: merged.value.required,
      classes: {
        root: cn("cursor-pointer", mergedClasses.value.leftLabel),
      },
      ...partsProps.value?.leftLabel,
    } satisfies Partial<LabelOwnProps>;
  });

  const descriptionBind = computed(() => {
    return mergePartBind(
      partsProps.value?.description,
      { id: `${controlId.value}-description` },
      cn({
        "mt-2 text-gray-500 dark:text-gray-400": true,
        [textSizeClass.value ?? ""]: true,
        [mergedClasses.value.description ?? ""]: true,
      }),
    );
  });

  const errorMessageBind = computed(() => {
    return mergePartBind(
      partsProps.value?.errorMessage,
      { id: `${controlId.value}-error` },
      cn({
        "mt-2 text-error-600 dark:text-error-400": true,
        "min-h-[1lh]": reservesErrorMessageSpace.value,
        [textSizeClass.value ?? ""]: true,
        [mergedClasses.value.errorMessage ?? ""]: true,
      }),
    );
  });

  const controlBind = computed(() => {
    return {
      id: controlId.value,
      disabled: isDisabled.value,
      readonly: isReadonly.value,
      required: merged.value.required || undefined,
      "aria-invalid": invalidated.value || undefined,
      "aria-describedby": ariaDescribedBy.value,
    } satisfies Partial<InputHTMLAttributes>;
  });

  return {
    slots,
    merged,
    rowBind,
    rootBind,
    controlId,
    labelProps,
    controlBind,
    invalidated,
    isDisabled,
    isReadonly,
    leftLabelProps,
    descriptionBind,
    errorMessageBind,
    withValidationColors,
    showErrorMessageContent,
    reservesErrorMessageSpace,
  };
}

export type UseSwitcherReturn = ReturnType<typeof useSwitcher>;
