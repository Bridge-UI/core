// ** External Imports
import { get, omit } from "es-toolkit/compat";
import type { InputHTMLAttributes } from "react";
import { useId, useMemo } from "react";

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
import type { LabelProps } from "@/Components/Label/label.types";
import type {
  SwitcherClasses,
  SwitcherOwnProps,
  SwitcherProps,
} from "@/Components/Switcher/switcher.types";
import {
  derived,
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
  props: Omit<SwitcherProps, "field">,
  libDefaults: SwitcherLibDefaults,
) {
  // Setup
  const autoId = useId();

  const { customProps, inheritedAttrs } = splitComponentProps<
    Omit<SwitcherProps, "field">,
    typeof switcherBridgeKeys
  >({
    props,
    bridgeKeys: switcherBridgeKeys,
  });

  const { entry: bridgeSwitcher, merged } = useBridgeUIComponent<
    SwitcherMerged,
    "Switcher"
  >({
    libDefaults,
    props: customProps,
    componentName: "Switcher",
  });

  const slots = derived(() => {
    return props.slots;
  });

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children", "className"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SwitcherClasses>({
    props: customProps,
    entry: bridgeSwitcher,
  });

  // Elements
  const invalidated = derived(() => {
    return merged.error === true;
  });

  const isDisabled = derived(() => {
    return Boolean(merged.disabled);
  });

  const isReadonly = derived(() => {
    return Boolean(merged.readonly);
  });

  const withValidationColors = derived(() => {
    return merged.withValidationColors !== false;
  });

  const labelError = derived(() => {
    return withValidationColors && invalidated;
  });

  const controlId = derived(() => {
    return merged.controlId ?? autoId;
  });

  const reservesErrorMessageSpace = derived(() => {
    return !merged.withoutErrorMessage && !merged.errorless;
  });

  const showErrorMessageContent = derived(() => {
    return (
      invalidated && hasSlotOrProp(slots, "errorMessage", merged.errorMessage)
    );
  });

  const ariaDescribedBy = derived(() => {
    const ids: string[] = [];

    if (
      !invalidated &&
      hasSlotOrProp(slots, "description", merged.description)
    ) {
      ids.push(`${controlId}-description`);
    }

    if (
      invalidated &&
      reservesErrorMessageSpace &&
      hasSlotOrProp(slots, "errorMessage", merged.errorMessage)
    ) {
      ids.push(`${controlId}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  // Classes
  const textSizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      labelSizeProps,
      bridgeSwitcher?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeSwitcher?.customProps?.size]);

  // Binds
  const rootBind = derived(() => {
    return mergePartBind(
      partsProps?.root,
      {
        className: cn(inheritedAttrs.className),
        ...rootInheritedAttrs,
      },
      cn({
        "group/switcher relative w-full": true,
        "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60 aria-disabled:cursor-not-allowed": true,
        "aria-readonly:pointer-events-none aria-readonly:select-none": true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const rowBind = derived(() => {
    return mergePartBind(
      partsProps?.row,
      {},
      cn({
        "flex items-center gap-x-2": true,
        [mergedClasses.row ?? ""]: true,
      }),
    );
  });

  const labelProps = derived(() => {
    return {
      size: merged.size,
      htmlFor: controlId,
      error: labelError,
      required: merged.required,
      classes: {
        root: cn("cursor-pointer", mergedClasses.label),
      },
      ...partsProps?.label,
    } satisfies Partial<LabelProps>;
  });

  const leftLabelProps = derived(() => {
    return {
      size: merged.size,
      htmlFor: controlId,
      error: labelError,
      required: merged.required,
      classes: {
        root: cn("cursor-pointer", mergedClasses.leftLabel),
      },
      ...partsProps?.leftLabel,
    } satisfies Partial<LabelProps>;
  });

  const descriptionBind = derived(() => {
    return mergePartBind(
      partsProps?.description,
      { id: `${controlId}-description` },
      cn({
        "mt-2 text-gray-500 dark:text-gray-400": true,
        [textSizeClass ?? ""]: true,
        [mergedClasses.description ?? ""]: true,
      }),
    );
  });

  const errorMessageBind = derived(() => {
    return mergePartBind(
      partsProps?.errorMessage,
      { id: `${controlId}-error` },
      cn({
        "mt-2 text-error-600 dark:text-error-400": true,
        "min-h-[1lh]": reservesErrorMessageSpace,
        [textSizeClass ?? ""]: true,
        [mergedClasses.errorMessage ?? ""]: true,
      }),
    );
  });

  const controlBind = derived(() => {
    return {
      id: controlId,
      disabled: isDisabled,
      readOnly: isReadonly,
      required: merged.required || undefined,
      "aria-invalid": invalidated || undefined,
      "aria-describedby": ariaDescribedBy,
    } satisfies Partial<InputHTMLAttributes<HTMLInputElement>>;
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
    ariaDescribedBy,
    withValidationColors,
    showErrorMessageContent,
    reservesErrorMessageSpace,
  };
}

export type UseSwitcherReturn = ReturnType<typeof useSwitcher>;
