// ** External Imports
import { get, omit } from "es-toolkit/compat";
import type { InputHTMLAttributes } from "react";
import { useId } from "react";

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
  FormControlClasses,
  FormControlOwnProps,
  FormControlProps,
} from "@/Components/FormControl/formControl.types";
import {
  derived,
  hasSlotOrProp,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export const formControlBridgeKeys = [
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
] as const satisfies readonly (keyof FormControlOwnProps)[];

type FormControlLibDefaults = LibDefaultsShape<
  FormControlOwnProps,
  "size" | "error" | "withoutErrorMessage"
>;

type FormControlMerged = MergeLibDefaults<
  FormControlOwnProps,
  FormControlLibDefaults
>;

export function useFormControl(
  props: Omit<FormControlProps, "field">,
  libDefaults: FormControlLibDefaults,
) {
  const autoId = useId();

  const { customProps, inheritedAttrs } = splitComponentProps<
    Omit<FormControlProps, "field">,
    typeof formControlBridgeKeys
  >({
    props,
    bridgeKeys: formControlBridgeKeys,
  });

  const { merged, entry: bridgeFormControl } = useBridgeUIComponent<
    FormControlMerged,
    "FormControl"
  >({
    libDefaults,
    props: customProps,
    componentName: "FormControl",
  });

  const slots = derived(() => {
    return props.slots;
  });

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const inputInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [
      "slots",
      "children",
      "className",
    ]) as InputHTMLAttributes<HTMLInputElement>;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<FormControlClasses>({
    props: customProps,
    entry: bridgeFormControl,
  });

  const invalidated = derived(() => {
    return merged.error === true;
  });

  const isDisabled = derived(() => {
    return Boolean(merged.disabled);
  });

  const isReadonly = derived(() => {
    return Boolean(merged.readonly);
  });

  const labelError = derived(() => {
    return invalidated;
  });

  const controlId = derived(() => {
    return merged.controlId ?? inputInheritedAttrs.id ?? autoId;
  });

  const reservesErrorMessageSpace = derived(() => {
    return !merged.withoutErrorMessage;
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

  const textSizeClass = derived(() => {
    return get(labelSizeProps, merged.size ?? "md");
  });

  const rootBind = derived(() => {
    return mergePartBind(
      partsProps?.root,
      {
        className: cn(inheritedAttrs.className),
      },
      cn({
        "group/form-control relative w-full": true,
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

  const startLabelBind = derived(() => {
    return mergePartBind(
      partsProps?.startLabel,
      { htmlFor: controlId },
      cn({
        "inline-flex cursor-pointer items-center gap-x-0.5 font-medium leading-none": true,
        [textSizeClass ?? ""]: true,
        "text-gray-700 dark:text-gray-300": !labelError,
        "text-error-600 dark:text-error-400": labelError,
        [mergedClasses.startLabel ?? ""]: true,
      }),
    );
  });

  const mainLabelBind = derived(() => {
    return mergePartBind(
      partsProps?.mainLabel,
      { htmlFor: controlId },
      cn({
        "inline-flex cursor-pointer items-center gap-x-0.5 font-medium leading-none": true,
        [textSizeClass ?? ""]: true,
        "text-gray-700 dark:text-gray-300": !labelError,
        "text-error-600 dark:text-error-400": labelError,
        [mergedClasses.mainLabel ?? ""]: true,
      }),
    );
  });

  const endLabelBind = derived(() => {
    return mergePartBind(
      partsProps?.endLabel,
      { htmlFor: controlId },
      cn({
        "inline-flex cursor-pointer items-center gap-x-0.5 font-medium leading-none": true,
        [textSizeClass ?? ""]: true,
        "text-gray-700 dark:text-gray-300": !labelError,
        "text-error-600 dark:text-error-400": labelError,
        [mergedClasses.endLabel ?? ""]: true,
      }),
    );
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
      "aria-describedby": ariaDescribedBy,
      required: merged.required || undefined,
      "aria-invalid": invalidated || undefined,
    } satisfies Partial<InputHTMLAttributes<HTMLInputElement>>;
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
    ariaDescribedBy,
    descriptionBind,
    errorMessageBind,
    inputInheritedAttrs,
    showErrorMessageContent,
    reservesErrorMessageSpace,
  };
}

export type UseFormControlReturn = ReturnType<typeof useFormControl>;
