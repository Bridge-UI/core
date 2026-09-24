// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
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
  richTextValuesEqual,
  type RichTextEditorHandle,
  type RichTextFormat,
  type RichTextTool,
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

export function useRichTextEditor(props: RichTextEditorProps) {
  const resolveMessage = useResolveMessage();
  const adapter = useRichTextAdapter();

  const [, setSelectionTick] = useState(0);
  const onChangeRef = useRef(props.onChange);
  const [linkHref, setLinkHref] = useState("");
  const hostRef = useRef<null | HTMLDivElement>(null);
  const surfaceRef = useRef<null | HTMLDivElement>(null);
  const handleRef = useRef<null | RichTextEditorHandle>(null);
  const [linkAnchor, setLinkAnchor] = useState<null | HTMLElement>(null);
  const [surfaceEl, setSurfaceEl] = useState<null | HTMLDivElement>(null);

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
    rteOnly.tools,
    rteOnly.format,
    rteOnly.classes,
    formFieldCustom.size,
    formFieldCustom.color,
    formFieldCustom.rounded,
    formFieldCustom.variant,
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

  const toolbarColor = derived(() => {
    if (formField.invalidated) {
      return "error";
    }

    return formField.merged.color ?? "primary";
  });

  const isToolbarButtonDisabled = useCallback(
    (tool: RichTextTool) => {
      if (formField.isDisabled) {
        return true;
      }

      if (isReadOnly) {
        return true;
      }

      if (!(handleRef.current?.can(tool) ?? true)) {
        return true;
      }

      return false;
    },
    [isReadOnly, formField.isDisabled],
  );

  const bumpSelection = useCallback(() => {
    setSelectionTick((tick) => tick + 1);
  }, []);

  const closeLinkEditor = useCallback(() => {
    setLinkHref("");
    setLinkAnchor(null);
  }, []);

  const confirmLink = useCallback(() => {
    const href = linkHref.trim();

    if (href.length === 0) {
      return;
    }

    handleRef.current?.run("link", { href });
    bumpSelection();
    closeLinkEditor();
  }, [linkHref, bumpSelection, closeLinkEditor]);

  useEffect(() => {
    if (!showToolbar) {
      closeLinkEditor();
    }
  }, [showToolbar, closeLinkEditor]);

  useLayoutEffect(() => {
    if (isNil(surfaceEl)) {
      return;
    }

    if (isNil(adapter)) {
      throw new Error(
        "[BridgeUI] RichTextEditor requires BridgeUIProvider global.richText. See packages/{react,vue}/Adapters/Examples/rich-text-tiptap.",
      );
    }

    // Host is outside React's child fiber so TipTap DOM survives re-renders
    // and FormField chrome class updates without React wiping `.ProseMirror`.
    const host = document.createElement("div");
    host.className = "flex min-h-0 min-w-0 w-full flex-1 flex-col outline-none";
    surfaceEl.appendChild(host);
    hostRef.current = host;

    const handle = adapter.mount({
      tools,
      format,
      element: host,
      value: valueProp,
      readOnly: isReadOnly,
      id: formField.controlId,
      ariaReadonly: isReadOnly,
      disabled: formField.isDisabled,
      placeholder: rteOnly.placeholder,
      onSelectionChange: bumpSelection,
      ariaDisabled: formField.isDisabled,
      ariaInvalid: formField.invalidated,
      ariaDescribedBy: formField.ariaDescribedBy,
      onChange: (next) => {
        onChangeRef.current?.(next);
      },
    });

    handleRef.current = handle;

    return () => {
      handle.destroy();
      handleRef.current = null;
      hostRef.current = null;
      host.remove();
    };
    // Mount once per surface / adapter / format; controlled value syncs below.
  }, [format, adapter, surfaceEl, bumpSelection]);

  useEffect(() => {
    const handle = handleRef.current;

    if (isNil(handle) || valueProp === undefined) {
      return;
    }

    if (!richTextValuesEqual(handle.getValue(), valueProp)) {
      handle.setValue(valueProp);
    }
  }, [format, valueProp]);

  useEffect(() => {
    handleRef.current?.setDisabled(formField.isDisabled);
  }, [formField.isDisabled]);

  useEffect(() => {
    handleRef.current?.setReadOnly(isReadOnly);
  }, [isReadOnly]);

  useEffect(() => {
    handleRef.current?.setA11y({
      id: formField.controlId,
      ariaReadonly: isReadOnly,
      placeholder: rteOnly.placeholder,
      ariaDisabled: formField.isDisabled,
      ariaInvalid: formField.invalidated,
      ariaDescribedBy: formField.ariaDescribedBy,
    });
  }, [
    isReadOnly,
    formField.controlId,
    formField.isDisabled,
    rteOnly.placeholder,
    formField.invalidated,
    formField.ariaDescribedBy,
  ]);

  const surfaceRefCallback = useCallback((element: null | HTMLDivElement) => {
    surfaceRef.current = element;
    setSurfaceEl(element);
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
        ref: surfaceRefCallback,
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

        const current = handleRef.current;

        if (isNil(current)) {
          return;
        }

        if (tool === "link") {
          if (current.isActive("link")) {
            current.run("link");
            bumpSelection();
            closeLinkEditor();
            return;
          }

          setLinkHref("");
          setLinkAnchor(event.currentTarget);
          return;
        }

        current.run(tool);
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
          color: toolbarColor,
          icon: RICH_TEXT_TOOL_ICONS[tool],
          size: formField.merged.size ?? "md",
          disabled: isToolbarButtonDisabled(tool),
          rounded: formField.merged.rounded ?? "md",
          selected: handle?.isActive(tool) ?? false,
          onMouseDown: (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
          },
        },
        cn({
          [sizeToken?.toolbarButton ?? ""]: true,
          [mergedClasses.toolbarButton ?? ""]: true,
        }),
      ) as ButtonProps;
    },
    [
      toolbarColor,
      bumpSelection,
      resolveMessage,
      closeLinkEditor,
      toolbarButtonCustom,
      formField.merged.size,
      isToolbarButtonDisabled,
      sizeToken?.toolbarButton,
      formField.merged.rounded,
      mergedClasses.toolbarButton,
    ],
  );

  const canConfirmLink = linkHref.trim().length > 0;
  const linkUrlLabel = resolveMessage("URL");

  return {
    slots,
    tools,
    format,
    linkHref,
    formField,
    linkAnchor,
    isReadOnly,
    contentBind,
    confirmLink,
    toolbarBind,
    showToolbar,
    setLinkHref,
    linkUrlLabel,
    canConfirmLink,
    closeLinkEditor,
    getToolbarButtonBind,
  };
}
