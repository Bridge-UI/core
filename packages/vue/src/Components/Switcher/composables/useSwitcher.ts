// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  computed,
  toValue,
  useAttrs,
  useId,
  useSlots,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type MaybeRefOrGetter,
} from "vue";

// ** Core Imports
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { sizeProps as labelSizeProps } from "@bridge-ui/core/Components/Label";

// ** Local Imports
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
  "error",
  "classes",
  "disabled",
  "endLabel",
  "readonly",
  "required",
  "controlId",
  "mainLabel",
  "partsProps",
  "startLabel",
  "description",
  "errorMessage",
  "withoutErrorMessage",
] as const satisfies readonly (keyof SwitcherOwnProps)[];

type SwitcherLibDefaults = LibDefaultsShape<
  SwitcherOwnProps,
  "size" | "error" | "withoutErrorMessage"
>;

type SwitcherMerged = MergeLibDefaults<SwitcherOwnProps, SwitcherLibDefaults>;

export function useSwitcher(
  props: MaybeRefOrGetter<Omit<SwitcherOwnProps, "field">>,
  libDefaults: SwitcherLibDefaults,
) {
  // Setup
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

  // Elements
  const invalidated = computed(() => {
    return merged.value.error === true;
  });

  const isDisabled = computed(() => {
    return Boolean(merged.value.disabled);
  });

  const isReadonly = computed(() => {
    return Boolean(merged.value.readonly);
  });

  const labelError = computed(() => {
    return invalidated.value;
  });

  const controlId = computed(() => {
    const inheritedId = (split.value.inheritedAttrs as HTMLAttributes).id;

    return merged.value.controlId ?? inheritedId ?? autoId;
  });

  const reservesErrorMessageSpace = computed(() => {
    return !merged.value.withoutErrorMessage;
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

  // Classes
  const textSizeClass = computed(() => {
    return get(labelSizeProps, merged.value.size ?? "md");
  });

  // Binds
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

  const startLabelBind = computed(() => {
    return mergePartBind(
      partsProps.value?.startLabel,
      { for: controlId.value },
      cn({
        "inline-flex cursor-pointer items-center gap-x-0.5 font-medium leading-none": true,
        [textSizeClass.value ?? ""]: true,
        "text-gray-700 dark:text-gray-300": !labelError.value,
        "text-error-600 dark:text-error-400": labelError.value,
        [mergedClasses.value.startLabel ?? ""]: true,
      }),
    );
  });

  const mainLabelBind = computed(() => {
    return mergePartBind(
      partsProps.value?.mainLabel,
      { for: controlId.value },
      cn({
        "inline-flex cursor-pointer items-center gap-x-0.5 font-medium leading-none": true,
        [textSizeClass.value ?? ""]: true,
        "text-gray-700 dark:text-gray-300": !labelError.value,
        "text-error-600 dark:text-error-400": labelError.value,
        [mergedClasses.value.mainLabel ?? ""]: true,
      }),
    );
  });

  const endLabelBind = computed(() => {
    return mergePartBind(
      partsProps.value?.endLabel,
      { for: controlId.value },
      cn({
        "inline-flex cursor-pointer items-center gap-x-0.5 font-medium leading-none": true,
        [textSizeClass.value ?? ""]: true,
        "text-gray-700 dark:text-gray-300": !labelError.value,
        "text-error-600 dark:text-error-400": labelError.value,
        [mergedClasses.value.endLabel ?? ""]: true,
      }),
    );
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
    isDisabled,
    isReadonly,
    controlBind,
    invalidated,
    endLabelBind,
    mainLabelBind,
    startLabelBind,
    descriptionBind,
    errorMessageBind,
    showErrorMessageContent,
    reservesErrorMessageSpace,
  };
}

export type UseSwitcherReturn = ReturnType<typeof useSwitcher>;
