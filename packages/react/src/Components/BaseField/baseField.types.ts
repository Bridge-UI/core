// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { BaseFieldSize } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { UseBaseFieldReturn } from "@/Components/BaseField/hooks/useBaseField";
import type { LabelProps } from "@/Components/Label/label.types";

export interface BaseFieldSizeOverrides {}

export interface BaseFieldClasses {
  /**
   * Classes merged onto the corner label in the header row.
   */
  corner?: string;

  /**
   * Classes merged onto the helper text below the group.
   */
  description?: string;

  /**
   * Classes merged onto the inline-end adornment slot wrapper.
   */
  end?: string;

  /**
   * Classes merged onto the error message below the group.
   */
  errorMessage?: string;

  /**
   * Classes merged onto the control group wrapper.
   */
  group?: string;

  /**
   * Classes merged onto the label + corner header row.
   */
  header?: string;

  /**
   * Classes merged onto the primary label.
   */
  label?: string;

  /**
   * Classes merged onto the required asterisk.
   */
  required?: string;

  /**
   * Classes merged onto the root wrapper.
   */
  root?: string;

  /**
   * Classes merged onto the inline-start adornment slot wrapper.
   */
  start?: string;
}

export interface BaseFieldCustomProps {
  /**
   * Props forwarded to the corner `Label` (content stays owned by `BaseField`).
   *
   * @default undefined
   */
  corner?: Partial<Omit<LabelProps, "children">>;

  /**
   * Props forwarded to the helper text below the group.
   */
  description?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the inline-end adornment slot wrapper.
   */
  end?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the error message element.
   */
  errorMessage?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the control group wrapper.
   */
  group?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the label + corner header row.
   */
  header?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the primary `Label` (content stays owned by `BaseField`).
   *
   * @default undefined
   */
  label?: Partial<Omit<LabelProps, "children">>;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the inline-start adornment slot wrapper.
   */
  start?: HTMLAttributes<HTMLDivElement>;
}

export interface BaseFieldOwnProps {
  /**
   * Control content rendered inside the group (between start/end slots).
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for the field chrome and group layout.
   *
   * @default undefined
   */
  classes?: BaseFieldClasses;

  /**
   * Associates labels and helper text with the control group. When omitted, an
   * id is generated automatically.
   *
   * @default undefined
   */
  controlId?: string;

  /**
   * Secondary label text at the inline end of the header row.
   *
   * @default undefined
   */
  corner?: string;

  /**
   * Extra props for internal parts (`root`, `group`, `label`, …).
   *
   * @default undefined
   */
  customProps?: BaseFieldCustomProps;

  /**
   * Helper text below the group. Hidden when `error` is true and an error
   * message is shown, unless `showDescriptionOnError` is true.
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether the field is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * When `true`, applies invalid styling on the label and group. Hides
   * description when an error message is shown, unless `showDescriptionOnError`
   * is true.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Error message below the group. Shown only when set (or via `errorMessage`
   * slot).
   *
   * @default undefined
   */
  errorMessage?: string;

  /**
   * Pre-composed field API from a parent composable. Used by
   * `<BaseField field={…} />`; not set when using the hook directly in app code.
   *
   * @default undefined
   */
  field?: UseBaseFieldReturn;

  /**
   * When `true`, does not reserve space below the group for error messages.
   *
   * @default false
   */
  hideErrorMessage?: boolean;

  /**
   * The primary label text above the group.
   *
   * @default undefined
   */
  label?: string;

  /**
   * Whether the field is read-only.
   *
   * @default false
   */
  readonly?: boolean;

  /**
   * Shows a red asterisk on the label.
   *
   * @default false
   */
  required?: boolean;

  /**
   * When `true`, keeps the description visible while the field is invalid.
   *
   * @default false
   */
  showDescriptionOnError?: boolean;

  /**
   * Label, corner, description, and error typography scale.
   *
   * @default "md"
   */
  size?: MergeProps<BaseFieldSize, BaseFieldSizeOverrides>;

  /**
   * Chrome slots (`label`, `description`, `errorMessage`, `start`, `end`, …).
   *
   * @default undefined
   */
  slots?: BaseFieldSlots;
}

export interface BaseFieldSlots {
  /**
   * Secondary header text at the inline end.
   */
  corner?: ReactNode;

  /**
   * Helper text below the group.
   */
  description?: ReactNode;

  /**
   * Inline-end slot beside the control group.
   */
  end?: ReactNode;

  /**
   * Error message below the group.
   */
  errorMessage?: ReactNode;

  /**
   * Primary label content.
   */
  label?: ReactNode;

  /**
   * Inline-start slot beside the control group.
   */
  start?: ReactNode;
}

export type BaseFieldProps = MergeHtmlProps<
  BaseFieldOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
