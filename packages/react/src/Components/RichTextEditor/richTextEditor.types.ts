// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  RichTextFormat,
  RichTextTool,
  RichTextValue,
} from "@bridge-ui/core/Adapters";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ButtonProps } from "@/Components/Button/button.types";
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

export interface RichTextEditorCallbacks {
  /**
   * Called when the document changes.
   */
  onChange?: (value: RichTextValue) => void;
}

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
  content?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the toolbar row.
   */
  toolbar?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to each toolbar `Button` (`icon` / selection stay owned).
   */
  toolbarButton?: Partial<
    Omit<ButtonProps, "icon" | "onClick" | "children" | "selected">
  >;
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

  /**
   * Controlled document (`string` when `format="html"`, JSON when `"json"`).
   *
   * @default undefined
   */
  value?: RichTextValue;
}

export interface RichTextEditorSlots extends FormFieldSlots {
  /**
   * Replace the default toolbar. Receives the resolved tool list.
   */
  toolbar?: (props: { tools: RichTextTool[] }) => ReactNode;
}

export type RichTextEditorProps = MergeHtmlProps<
  RichTextEditorOwnProps &
    RichTextEditorCallbacks & { slots?: RichTextEditorSlots },
  HTMLAttributes<HTMLDivElement>
>;
