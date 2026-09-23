// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  RichTextFormat,
  RichTextTool,
  RichTextValue,
} from "@bridge-ui/core/Adapters";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ButtonOwnProps } from "@/Components/Button/button.types";
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";

export interface RichTextEditorSizeOverrides {}
export interface RichTextEditorColorOverrides {}
export interface RichTextEditorRoundedOverrides {}
export interface RichTextEditorVariantOverrides {}

export interface RichTextEditorClasses extends FormFieldClasses {
  /**
   * Classes for the editable content surface.
   */
  content?: string;

  /**
   * Classes for the toolbar row.
   */
  toolbar?: string;

  /**
   * Classes for each toolbar tool button.
   */
  toolbarButton?: string;
}

export interface RichTextEditorCustomProps extends FormFieldCustomProps {
  /**
   * Props forwarded to the editable content surface.
   */
  content?: HTMLAttributes;

  /**
   * Props forwarded to the toolbar row.
   */
  toolbar?: HTMLAttributes;

  /**
   * Props forwarded to each toolbar `Button` (`icon` / selection stay owned).
   */
  toolbarButton?: Partial<
    Omit<ButtonOwnProps, "icon" | "onClick" | "selected">
  >;
}

export interface RichTextEditorEmits {
  /**
   * Emitted when the document changes (`v-model`).
   */
  "update:modelValue": [value: RichTextValue];
}

export interface RichTextEditorOwnProps extends Omit<
  FormFieldOwnProps,
  "field"
> {
  /**
   * Classes for the field chrome, toolbar, and content surface.
   *
   * @default undefined
   */
  classes?: RichTextEditorClasses;

  /**
   * Extra props for internal parts (`content`, `toolbar`, `toolbarButton`, …).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  customProps?: RichTextEditorCustomProps;

  /**
   * Initial value for uncontrolled usage (when `v-model` is not bound).
   *
   * @default undefined
   */
  defaultValue?: RichTextValue;

  /**
   * Controlled / emitted document format.
   *
   * @default "html"
   */
  format?: RichTextFormat;

  /**
   * Empty-state hint in the content area.
   *
   * @default undefined
   */
  placeholder?: string;

  /**
   * View-only surface; hides the toolbar and disables editing.
   * Prefer this over FormField `readonly` for the rich-text surface.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Which toolbar actions to show.
   *
   * @default DEFAULT_RICH_TEXT_TOOLS
   */
  tools?: RichTextTool[];
}

export interface RichTextEditorSlots extends FormFieldSlots {
  /**
   * Replace the default toolbar. Receives the resolved tool list.
   */
  toolbar?: Slot<{ tools: RichTextTool[] }>;
}

export type RichTextEditorProps = MergeHtmlProps<
  RichTextEditorOwnProps,
  HTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component.
   */
  modelValue?: RichTextValue;
};
