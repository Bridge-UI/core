// ** External Imports
import { get, isNil, isString, omit } from "es-toolkit/compat";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
} from "react";

// ** Core Imports
import {
  DEFAULT_RICH_TEXT_TOOLS,
  RICH_TEXT_TOOL_ICONS,
  RICH_TEXT_TOOL_LABELS,
  type RichTextEditorHandle,
  type RichTextFormat,
  type RichTextTool,
  type RichTextValue,
} from "@bridge-ui/core/Adapters";
import { richTextEditorSizeProps as sizeProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { useRichTextAdapter } from "@/Adapters/RichText";
import type { ButtonProps } from "@/Components/Button/button.types";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/hooks/useFormField";
import type {
  RichTextEditorClasses,
  RichTextEditorCustomProps,
  RichTextEditorOwnProps,
  RichTextEditorProps,
} from "@/Components/RichTextEditor/richTextEditor.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const richTextEditorBridgeKeys = [
  "tools",
  "value",
  "format",
  "classes",
  "onChange",
  "readOnly",
  "customProps",
  "placeholder",
] as const satisfies readonly (keyof RichTextEditorProps)[];

type RichTextEditorRegistryProps = Pick<
  RichTextEditorOwnProps,
  "size" | "color" | "tools" | "format" | "classes" | "rounded" | "variant"
>;

type RichTextEditorLibDefaults = LibDefaultsShape<
  RichTextEditorRegistryProps,
  "size" | "color" | "format" | "rounded" | "variant"
>;

type RichTextEditorMerged = MergeLibDefaults<
  RichTextEditorRegistryProps,
  RichTextEditorLibDefaults
>;

/**
 * Compares controlled values for sync (HTML string or JSON document).
 */
function richTextValuesEqual(
  a: undefined | RichTextValue,
  b: undefined | RichTextValue,
): boolean {
  if (a === b) {
    return true;
  }

  if (isNil(a) || isNil(b)) {
    return false;
  }

  if (isString(a) || isString(b)) {
    return a === b;
  }

  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

export function useRichTextEditor(props: RichTextEditorProps) {
  const resolveMessage = useResolveMessage();
  const adapter = useRichTextAdapter();

  const contentRef = useRef<null | HTMLDivElement>(null);
  const handleRef = useRef<null | RichTextEditorHandle>(null);
  const onChangeRef = useRef(props.onChange);
  const [contentEl, setContentEl] = useState<null | HTMLDivElement>(null);
  const [, setSelectionTick] = useState(0);

  onChangeRef.current = props.onChange;

  const {
    slots,
    value: valueProp,
    onChange: _onChange,
    ...propsForSplit
  } = props;

  const { inheritedAttrs, componentProps: rteOnly } = splitComponentProps<
    RichTextEditorProps,
    typeof richTextEditorBridgeKeys
  >({
    bridgeKeys: richTextEditorBridgeKeys,
    props: propsForSplit as RichTextEditorProps,
  });

  const inherited = derived(() => {
    return omit(inheritedAttrs, ["className", "onChange"]);
  });

  const {
    componentProps: formFieldCustom,
    inheritedAttrs: formFieldInherited,
  } = splitComponentProps<
    Omit<FormFieldOwnProps, "field">,
    typeof formFieldBridgeKeys
  >({
    bridgeKeys: formFieldBridgeKeys,
    props: inherited as Omit<FormFieldOwnProps, "field">,
  });

  const {
    content: _contentCustom,
    toolbar: _toolbarCustom,
    toolbarButton: toolbarButtonCustom,
    ...formFieldOnlyCustom
  } = (rteOnly.customProps ?? {}) as RichTextEditorCustomProps;

  const registryProps = useMemo((): RichTextEditorRegistryProps => {
    return {
      tools: rteOnly.tools,
      format: rteOnly.format,
      classes: rteOnly.classes,
      size: formFieldCustom.size,
      color: formFieldCustom.color,
      rounded: formFieldCustom.rounded,
      variant: formFieldCustom.variant,
    };
  }, [
    formFieldCustom.color,
    formFieldCustom.rounded,
    formFieldCustom.size,
    formFieldCustom.variant,
    rteOnly.classes,
    rteOnly.format,
    rteOnly.tools,
  ]);

  const { merged: rteMerged, entry: bridgeRichText } = useBridgeUIComponent<
    RichTextEditorMerged,
    "RichTextEditor"
  >({
    props: registryProps,
    componentName: "RichTextEditor",
    libDefaults: {
      size: "md",
      rounded: "md",
      format: "html",
      color: "primary",
      variant: "outline",
    },
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<RichTextEditorClasses>(
    {
      props: registryProps,
      entry: bridgeRichText,
    },
  );

  const format = derived((): RichTextFormat => {
    return rteMerged.format ?? "html";
  });

  const tools = derived((): RichTextTool[] => {
    return [...(rteOnly.tools ?? rteMerged.tools ?? DEFAULT_RICH_TEXT_TOOLS)];
  });

  const isReadOnly = derived(() => {
    return rteOnly.readOnly === true || formFieldCustom.readonly === true;
  });

  const showToolbar = derived(() => {
    return (
      !(isReadOnly || formFieldCustom.disabled === true) && tools.length > 0
    );
  });

  const sizeToken = derived(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeRichText?.tokens?.size,
    );

    return get(classes, formFieldCustom.size ?? rteMerged.size ?? "md");
  });

  const formField = useFormField(
    {
      ...formFieldInherited,
      ...formFieldCustom,
      slots,
      classes: mergedClasses,
      customProps: formFieldOnlyCustom,
      readonly: isReadOnly || formFieldCustom.readonly,
    },
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      showErrorIcon: true,
    },
    {
      control: () => "textarea",
      componentName: "RichTextEditor",
    },
  );

  const bumpSelection = useCallback(() => {
    setSelectionTick((tick) => tick + 1);
  }, []);

  useEffect(() => {
    if (isNil(contentEl)) {
      return;
    }

    if (isNil(adapter)) {
      throw new Error(
        "[BridgeUI] RichTextEditor requires BridgeUIProvider global.richText. See packages/{react,vue}/Adapters/Examples/rich-text-tiptap.",
      );
    }

    const handle = adapter.mount({
      tools,
      format,
      value: valueProp,
      element: contentEl,
      readOnly: isReadOnly,
      disabled: formField.isDisabled,
      placeholder: rteOnly.placeholder,
      onSelectionChange: bumpSelection,
      onChange: (next) => {
        onChangeRef.current?.(next);
      },
    });

    handleRef.current = handle;

    return () => {
      handle.destroy();
      handleRef.current = null;
    };
    // Mount once per host / adapter / format; controlled value syncs below.
  }, [adapter, contentEl, format, bumpSelection]);

  useEffect(() => {
    const handle = handleRef.current;

    if (isNil(handle) || valueProp === undefined) {
      return;
    }

    if (!richTextValuesEqual(handle.getValue(), valueProp)) {
      handle.setValue(valueProp);
    }
  }, [valueProp, format]);

  useEffect(() => {
    handleRef.current?.setDisabled(formField.isDisabled);
  }, [formField.isDisabled]);

  useEffect(() => {
    handleRef.current?.setReadOnly(isReadOnly);
  }, [isReadOnly]);

  const contentRefCallback = useCallback((element: null | HTMLDivElement) => {
    contentRef.current = element;
    setContentEl(element);
  }, []);

  const toolbarBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return mergePartBind(
      rteOnly.customProps?.toolbar,
      {
        role: "toolbar",
        "aria-label": resolveMessage("Formatting"),
      },
      cn({
        [sizeToken?.toolbar ?? ""]: true,
        [mergedClasses.toolbar ?? ""]: true,
      }),
    );
  });

  const contentBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return mergePartBind(
      rteOnly.customProps?.content,
      {
        role: "textbox",
        "aria-multiline": true,
        ref: contentRefCallback,
        id: formField.controlId,
        "aria-readonly": isReadOnly || undefined,
        "aria-describedby": formField.ariaDescribedBy,
        "aria-disabled": formField.isDisabled || undefined,
        "aria-invalid": formField.invalidated || undefined,
      },
      cn({
        "min-w-0 flex-1": true,
        [sizeToken?.content ?? ""]: true,
        [mergedClasses.content ?? ""]: true,
        [mergedClasses.input ?? ""]: true,
      }),
    ) as HTMLAttributes<HTMLDivElement>;
  });

  const getToolbarButtonBind = useCallback(
    (tool: RichTextTool): ButtonProps => {
      const handle = handleRef.current;
      const label = resolveMessage(RICH_TEXT_TOOL_LABELS[tool]);

      const onClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (isNil(handle)) {
          return;
        }

        if (tool === "link") {
          if (handle.isActive("link")) {
            handle.run("link");
          } else {
            const href = window.prompt(resolveMessage("URL"));

            if (!isNil(href) && href.length > 0) {
              handle.run("link", { href });
            }
          }

          bumpSelection();
          return;
        }

        handle.run(tool);
        bumpSelection();
      };

      return mergePartBind(
        toolbarButtonCustom,
        {
          onClick,
          type: "button",
          density: "mini",
          variant: "flat",
          "aria-label": label,
          icon: RICH_TEXT_TOOL_ICONS[tool],
          selected: handle?.isActive(tool) ?? false,
          disabled:
            formField.isDisabled || isReadOnly || !(handle?.can(tool) ?? true),
        },
        cn({
          [sizeToken?.toolbarButton ?? ""]: true,
          [mergedClasses.toolbarButton ?? ""]: true,
        }),
      ) as ButtonProps;
    },
    [
      bumpSelection,
      formField.isDisabled,
      isReadOnly,
      mergedClasses.toolbarButton,
      resolveMessage,
      sizeToken?.toolbarButton,
      toolbarButtonCustom,
    ],
  );

  return {
    slots,
    tools,
    format,
    formField,
    isReadOnly,
    contentBind,
    toolbarBind,
    showToolbar,
    getToolbarButtonBind,
  };
}
