// ** External Imports
import type { HTMLAttributes, InputHTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  ButtonColor,
  FileUploadRounded,
  FileUploadSize,
  FileUploadVariant,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface FileUploadSizeOverrides {}
export interface FileUploadColorOverrides {}
export interface FileUploadRoundedOverrides {}
export interface FileUploadVariantOverrides {}

export interface FileUploadClasses {
  /**
   * Classes for the actions cluster on a file card.
   */
  actions?: string;

  /**
   * Classes for the title + description stack on a file card.
   */
  content?: string;

  /**
   * Classes for helper text below the picker / list.
   */
  description?: string;

  /**
   * Classes for the dropzone surface.
   */
  dropzone?: string;

  /**
   * Classes for validation / error text.
   */
  errorMessage?: string;

  /**
   * Classes for each file card.
   */
  item?: string;

  /**
   * Classes for the optional field label.
   */
  label?: string;

  /**
   * Classes for the selected-files list.
   */
  list?: string;

  /**
   * Classes for the media slot (icon or image preview).
   */
  media?: string;

  /**
   * Classes for the root wrapper.
   */
  root?: string;

  /**
   * Classes for the file name on a card.
   */
  title?: string;

  /**
   * Classes for the button-variant trigger wrapper.
   */
  trigger?: string;
}

export interface FileUploadCustomProps {
  /**
   * Props forwarded to the actions cluster on a file card.
   */
  actions?: HTMLAttributes;

  /**
   * Props forwarded to the title + description stack.
   */
  content?: HTMLAttributes;

  /**
   * Props forwarded to helper text below the picker / list.
   */
  description?: HTMLAttributes;

  /**
   * Props forwarded to the dropzone surface.
   */
  dropzone?: HTMLAttributes;

  /**
   * Props forwarded to validation / error text.
   */
  errorMessage?: HTMLAttributes;

  /**
   * Props forwarded to the hidden file input.
   */
  input?: InputHTMLAttributes;

  /**
   * Props forwarded to each file card.
   */
  item?: HTMLAttributes;

  /**
   * Props forwarded to the optional field label wrapper.
   */
  label?: HTMLAttributes;

  /**
   * Props forwarded to the selected-files list.
   */
  list?: HTMLAttributes;

  /**
   * Props forwarded to the media slot.
   */
  media?: HTMLAttributes;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the file name element.
   */
  title?: HTMLAttributes;

  /**
   * Props forwarded to the button-variant trigger wrapper.
   */
  trigger?: HTMLAttributes;
}

export interface FileUploadEmits {
  /**
   * Emitted when a file is removed from the list.
   */
  remove: [file: File, index: number];

  /**
   * Emitted when the selected files change (`v-model`).
   */
  "update:modelValue": [files: File[]];
}

export interface FileUploadItemSlotProps {
  /**
   * The file for this card.
   */
  file: File;

  /**
   * Index in the current selection.
   */
  index: number;

  /**
   * Whether the file can show an image preview.
   */
  isImage: boolean;

  /**
   * Metadata line (type · size).
   */
  metaLabel: string;

  /**
   * Object URL for image previews (`undefined` when not an image).
   */
  previewUrl?: string;

  /**
   * Removes this file from the selection.
   */
  remove: () => void;

  /**
   * Formatted file size for display.
   */
  sizeLabel: string;
}

/**
 * File picker with optional dropzone. Selected files always render as the same
 * attachment-style cards whether `multiple` is on or off — there is no FormField
 * chrome for a single file.
 */
export interface FileUploadOwnProps {
  /**
   * Native `accept` filter for the file input.
   *
   * @default undefined
   */
  accept?: string;

  /**
   * Label for the button-variant trigger.
   *
   * @default "Choose file" / "Choose files" when `multiple`
   */
  buttonLabel?: string;

  /**
   * The classes to apply to FileUpload parts.
   *
   * @default undefined
   */
  classes?: FileUploadClasses;

  /**
   * Color forwarded to the trigger and remove `Button`s.
   *
   * @default "primary"
   */
  color?: MergeProps<ButtonColor, FileUploadColorOverrides>;

  /**
   * Extra props for internal parts (`input`, `dropzone`, `list`, `item`, …).
   *
   * @default undefined
   */
  customProps?: FileUploadCustomProps;

  /**
   * Uncontrolled initial selection.
   *
   * @default undefined
   */
  defaultValue?: File[];

  /**
   * Helper text below the picker / list. Inside the dropzone, also used as the
   * secondary line when `variant="dropzone"`.
   *
   * @default undefined
   */
  description?: string;

  /**
   * Whether picking and dropping are disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Marks the control as invalid (error styling on helper chrome).
   *
   * @default false
   */
  error?: boolean;

  /**
   * Error copy shown below the picker / list.
   *
   * @default undefined
   */
  errorMessage?: string;

  /**
   * Optional field label above the picker.
   *
   * @default undefined
   */
  label?: string;

  /**
   * Cap on selected files when `multiple` is true.
   *
   * @default undefined
   */
  maxFiles?: number;

  /**
   * Max bytes per file (validated in the UI; the app still enforces on upload).
   *
   * @default undefined
   */
  maxSize?: number;

  /**
   * Allow selecting more than one file. A single selection still uses the same
   * attachment card as multiple — not a FormField input shell.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Marks the field as required (asterisk on the label).
   *
   * @default false
   */
  required?: boolean;

  /**
   * Border radius for the dropzone, file cards, and media.
   *
   * @default "md"
   */
  rounded?: MergeProps<FileUploadRounded, FileUploadRoundedOverrides>;

  /**
   * Density / dropzone and card scale.
   *
   * @default "md"
   */
  size?: MergeProps<FileUploadSize, FileUploadSizeOverrides>;

  /**
   * Primary copy inside the dropzone surface.
   *
   * @default undefined
   */
  title?: string;

  /**
   * Compact trigger vs large drop surface.
   *
   * @default "button"
   */
  variant?: MergeProps<FileUploadVariant, FileUploadVariantOverrides>;
}

export interface FileUploadSlots {
  /**
   * Replaces helper text below the picker / list.
   */
  description?: Slot<undefined>;

  /**
   * Replaces the default dropzone title / description copy.
   */
  dropzone?: Slot<undefined>;

  /**
   * Replaces validation / error text.
   */
  errorMessage?: Slot<undefined>;

  /**
   * Replaces the default file card (media + title + meta + remove).
   */
  item?: Slot<FileUploadItemSlotProps>;

  /**
   * Replaces the optional field label.
   */
  label?: Slot<undefined>;

  /**
   * Replaces the default button-variant trigger.
   */
  trigger?: Slot<undefined>;
}

export type FileUploadProps = MergeHtmlProps<
  FileUploadOwnProps,
  Omit<
    InputHTMLAttributes,
    | "size"
    | "type"
    | "value"
    | "accept"
    | "disabled"
    | "multiple"
    | "onChange"
    | "defaultValue"
  >
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: File[];
};
