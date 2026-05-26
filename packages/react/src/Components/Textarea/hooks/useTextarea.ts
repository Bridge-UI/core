// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useCallback, useMemo, useRef, type InputEvent } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { sizeProps } from "@bridge-ui/core/Components/Textarea";
import {
  colorProps,
  roundedProps,
  variantProps,
} from "@bridge-ui/core/Components/TextField";

// ** Local Imports
import { useFormField } from "@/Components/FormField/hooks/useFormField";
import type {
  TextareaClasses,
  TextareaOwnProps,
  TextareaPartsProps,
  TextareaProps,
} from "@/Components/Textarea/textarea.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const textareaBridgeKeys = [
  "size",
  "color",
  "error",
  "label",
  "slots",
  "corner",
  "classes",
  "rounded",
  "variant",
  "autosize",
  "disabled",
  "readonly",
  "required",
  "partsProps",
  "description",
  "errorMessage",
] as const satisfies readonly (keyof TextareaOwnProps)[];

type TextareaLibDefaults = LibDefaultsShape<
  TextareaOwnProps,
  "color" | "rounded" | "size" | "variant"
>;

type TextareaMerged = MergeLibDefaults<TextareaOwnProps, TextareaLibDefaults>;

export function useTextarea(
  props: TextareaProps,
  libDefaults: TextareaLibDefaults,
) {
  // Setup
  const { customProps, inheritedAttrs } = splitComponentProps<
    TextareaProps,
    typeof textareaBridgeKeys
  >({
    props,
    bridgeKeys: textareaBridgeKeys,
  });

  const { entry: bridgeTextarea, merged } = useBridgeUIComponent<
    TextareaMerged,
    "Textarea"
  >({
    libDefaults,
    props: customProps,
    componentName: "Textarea",
  });

  const rootClassAttr = derived(() => {
    return inheritedAttrs.className;
  });

  const textareaInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["onInput", "className"]);
  });

  const formField = useFormField(
    customProps,
    {
      size: libDefaults.size,
    },
    {
      rootClassName: () => rootClassAttr,
      controlId: () => textareaInheritedAttrs.id,
    },
  );

  const partsProps = derived((): TextareaPartsProps | undefined => {
    return merged.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextareaClasses>({
    props: customProps,
    entry: bridgeTextarea,
  });

  // Classes
  const variantClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTextarea?.customProps?.variant,
    );

    return get(classes, merged.variant);
  }, [merged.variant, bridgeTextarea?.customProps?.variant]);

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTextarea?.customProps?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeTextarea?.customProps?.color]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeTextarea?.customProps?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeTextarea?.customProps?.rounded]);

  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTextarea?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeTextarea?.customProps?.size]);

  // Elements
  const isUnderlined = derived(() => {
    return merged.variant === "underlined";
  });

  const textareaId = formField.controlId;
  const isDisabled = formField.isDisabled;
  const isReadonly = formField.isReadonly;
  const invalidated = formField.invalidated;

  const focusColorPalette = useMemo(() => {
    if (merged.error === true) {
      const classes = mergeBridgeUILayeredClasses(
        colorProps,
        bridgeTextarea?.customProps?.color,
      );

      return get(classes, "error");
    }

    return colorClasses;
  }, [colorClasses, merged.error, bridgeTextarea?.customProps?.color]);

  const containerColorFocus = derived(() => {
    if (isUnderlined) {
      return focusColorPalette?.underlined;
    }

    return focusColorPalette?.input;
  });

  const inheritedOnInput = inheritedAttrs.onInput;

  const autosizeRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = useCallback(
    (element: HTMLTextAreaElement | null) => {
      if (!element || !merged.autosize) {
        return;
      }

      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    },
    [merged.autosize],
  );

  const handleAutosize = useCallback(
    (event: InputEvent<HTMLTextAreaElement>) => {
      adjustHeight(event.currentTarget);
      inheritedOnInput?.(event);
    },
    [adjustHeight, inheritedOnInput],
  );

  const textareaRef = useCallback(
    (element: HTMLTextAreaElement | null) => {
      autosizeRef.current = element;
      adjustHeight(element);
    },
    [adjustHeight],
  );

  // prettier-ignore
  const textareaBind = derived(() => {
    return mergePartBind({
      ...partsProps?.input,
      id: textareaId,
      ref: textareaRef,
      disabled: isDisabled,
      readOnly: isReadonly,
      "aria-invalid": invalidated || undefined,
      "aria-describedby": formField.ariaDescribedBy,
      onInput: merged.autosize ? handleAutosize : inheritedOnInput,
    }, textareaInheritedAttrs, cn({
      // Theme classes
      "w-full min-w-0 bg-transparent border-0 shadow-none resize-none overflow-hidden": merged.autosize,
      "w-full min-w-0 bg-transparent border-0 shadow-none resize-y": !merged.autosize,
      "text-gray-900 dark:text-gray-100 placeholder:text-gray-400": true,
      "outline-none ring-0 focus:outline-none focus:ring-0": true,
      "disabled:cursor-not-allowed": true,
      [sizeClasses?.input ?? ""]: true,
      // Custom classes
      [mergedClasses.input ?? ""]: true,
    }));
  });

  // prettier-ignore
  const containerBind = derived(() => {
    return mergePartBind(partsProps?.container, {}, cn({
      // Theme classes
      "group/field relative w-full": true,
      "bg-gray-100 dark:bg-gray-800": isDisabled && !invalidated,
      "transition-all ease-in-out duration-150": true,
      [roundedClasses?.input ?? ""]: !isUnderlined,
      [variantClasses?.container ?? ""]: true,
      [variantClasses?.input ?? ""]: true,
      [containerColorFocus ?? ""]: true,
      "rounded-none": isUnderlined,
      "outline-none": true,
      // Error classes
      "bg-error-50 ring-error-500 focus-within:ring-error-600 dark:ring-error-700 dark:bg-error-700/10 dark:ring-error-600 dark:focus-within:ring-error-600": invalidated && !isUnderlined,
      "border-error-500 focus-within:border-error-600 dark:border-error-600 dark:focus-within:border-error-600": invalidated && isUnderlined,
      // Custom classes
      [mergedClasses.container ?? ""]: true,
    }));
  });

  return {
    merged,
    formField,
    isDisabled,
    isReadonly,
    invalidated,
    textareaBind,
    containerBind,
    rootBind: formField.rootBind,
  };
}
