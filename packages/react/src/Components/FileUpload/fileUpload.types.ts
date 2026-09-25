// ** External Imports
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { FileUploadModel, FileUploadValue } from "@bridge-ui/core/Domain";
import type {
  FileUploadColor,
  FileUploadRounded,
  FileUploadSize,
  FileUploadVariant,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface FileUploadSizeOverrides {}
export interface FileUploadColorOverrides {}
export interface FileUploadRoundedOverrides {}
export interface FileUploadVariantOverrides {}

export interface FileUploadCallbacks {
  /**
   * Callback when an item is removed from the list.
   */
  onRemove?: (value: FileUploadValue, index: number) => void;
}

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
  actions?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the title + description stack.
   */
  content?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to helper text below the picker / list.
   */
  description?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the dropzone surface.
   */
  dropzone?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to validation / error text.
   */
  errorMessage?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the hidden file input.
   */
  input?: InputHTMLAttributes<HTMLInputElement>;

  /**
   * Props forwarded to each file card.
   */
  item?: HTMLAttributes<HTMLLIElement>;

  /**
   * Props forwarded to the optional field label wrapper.
   */
  label?: HTMLAttributes<HTMLLabelElement>;

  /**
   * Props forwarded to the selected-files list.
   */
  list?: HTMLAttributes<HTMLUListElement>;

  /**
   * Props forwarded to the media slot.
   */
  media?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root wrapper.
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the file name element.
   */
  title?: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Props forwarded to the button-variant trigger wrapper.
   */
  trigger?: HTMLAttributes<HTMLDivElement>;
}

export interface FileUploadItemOwnProps extends FileUploadItemSlotProps {
  /**
   * Leading and trailing content for this card.
   *
   * @default undefined
   */
  slots?: FileUploadItemSlots;
}

export interface FileUploadItemSlotProps {
  /**
   * Index in the current selection.
   */
  index: number;

  /**
   * Whether the item can show an image preview.
   */
  isImage: boolean;

  /**
   * Metadata line (type · size).
   */
  metaLabel: string;

  /**
   * Image preview URL (`url` for a remote image, object URL for a `File`).
   */
  previewUrl?: string;

  /**
   * Removes this item from the selection.
   */
  remove: () => void;

  /**
   * Formatted file size for display.
   */
  sizeLabel: string;

  /**
   * The selected `File` or remote attachment.
   */
  value: FileUploadValue;
}

export interface FileUploadItemSlots {
  /**
   * Replaces the remove button.
   */
  end?: ReactNode;

  /**
   * Leading content, before the file media. Use it for a drag handle.
   */
  start?: ReactNode;
}

export interface FileUploadListSlotProps {
  /**
   * Selected items in list order. When `multiple` is true, reorder by writing a new array to the model.
   */
  items: FileUploadItemSlotProps[];
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
   * Color of the trigger, the remove button, and the dropzone highlight while dragging.
   *
   * @default "primary"
   */
  color?: MergeProps<FileUploadColor, FileUploadColorOverrides>;

  /**
   * Secondary label text at the inline end of the header row.
   *
   * @default undefined
   */
  corner?: string;

  /**
   * Extra props for internal parts (`input`, `dropzone`, `list`, `item`, …).
   *
   * @default undefined
   */
  customProps?: FileUploadCustomProps;

  /**
   * Uncontrolled initial selection. One item or `null` unless `multiple` is true.
   *
   * @default undefined
   */
  defaultValue?: FileUploadModel;

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
   * When false, the model is one item or `null`. When true, it is a list.
   * A single selection still uses the same attachment card — not a FormField input shell.
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
   * The slots to apply to FileUpload.
   *
   * @default undefined
   */
  slots?: FileUploadSlots;

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
   * Secondary label at the inline end of the header row.
   */
  corner?: ReactNode;

  /**
   * Replaces helper text below the picker / list.
   */
  description?: ReactNode;

  /**
   * Replaces the default dropzone title / description copy.
   */
  dropzone?: ReactNode;

  /**
   * Replaces the remove button on each default card.
   * A function receives the item (`remove`, `value`, …).
   */
  end?: ReactNode | ((props: FileUploadItemSlotProps) => ReactNode);

  /**
   * Replaces validation / error text.
   */
  errorMessage?: ReactNode;

  /**
   * Replaces the default file card (media + title + meta + remove).
   */
  item?: (props: FileUploadItemSlotProps) => ReactNode;

  /**
   * Replaces the optional field label.
   */
  label?: ReactNode;

  /**
   * Replaces the default file list. The app owns markup and order.
   * Render `FileUploadItem` to keep the default card.
   */
  list?: (props: FileUploadListSlotProps) => ReactNode;

  /**
   * Leading content on each default card, before the file media.
   * A function receives the item. Use it for a drag handle.
   */
  start?: ReactNode | ((props: FileUploadItemSlotProps) => ReactNode);

  /**
   * Replaces the default button-variant trigger.
   */
  trigger?: ReactNode;
}

export type {
  FileUploadModel,
  FileUploadRemote,
  FileUploadValue,
} from "@bridge-ui/core/Domain";

type FileUploadDomProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "size"
  | "type"
  | "value"
  | "accept"
  | "disabled"
  | "multiple"
  | "onChange"
  | "defaultValue"
>;

type FileUploadSharedProps = Omit<
  FileUploadOwnProps,
  "multiple" | "defaultValue"
> &
  FileUploadCallbacks;

export type FileUploadSingleProps = MergeHtmlProps<
  FileUploadSharedProps & {
    /**
     * Uncontrolled initial item. `null` when empty.
     *
     * @default undefined
     */
    defaultValue?: null | FileUploadValue;

    /**
     * When false, the model is one item or `null`.
     *
     * @default false
     */
    multiple?: false;

    /**
     * Called with the selected item, or `null` when it is cleared.
     */
    onChange?: (value: null | FileUploadValue) => void;

    /**
     * Selected item, shown as an attachment card. `null` when empty.
     *
     * @default undefined
     */
    value?: null | FileUploadValue;
  },
  FileUploadDomProps
>;

export type FileUploadMultipleProps = MergeHtmlProps<
  FileUploadSharedProps & {
    /**
     * Uncontrolled initial list.
     *
     * @default undefined
     */
    defaultValue?: FileUploadValue[];

    /**
     * When true, the model is a list.
     */
    multiple: true;

    /**
     * Called with the selected items.
     */
    onChange?: (files: FileUploadValue[]) => void;

    /**
     * Selected items, shown as attachment cards.
     *
     * @default undefined
     */
    value?: FileUploadValue[];
  },
  FileUploadDomProps
>;

export type FileUploadItemProps = MergeHtmlProps<
  FileUploadItemOwnProps,
  HTMLAttributes<HTMLLIElement>
>;

export type FileUploadProps = FileUploadSingleProps | FileUploadMultipleProps;
