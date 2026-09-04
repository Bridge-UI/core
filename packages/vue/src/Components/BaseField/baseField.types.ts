// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { BaseFieldSize } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { UseBaseFieldReturn } from "@/Components/BaseField/composables/useBaseField";
import type { LabelProps } from "@/Components/Label/label.types";

export interface BaseFieldSizeOverrides {}

export interface BaseFieldClasses {
  /**
   * Classes merged onto the corner label in the header row.
   */
  corner?: string;

  /**
   * Classes merged onto the helper text below the control group.
   */
  description?: string;

  /**
   * Classes merged onto the inline-end adornment slot wrapper.
   */
  end?: string;

  /**
   * Classes merged onto the error message below the control group.
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
   * Props forwarded to the helper text below the control group.
   */
  description?: HTMLAttributes;

  /**
   * Props forwarded to the inline-end adornment slot wrapper.
   */
  end?: HTMLAttributes;

  /**
   * Props forwarded to the error message element.
   */
  errorMessage?: HTMLAttributes;

  /**
   * Props forwarded to the control group wrapper.
   */
  group?: HTMLAttributes;

  /**
   * Props forwarded to the label + corner header row.
   */
  header?: HTMLAttributes;

  /**
   * Props forwarded to the primary `Label` (content stays owned by `BaseField`).
   *
   * @default undefined
   */
  label?: Partial<Omit<LabelProps, "children">>;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the inline-start adornment slot wrapper.
   */
  start?: HTMLAttributes;
}

export interface BaseFieldOwnProps {
  /**
   * Classes for the field chrome and control group layout.
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
   * Helper text below the control group. Hidden when `error` is true and an
   * error message is shown, unless `showDescriptionOnError` is true.
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether the field control is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * When `true`, applies invalid styling on the label and control group. Hides
   * description when an error message is shown, unless `showDescriptionOnError`
   * is true.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Error message below the control group. Shown only when set (or via
   * `errorMessage` slot).
   *
   * @default undefined
   */
  errorMessage?: string;

  /**
   * Pre-composed field chrome API from a parent composable. Used by
   * `<BaseField :field="…" />`; not set on OtpField, Slider, or similar
   * wrappers.
   *
   * @default undefined
   */
  field?: UseBaseFieldReturn;

  /**
   * When `true`, does not reserve the error row. That row is also omitted
   * while a description is shown.
   *
   * @default false
   */
  hideErrorMessage?: boolean;

  /**
   * The primary label text above the control group.
   *
   * @default undefined
   */
  label?: string;

  /**
   * Whether the field control is read-only.
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
   * Label typography and control group gap scale.
   *
   * @default "md"
   */
  size?: MergeProps<BaseFieldSize, BaseFieldSizeOverrides>;

  /**
   * Chrome slots (`label`, `corner`, `description`, `errorMessage`, …) and the
   * control.
   *
   * @default undefined
   */
  slots?: BaseFieldSlots;
}

export interface BaseFieldSlots {
  /**
   * Secondary header text at the inline end.
   */
  corner?: Slot;

  /**
   * The form control (input, pin group, slider track, …).
   */
  default?: Slot<undefined>;

  /**
   * Helper text below the control group. Hidden when the field is invalid and
   * an error message is shown, unless `showDescriptionOnError` is true.
   */
  description?: Slot;

  /**
   * Inline-end slot beside the control group (e.g. a button or timer).
   */
  end?: Slot;

  /**
   * Error message below the control group.
   */
  errorMessage?: Slot;

  /**
   * Primary label content.
   */
  label?: Slot;

  /**
   * Inline-start slot beside the control group (e.g. an icon or button).
   */
  start?: Slot;
}

/**
 * Named BaseField chrome slots (excludes the `default` control slot).
 * Field wrappers forward only these into `<BaseField>`.
 */
export const BASE_FIELD_CHROME_SLOT_NAMES = [
  "end",
  "label",
  "start",
  "corner",
  "description",
  "errorMessage",
] as const satisfies ReadonlyArray<Exclude<keyof BaseFieldSlots, "default">>;

export type BaseFieldProps = MergeHtmlProps<
  BaseFieldOwnProps,
  Omit<HTMLAttributes, "color">
>;
