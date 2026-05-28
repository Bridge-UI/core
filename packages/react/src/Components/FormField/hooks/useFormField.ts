// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { CircleAlert } from "lucide-react";
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
import {
  colorProps,
  roundedProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Components/FormField";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldOwnProps,
  FormFieldProps,
} from "@/Components/FormField/formField.types";
import {
  derived,
  hasNamedSlot,
  hasSlotOrProp,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export const formFieldBridgeKeys = [
  "end",
  "size",
  "color",
  "error",
  "label",
  "start",
  "corner",
  "classes",
  "endIcon",
  "rounded",
  "variant",
  "disabled",
  "readonly",
  "required",
  "errorIcon",
  "startIcon",
  "partsProps",
  "description",
  "errorMessage",
  "withErrorIcon",
] as const satisfies readonly (keyof FormFieldOwnProps)[];

type FormFieldLibDefaults = LibDefaultsShape<
  FormFieldOwnProps,
  "color" | "rounded" | "size" | "variant" | "errorIcon" | "withErrorIcon"
>;

type FormFieldMerged = MergeLibDefaults<
  FormFieldOwnProps,
  FormFieldLibDefaults
>;

export function useFormField(
  props: Omit<FormFieldProps, "field">,
  libDefaults: FormFieldLibDefaults,
) {
  // Setup
  const autoId = useId();

  const { customProps, inheritedAttrs } = splitComponentProps<
    Omit<FormFieldProps, "field">,
    typeof formFieldBridgeKeys
  >({
    props,
    bridgeKeys: formFieldBridgeKeys,
  });

  const { entry: bridgeFormField, merged } = useBridgeUIComponent<
    FormFieldMerged,
    "FormField"
  >({
    libDefaults,
    props: customProps,
    componentName: "FormField",
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

  const mergedClasses = useBridgeUIMergedRegistryClasses<FormFieldClasses>({
    props: customProps,
    entry: bridgeFormField,
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

  const variantKey = derived(() => {
    return merged.variant ?? "outline";
  });

  const errorIcon = derived(() => {
    return merged.errorIcon ?? CircleAlert;
  });

  const isNotched = derived(() => {
    return variantKey === "notched";
  });

  const isStacked = derived(() => {
    return variantKey === "stacked";
  });

  const isUnderlined = derived(() => {
    return variantKey === "underlined";
  });

  const controlId = derived(() => {
    return merged.controlId ?? inputInheritedAttrs.id ?? autoId;
  });

  const hasInsetLabelRow = derived(() => {
    return (
      (isNotched || isStacked) &&
      (hasSlotOrProp(slots, "label", merged.label) ||
        hasSlotOrProp(slots, "corner", merged.corner))
    );
  });

  const headerJustify = derived(() => {
    if (hasSlotOrProp(slots, "label", merged.label)) {
      return "justify-between items-end";
    }

    return "justify-end";
  });

  const ariaDescribedBy = derived(() => {
    const ids: string[] = [];

    if (
      !invalidated &&
      hasSlotOrProp(slots, "description", merged.description)
    ) {
      ids.push(`${controlId}-description`);
    }

    if (hasSlotOrProp(slots, "errorMessage", merged.errorMessage)) {
      ids.push(`${controlId}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  // Classes
  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeFormField?.customProps?.size,
    );

    return get(classes, [merged.size, merged.variant ?? "outline"]);
  }, [merged.size, merged.variant, bridgeFormField?.customProps?.size]);

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeFormField?.customProps?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeFormField?.customProps?.color]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeFormField?.customProps?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeFormField?.customProps?.rounded]);

  const variantClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeFormField?.customProps?.variant,
    );

    return get(classes, merged.variant ?? "outline");
  }, [merged.variant, bridgeFormField?.customProps?.variant]);

  const focusColorPalette = useMemo(() => {
    if (invalidated) {
      const classes = mergeBridgeUILayeredClasses(
        colorProps,
        bridgeFormField?.customProps?.color,
      );

      return get(classes, "error");
    }

    return colorClasses;
  }, [invalidated, colorClasses, bridgeFormField?.customProps?.color]);

  const containerColorFocus = derived(() => {
    if (isUnderlined) {
      return focusColorPalette?.underlined;
    }

    return focusColorPalette?.input;
  });

  const stackedBodySpacing = derived(() => {
    if (!isStacked) {
      return undefined;
    }

    if (!hasNamedSlot(slots, "start") && !hasNamedSlot(slots, "end")) {
      return undefined;
    }

    return cn({
      [sizeClasses?.insetStart ?? ""]: true,
      [sizeClasses?.insetEnd ?? ""]: true,
    });
  });

  const containerSpacing = derived(() => {
    const hasEndSlot = hasNamedSlot(slots, "end");
    const hasStartSlot = hasNamedSlot(slots, "start");

    if (isStacked) {
      if (!hasStartSlot && !hasEndSlot) {
        return sizeClasses?.padding;
      }

      return undefined;
    }

    if (!hasStartSlot && !hasEndSlot) {
      return sizeClasses?.padding;
    }

    return cn({
      [sizeClasses?.insetStart ?? ""]: !hasStartSlot,
      [sizeClasses?.insetEnd ?? ""]: !hasEndSlot,
    });
  });

  // Binds
  const endBind = derived(() => {
    return mergePartBind(
      partsProps?.end,
      {},
      cn({
        "shrink-0 self-center flex items-center whitespace-nowrap select-none pointer-events-none": true,
        "text-gray-500": !invalidated,
        [roundedClasses?.end ?? ""]: !isUnderlined && !isStacked,
        [colorClasses?.end ?? ""]: !invalidated,
        "group-data-[invalid]:text-error-500": true,
        "text-error-500": invalidated,
        [mergedClasses.end ?? ""]: true,
      }),
    );
  });

  const rootBind = derived(() => {
    return mergePartBind(
      partsProps?.root,
      {
        className: cn(inheritedAttrs.className),
        ...omit(inheritedAttrs, ["className", "slots", "children"]),
      },
      cn({
        "group w-full relative": true,
        "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60": true,
        "aria-readonly:pointer-events-none aria-readonly:select-none": true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const errorBind = derived(() => {
    return mergePartBind(
      partsProps?.errorMessage,
      {},
      cn({
        "mt-2 text-error-600 dark:text-error-400": true,
        [sizeClasses?.text ?? ""]: true,
        [mergedClasses.errorMessage ?? ""]: true,
      }),
    );
  });

  const inputBind = derived(() => {
    return mergePartBind(
      {
        ...partsProps?.input,
        id: controlId,
        disabled: isDisabled,
        readOnly: isReadonly,
        "aria-invalid": invalidated || undefined,
        "aria-describedby": ariaDescribedBy,
      },
      inputInheritedAttrs,
      cn({
        "flex-1 min-w-0 min-h-0 bg-transparent border-0 shadow-none": true,
        "h-full": !isStacked,
        "text-gray-900 dark:text-gray-100 placeholder:text-gray-400": true,
        "outline-none ring-0 focus:outline-none focus:ring-0": true,
        "disabled:cursor-not-allowed": true,
        [sizeClasses?.input ?? ""]: true,
        [mergedClasses.input ?? ""]: true,
      }),
    );
  });

  const labelBind = derived(() => {
    return mergePartBind(
      partsProps?.label,
      {},
      cn({
        "inline-flex items-center gap-x-0.5 font-medium leading-none": true,
        "text-error-600 dark:text-error-400": invalidated && !isNotched,
        "text-gray-700 dark:text-gray-300": !invalidated && !isNotched,
        [sizeClasses?.text ?? ""]: true,
        [variantClasses?.label ?? ""]: isNotched,
        [mergedClasses.label ?? ""]: true,
      }),
    );
  });

  const startBind = derived(() => {
    return mergePartBind(
      partsProps?.start,
      {},
      cn({
        "shrink-0 self-center flex items-center whitespace-nowrap select-none pointer-events-none": true,
        "text-gray-400": !invalidated,
        [roundedClasses?.start ?? ""]: !isUnderlined && !isStacked,
        [colorClasses?.start ?? ""]: !invalidated,
        "group-data-[invalid]:text-error-500": true,
        "text-error-500": invalidated,
        [mergedClasses.start ?? ""]: true,
      }),
    );
  });

  const cornerBind = derived(() => {
    return mergePartBind(
      partsProps?.corner,
      {},
      cn({
        "text-gray-500 dark:text-gray-400": !isNotched,
        [sizeClasses?.text ?? ""]: true,
        [variantClasses?.corner ?? ""]: isNotched,
        [mergedClasses.corner ?? ""]: true,
      }),
    );
  });

  const headerBind = derived(() => {
    return mergePartBind(
      partsProps?.header,
      {},
      cn({
        flex: true,
        "mb-1": true,
        [headerJustify]: true,
        [mergedClasses.header ?? ""]: true,
      }),
    );
  });

  const endIconBind = derived(() => {
    return mergePartBind(
      partsProps?.endIcon,
      {},
      cn({
        "inline-flex shrink-0 items-center justify-center self-center":
          isStacked,
      }),
    );
  });

  const endSlotBind = derived(() => {
    return mergePartBind(
      partsProps?.end,
      {},
      cn({
        "group/end wrapper-end-slot shrink-0 flex w-auto items-stretch self-stretch [&>*]:h-full [&>*]:min-h-0": true,
        "h-full min-h-0 py-0.5 pe-0.5": !isStacked,
        "[&>*]:w-full": isStacked,
        [mergedClasses.end ?? ""]: true,
      }),
    );
  });

  const requiredBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "text-error-500 dark:text-error-500 select-none": true,
        [mergedClasses.required ?? ""]: true,
      }),
    );
  });

  const stackedBodyBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "flex min-h-0 min-w-0 flex-1 flex-col": true,
        [stackedBodySpacing ?? ""]: true,
      }),
    );
  });

  const stackedInputRowBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "flex w-full min-w-0 flex-1 items-center gap-x-2": true,
        [sizeClasses?.controlRow ?? ""]: true,
      }),
    );
  });

  const containerBind = derived(() => {
    return mergePartBind(
      partsProps?.container,
      {
        "data-bridge-rounded": merged.rounded ?? "md",
      },
      cn({
        "group/field relative flex flex-row items-stretch overflow-hidden":
          isStacked,
        "group/field relative flex justify-start gap-x-2 items-stretch":
          !isStacked,
        "transition-all ease-in-out duration-150 outline-none": true,
        "bg-gray-100 dark:bg-gray-800": isDisabled && !invalidated,
        [sizeClasses?.container ?? ""]: true,
        [variantClasses?.container ?? ""]: true,
        [roundedClasses?.input ?? ""]: !isUnderlined,
        [containerSpacing ?? ""]: true,
        [containerColorFocus ?? ""]: true,
        "rounded-none": isUnderlined,
        "bg-error-50 ring-error-500 focus-within:ring-error-600 dark:ring-error-700 dark:bg-error-700/10 dark:ring-error-600 dark:focus-within:ring-error-600":
          invalidated && !isUnderlined,
        "border-error-500 focus-within:border-error-600 dark:border-error-600 dark:focus-within:border-error-600":
          invalidated && isUnderlined,
        [mergedClasses.container ?? ""]: true,
      }),
    );
  });

  const startIconBind = derived(() => {
    return mergePartBind(
      partsProps?.startIcon,
      {},
      cn({
        "inline-flex shrink-0 items-center justify-center self-center":
          isStacked,
      }),
    );
  });

  const startSlotBind = derived(() => {
    return mergePartBind(
      partsProps?.start,
      {},
      cn({
        "group/start wrapper-start-slot shrink-0 flex w-auto items-stretch self-stretch [&>*]:h-full [&>*]:min-h-0": true,
        "h-full min-h-0 py-0.5 ps-0.5": !isStacked,
        "[&>*]:w-full": isStacked,
        [mergedClasses.start ?? ""]: true,
      }),
    );
  });

  const descriptionBind = derived(() => {
    return mergePartBind(
      partsProps?.description,
      {},
      cn({
        "mt-2 text-gray-500 dark:text-gray-400": true,
        [sizeClasses?.text ?? ""]: true,
        [mergedClasses.description ?? ""]: true,
      }),
    );
  });

  const insetLabelRowBind = derived(() => {
    const hasLabel = hasSlotOrProp(slots, "label", merged.label);

    return mergePartBind(
      partsProps?.header,
      {},
      cn({
        flex: true,
        "w-full shrink-0": true,
        "justify-between": hasLabel,
        "justify-end": !hasLabel,
        "items-center": isNotched,
        "items-end": isStacked,
        [variantClasses?.labelRow ?? ""]: hasInsetLabelRow,
        [mergedClasses.header ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    endBind,
    rootBind,
    controlId,
    errorBind,
    errorIcon,
    inputBind,
    isNotched,
    isStacked,
    labelBind,
    startBind,
    cornerBind,
    headerBind,
    isDisabled,
    isReadonly,
    variantKey,
    endIconBind,
    endSlotBind,
    invalidated,
    requiredBind,
    containerBind,
    startIconBind,
    startSlotBind,
    ariaDescribedBy,
    descriptionBind,
    hasInsetLabelRow,
    insetLabelRowBind,
    stackedBodyBind,
    stackedInputRowBind,
  };
}

export type UseFormFieldReturn = ReturnType<typeof useFormField>;
