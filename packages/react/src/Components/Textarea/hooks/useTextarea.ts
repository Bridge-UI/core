// ** External Imports
import { get } from "es-toolkit/compat";
import {
  useCallback,
  useMemo,
  type InputEvent,
  type TextareaHTMLAttributes,
} from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { sizeProps as textareaSizeProps } from "@bridge-ui/core/Components/Textarea";

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

type TextareaRegistryProps = Pick<TextareaProps, "autosize" | "classes">;

type TextareaLibDefaults = LibDefaultsShape<TextareaRegistryProps, "autosize">;

type TextareaMerged = MergeLibDefaults<
  TextareaRegistryProps,
  TextareaLibDefaults
>;

export function useTextarea(props: TextareaProps) {
  const { autosize: autosizeProp, onInput, classes, ...rest } = props;

  const registryProps = useMemo((): TextareaRegistryProps => {
    return {
      classes,
      autosize: autosizeProp,
    };
  }, [autosizeProp, classes]);

  const { entry: bridgeTextarea, merged: textareaMerged } =
    useBridgeUIComponent<TextareaMerged, "Textarea">({
      componentName: "Textarea",
      props: registryProps,
      libDefaults: {
        autosize: false,
      },
    });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextareaClasses>({
    props: registryProps,
    entry: bridgeTextarea,
  });

  const autosize = textareaMerged.autosize ?? false;

  const formField = useFormField(
    {
      ...(rest as Omit<FormFieldProps, "field">),
      classes: mergedClasses,
      partsProps: {
        ...rest.partsProps,
        container: {
          ...rest.partsProps?.container,
          className: cn(
            "min-h-20 h-auto",
            rest.partsProps?.container?.className,
          ),
        },
      },
    },
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      withErrorIcon: true,
    },
  );

  const textareaSizeClass = useMemo(() => {
    const sizeClasses = mergeBridgeUILayeredClasses(
      textareaSizeProps,
      undefined,
    );

    return get(sizeClasses, formField.merged.size ?? "md")?.input;
  }, [formField.merged.size]);

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
          "resize-none overflow-hidden": autosize,
          "resize-y": !autosize,
          [textareaSizeClass ?? ""]: true,
        }),
      ) as TextareaHTMLAttributes<HTMLTextAreaElement>;
    },
  );

  return {
    formField,
    textareaBind,
  };
}
