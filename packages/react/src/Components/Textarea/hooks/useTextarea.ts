// ** External Imports
import {
  useCallback,
  useMemo,
  type InputEvent,
  type TextareaHTMLAttributes,
} from "react";

// ** Core Imports
import {
  cn,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";

// ** Local Imports
import type { FormFieldProps } from "@/Components/FormField/formField.types";
import { useFormField } from "@/Components/FormField/hooks/useFormField";
import type {
  TextareaClasses,
  TextareaProps,
} from "@/Components/Textarea/textarea.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const resizeClassMap = {
  both: "resize",
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
} as const satisfies Record<NonNullable<TextareaProps["resize"]>, string>;

type TextareaRegistryProps = Pick<
  TextareaProps,
  "resize" | "classes" | "autosize"
>;

type TextareaLibDefaults = LibDefaultsShape<
  TextareaRegistryProps,
  "resize" | "autosize"
>;

type TextareaMerged = MergeLibDefaults<
  TextareaRegistryProps,
  TextareaLibDefaults
>;

export function useTextarea(props: TextareaProps) {
  const {
    autosize: autosizeProp,
    resize: resizeProp,
    onInput,
    classes,
    ...rest
  } = props;

  const registryProps = useMemo((): TextareaRegistryProps => {
    return {
      classes,
      resize: resizeProp,
      autosize: autosizeProp,
    };
  }, [autosizeProp, classes, resizeProp]);

  const { entry: bridgeTextarea, merged: textareaMerged } =
    useBridgeUIComponent<TextareaMerged, "Textarea">({
      props: registryProps,
      componentName: "Textarea",
      libDefaults: {
        resize: "none",
        autosize: false,
      },
    });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextareaClasses>({
    props: registryProps,
    entry: bridgeTextarea,
  });

  const autosize = textareaMerged.autosize ?? false;

  const resize = derived((): TextareaProps["resize"] => {
    if (autosize) {
      return "none";
    }

    return textareaMerged.resize ?? "none";
  });

  const formField = useFormField(
    {
      ...(rest as Omit<FormFieldProps, "field">),
      classes: mergedClasses,
    },
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      withErrorIcon: true,
    },
    { control: () => "textarea" },
  );

  const adjustHeight = useCallback(
    (element: HTMLTextAreaElement | null) => {
      if (!element || !autosize) {
        return;
      }

      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    },
    [autosize],
  );

  const handleAutosize = useCallback(
    (event: InputEvent<HTMLTextAreaElement>) => {
      adjustHeight(event.currentTarget);

      onInput?.(event);
    },
    [adjustHeight, onInput],
  );

  const textareaRef = useCallback(
    (element: HTMLTextAreaElement | null) => {
      adjustHeight(element);
    },
    [adjustHeight],
  );

  const textareaBind = derived(
    (): TextareaHTMLAttributes<HTMLTextAreaElement> => {
      return mergePartBind(
        formField.inputBind,
        {
          ref: textareaRef,
          ...(autosize ? { onInput: handleAutosize } : {}),
        },
        cn({
          "min-w-0 flex-none": true,
          "overflow-hidden": autosize,
          [resizeClassMap[resize ?? "none"]]: true,
        }),
      ) as TextareaHTMLAttributes<HTMLTextAreaElement>;
    },
  );

  return {
    formField,
    textareaBind,
  };
}
