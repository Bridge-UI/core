// ** External Imports
import type { ComputedRef, HTMLAttributes, InjectionKey } from "vue";

// ** Core Imports
import type {
  FileUploadOrientation,
  FileUploadState,
} from "@bridge-ui/core/Tokens";

// ** Local Imports
import type { ButtonProps } from "@/Components/Button";

/**
 * Card chrome shared by `FileUpload` and `FileUploadItem`.
 */
export type FileUploadItemContextValue = {
  /**
   * Props for the remove-button cluster.
   */
  actionsBind: HTMLAttributes;

  /**
   * Color forwarded to the default remove button.
   */
  color?: ButtonProps["color"];

  /**
   * Props for the name + metadata stack.
   */
  contentBind: HTMLAttributes;

  /**
   * Props for the metadata line.
   */
  descriptionBind: HTMLAttributes;

  /**
   * Whether the remove button is disabled.
   */
  disabled?: boolean;

  /**
   * Props for the card root.
   */
  getItemBind: (index: number) => HTMLAttributes;

  /**
   * Props for the preview or file icon.
   */
  mediaBind: HTMLAttributes;

  /**
   * Field orientation. Cards inherit it unless they pass their own.
   */
  orientation: string;

  /**
   * Merged orientation tokens, including registry overrides.
   */
  orientationItems: Partial<FileUploadOrientation>;

  /**
   * Radius forwarded to the card and the remove button.
   */
  rounded?: ButtonProps["rounded"];

  /**
   * Field size. `xs` hides the default type · size line.
   */
  size: string;

  /**
   * Merged upload-state tokens, including registry overrides.
   */
  stateItems: Partial<FileUploadState>;

  /**
   * Props for the file name.
   */
  titleBind: HTMLAttributes;
};

export const FILE_UPLOAD_KEY: InjectionKey<
  ComputedRef<FileUploadItemContextValue>
> = Symbol("bridge-file-upload");
