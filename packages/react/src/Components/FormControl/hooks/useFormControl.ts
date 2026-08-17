// ** External Imports
import { get, omit } from "es-toolkit/compat";
import type { InputHTMLAttributes } from "react";
import { useId } from "react";

// ** Core Imports
import { labelSizeProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  FormControlClasses,
  FormControlOwnProps,
  FormControlProps,
} from "@/Components/FormControl/formControl.types";
import type { LabelProps } from "@/Components/Label/label.types";
import {
  derived,
  hasSlotOrProp,
  mergeNestedComponentProps,
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
  "startLabel",
  "customProps",
  "description",
  "errorMessage",
  "hideErrorMessage",
] as const satisfies readonly (keyof FormControlOwnProps)[];

type FormControlLibDefaults = LibDefaultsShape<
  FormControlOwnProps,
  "size" | "error" | "hideErrorMessage"
>;

type FormControlMerged = MergeLibDefaults<
  FormControlOwnProps,
  FormControlLibDefaults
>;

/**
 * Options for {@link useFormControl}.
 */
export type FormControlOptions = {
  /**
   * Public registry key that owns FormControl chrome defaults/tokens.
   */
  componentName?: "Radio" | "Switch" | "Checkbox";
};

export function useFormControl(
  props: Omit<FormControlProps, "field">,
  libDefaults: FormControlLibDefaults,
  options: FormControlOptions = {},
) {
  const autoId = useId();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    Omit<FormControlProps, "field">,
    typeof formControlBridgeKeys
  >({
    props,
    bridgeKeys: formControlBridgeKeys,
  });

  const { merged, entry: bridgeFormControl } = useBridgeUIComponent<
    FormControlMerged,
    NonNullable<FormControlOptions["componentName"]>
  >({
    libDefaults,
    props: componentProps,
    componentName: options.componentName,
  });

  const slots = derived(() => {
    return props.slots;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const inputInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [
      "slots",
      "children",
      "className",
    ]) as InputHTMLAttributes<HTMLInputElement>;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<FormControlClasses>({
    props: componentProps,
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

  const controlId = derived(() => {
    return merged.controlId ?? inputInheritedAttrs.id ?? autoId;
  });

  const reservesErrorMessageSpace = derived(() => {
    return !merged.hideErrorMessage;
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
      customProps?.root,
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
      customProps?.row,
      {},
      cn({
        "flex flex-row items-center gap-x-2": true,
        [mergedClasses.row ?? ""]: true,
      }),
    );
  });

  const fieldLabelProps = derived(() => {
    const buildLabelProps = (part: "endLabel" | "startLabel"): LabelProps => {
      return mergeNestedComponentProps(customProps?.[part], {
        size: merged.size,
        error: invalidated,
        htmlFor: controlId,
        required: merged.required,
        classes: {
          root: cn({
            "cursor-pointer": true,
            [mergedClasses[part] ?? ""]: true,
          }),
        },
      });
    };

    return {
      endLabel: buildLabelProps("endLabel"),
      startLabel: buildLabelProps("startLabel"),
    };
  });

  const descriptionBind = derived(() => {
    return mergePartBind(
      customProps?.description,
      { id: `${controlId}-description` },
      cn({
        "mt-2 text-dark-500 dark:text-dark-400": true,
        [textSizeClass ?? ""]: true,
        [mergedClasses.description ?? ""]: true,
      }),
    );
  });

  const errorMessageBind = derived(() => {
    return mergePartBind(
      customProps?.errorMessage,
      { id: `${controlId}-error` },
      cn({
        "mt-2": true,
        "min-h-[1lh]": reservesErrorMessageSpace,
        "text-error-600 dark:text-error-400": true,
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
    fieldLabelProps,
    ariaDescribedBy,
    descriptionBind,
    errorMessageBind,
    inputInheritedAttrs,
    showErrorMessageContent,
    reservesErrorMessageSpace,
  };
}

export type UseFormControlReturn = ReturnType<typeof useFormControl>;
