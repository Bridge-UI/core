// ** External Imports
import { get, isNil, isString, omit } from "es-toolkit/compat";
import {
  computed,
  onBeforeUnmount,
  ref,
  useAttrs,
  useSlots,
  watch,
  type Ref,
  type SetupContext,
} from "vue";

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
import type { ButtonOwnProps } from "@/Components/Button/button.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import type {
  RichTextEditorCustomProps,
  RichTextEditorEmits,
  RichTextEditorOwnProps,
} from "@/Components/RichTextEditor/richTextEditor.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const richTextEditorBridgeKeys = [
  "tools",
  "format",
  "classes",
  "readOnly",
  "customProps",
  "placeholder",
  "defaultValue",
] as const satisfies readonly (keyof RichTextEditorOwnProps)[];

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

/**
 * Composes FormField chrome + rich-text adapter surface for Vue.
 */
export function useRichTextEditor(
  props: RichTextEditorOwnProps,
  model: Ref<undefined | RichTextValue>,
  emit: SetupContext<RichTextEditorEmits>["emit"],
  contentRef: Ref<null | undefined | HTMLDivElement>,
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const resolveMessage = useResolveMessage();
  const adapter = useRichTextAdapter();

  const handleRef = ref<null | RichTextEditorHandle>(null);
  const selectionTick = ref(0);

  const split = computed(() => {
    return splitComponentProps<
      RichTextEditorOwnProps & Record<string, unknown>,
      typeof richTextEditorBridgeKeys
    >({
      bridgeKeys: richTextEditorBridgeKeys,
      props: { ...props, ...attrs } as RichTextEditorOwnProps &
        Record<string, unknown>,
    });
  });

  const rteOnly = computed(() => {
    return split.value.componentProps;
  });

  const formFieldSplit = computed(() => {
    return splitComponentProps<
      Omit<FormFieldOwnProps, "field">,
      typeof formFieldBridgeKeys
    >({
      bridgeKeys: formFieldBridgeKeys,
      props: omit(split.value.inheritedAttrs, [
        "class",
        "onUpdate:modelValue",
      ]) as Omit<FormFieldOwnProps, "field">,
    });
  });

  const formFieldCustom = computed(() => {
    return formFieldSplit.value.componentProps;
  });

  const formFieldInherited = computed(() => {
    return formFieldSplit.value.inheritedAttrs;
  });

  const formFieldOnlyCustom = computed(() => {
    const {
      content: _content,
      toolbar: _toolbar,
      toolbarButton: _toolbarButton,
      ...rest
    } = (rteOnly.value.customProps ?? {}) as RichTextEditorCustomProps;

    return rest;
  });

  const toolbarButtonCustom = computed(() => {
    return rteOnly.value.customProps?.toolbarButton;
  });

  const registryProps = computed((): RichTextEditorRegistryProps => {
    return {
      tools: rteOnly.value.tools,
      format: rteOnly.value.format,
      classes: rteOnly.value.classes,
      size: formFieldCustom.value.size,
      color: formFieldCustom.value.color,
      rounded: formFieldCustom.value.rounded,
      variant: formFieldCustom.value.variant,
    };
  });

  const { merged: rteMerged, entry: bridgeRichText } = useBridgeUIComponent<
    RichTextEditorMerged,
    "RichTextEditor"
  >({
    componentName: "RichTextEditor",
    props: () => registryProps.value,
    libDefaults: {
      size: "md",
      rounded: "md",
      format: "html",
      color: "primary",
      variant: "outline",
    },
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeRichText,
    props: () => registryProps.value,
  });

  const format = computed((): RichTextFormat => {
    return rteMerged.value.format ?? "html";
  });

  const tools = computed((): RichTextTool[] => {
    return [
      ...(rteOnly.value.tools ??
        rteMerged.value.tools ??
        DEFAULT_RICH_TEXT_TOOLS),
    ];
  });

  const isReadOnly = computed(() => {
    return (
      rteOnly.value.readOnly === true || formFieldCustom.value.readonly === true
    );
  });

  const showToolbar = computed(() => {
    return (
      !(isReadOnly.value || formFieldCustom.value.disabled === true) &&
      tools.value.length > 0
    );
  });

  const sizeToken = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeRichText.value?.tokens?.size,
    );

    return get(
      classes,
      formFieldCustom.value.size ?? rteMerged.value.size ?? "md",
    );
  });

  const formField = useFormField(
    () => ({
      ...formFieldInherited.value,
      ...formFieldCustom.value,
      classes: mergedClasses.value,
      customProps: formFieldOnlyCustom.value,
      readonly: isReadOnly.value || formFieldCustom.value.readonly,
    }),
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

  function bumpSelection() {
    selectionTick.value += 1;
  }

  function destroyHandle() {
    handleRef.value?.destroy();
    handleRef.value = null;
  }

  function mountAdapter() {
    destroyHandle();

    const element = contentRef.value;
    const richText = adapter.value;

    if (isNil(element)) {
      return;
    }

    if (isNil(richText)) {
      throw new Error(
        "[BridgeUI] RichTextEditor requires BridgeUIProvider global.richText. See packages/{react,vue}/Adapters/Examples/rich-text-tiptap.",
      );
    }

    handleRef.value = richText.mount({
      element,
      tools: tools.value,
      value: model.value,
      format: format.value,
      readOnly: isReadOnly.value,
      onSelectionChange: bumpSelection,
      disabled: formField.isDisabled.value,
      placeholder: rteOnly.value.placeholder,
      onChange: (next) => {
        model.value = next;
        emit("update:modelValue", next);
      },
    });
  }

  watch(
    [contentRef, adapter, format],
    () => {
      mountAdapter();
    },
    { flush: "post" },
  );

  watch(
    () => model.value,
    (next) => {
      const handle = handleRef.value;

      if (isNil(handle) || next === undefined) {
        return;
      }

      if (!richTextValuesEqual(handle.getValue(), next)) {
        handle.setValue(next);
      }
    },
  );

  watch(
    () => formField.isDisabled.value,
    (disabled) => {
      handleRef.value?.setDisabled(disabled);
    },
  );

  watch(isReadOnly, (readOnly) => {
    handleRef.value?.setReadOnly(readOnly);
  });

  onBeforeUnmount(() => {
    destroyHandle();
  });

  const toolbarBind = computed(() => {
    return mergePartBind(
      rteOnly.value.customProps?.toolbar,
      {
        role: "toolbar",
        "aria-label": resolveMessage("Formatting"),
      },
      cn({
        [sizeToken.value?.toolbar ?? ""]: true,
        [mergedClasses.value.toolbar ?? ""]: true,
      }),
    );
  });

  const contentBind = computed(() => {
    return mergePartBind(
      rteOnly.value.customProps?.content,
      {
        role: "textbox",
        "aria-multiline": true,
        id: formField.controlId.value,
        "aria-readonly": isReadOnly.value || undefined,
        "aria-describedby": formField.ariaDescribedBy.value,
        "aria-disabled": formField.isDisabled.value || undefined,
        "aria-invalid": formField.invalidated.value || undefined,
      },
      cn({
        "min-w-0 flex-1": true,
        [sizeToken.value?.content ?? ""]: true,
        [mergedClasses.value.content ?? ""]: true,
        [mergedClasses.value.input ?? ""]: true,
      }),
    );
  });

  function getToolbarButtonBind(tool: RichTextTool): ButtonOwnProps {
    // Touch selection tick so toolbar pressed state updates.
    void selectionTick.value;

    const handle = handleRef.value;
    const label = resolveMessage(RICH_TEXT_TOOL_LABELS[tool]);

    return mergePartBind(
      toolbarButtonCustom.value,
      {
        type: "button",
        density: "mini",
        variant: "flat",
        "aria-label": label,
        icon: RICH_TEXT_TOOL_ICONS[tool],
        selected: handle?.isActive(tool) ?? false,
        disabled:
          formField.isDisabled.value ||
          isReadOnly.value ||
          !(handle?.can(tool) ?? true),
      },
      cn({
        [sizeToken.value?.toolbarButton ?? ""]: true,
        [mergedClasses.value.toolbarButton ?? ""]: true,
      }),
    ) as ButtonOwnProps;
  }

  function runTool(tool: RichTextTool) {
    const handle = handleRef.value;

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
  }

  return {
    slots,
    tools,
    format,
    runTool,
    formField,
    isReadOnly,
    contentBind,
    toolbarBind,
    showToolbar,
    getToolbarButtonBind,
  };
}
