// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import {
  useCallback,
  useMemo,
  type InputEvent,
  type TextareaHTMLAttributes,
} from "react";

// ** Core Imports
import {
  adjustAutosizeTextareaHeight,
  cn,
  mergeBridgeUILayeredClasses,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { resizeProps } from "@bridge-ui/core/Components/Textarea";

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
    classes,
    onInput,
    rows: rowsProp,
    resize: resizeProp,
    autosize: autosizeProp,
    likeInput: likeInputProp,
    ...rest
  } = props;

  const likeInput = Boolean(likeInputProp);

  const registryProps = useMemo((): TextareaRegistryProps => {
    return {
      classes,
      resize: resizeProp,
      autosize: autosizeProp,
    };
  }, [classes, resizeProp, autosizeProp]);

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

  const autosize = derived((): boolean => {
    if (likeInput) {
      return autosizeProp ?? true;
    }

    return textareaMerged.autosize ?? false;
  });

  const rows = derived((): TextareaProps["rows"] => {
    if (likeInput) {
      return rowsProp ?? 1;
    }

    return rowsProp;
  });

  const resize = derived((): TextareaProps["resize"] => {
    if (autosize) {
      return "none";
    }

    return textareaMerged.resize ?? "none";
  });

  const resizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      resizeProps,
      bridgeTextarea?.customProps?.resize,
    );

    return get(classes, resize ?? "none");
  }, [resize, bridgeTextarea?.customProps?.resize]);

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
    {
      control: () => "textarea",
      likeInput: () => likeInput,
    },
  );

  const adjustHeight = useCallback(
    (element: null | HTMLTextAreaElement) => {
      if (!element || !autosize) {
        return;
      }

      adjustAutosizeTextareaHeight(element);
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
    (element: null | HTMLTextAreaElement) => {
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
          ...(!isNil(rows) ? { rows } : {}),
          ...(autosize ? { onInput: handleAutosize } : {}),
        },
        cn({
          "flex-1 min-w-0": likeInput,
          "overflow-hidden": autosize,
          "min-w-0 flex-none": !likeInput,
          [resizeClass ?? ""]: true,
        }),
      ) as TextareaHTMLAttributes<HTMLTextAreaElement>;
    },
  );

  return {
    formField,
    textareaBind,
  };
}
