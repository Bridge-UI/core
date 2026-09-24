// ** External Imports
import { createContext, useContext, type HTMLAttributes } from "react";

// ** Local Imports
import type { ButtonProps } from "@/Components/Button";

/**
 * Card chrome shared by `FileUpload` and `FileUploadItem`.
 */
export type FileUploadItemContextValue = {
  /**
   * Props for the remove-button cluster.
   */
  actionsBind: HTMLAttributes<HTMLDivElement>;

  /**
   * Color forwarded to the default remove button.
   */
  color?: ButtonProps["color"];

  /**
   * Props for the name + metadata stack.
   */
  contentBind: HTMLAttributes<HTMLDivElement>;

  /**
   * Props for the metadata line.
   */
  descriptionBind: HTMLAttributes<HTMLParagraphElement>;

  /**
   * Whether the remove button is disabled.
   */
  disabled?: boolean;

  /**
   * Props for the card root.
   */
  getItemBind: (index: number) => HTMLAttributes<HTMLLIElement>;

  /**
   * Props for the preview or file icon.
   */
  mediaBind: HTMLAttributes<HTMLDivElement>;

  /**
   * Radius forwarded to the card and the remove button.
   */
  rounded?: ButtonProps["rounded"];

  /**
   * Props for the file name.
   */
  titleBind: HTMLAttributes<HTMLParagraphElement>;
};

const FileUploadContext = createContext<null | FileUploadItemContextValue>(
  null,
);

/**
 * Reads card chrome from the nearest `FileUpload`.
 */
export function useFileUploadItemContext(): FileUploadItemContextValue {
  const context = useContext(FileUploadContext);

  if (!context) {
    throw new Error("FileUploadItem must be used within FileUpload");
  }

  return context;
}

export default FileUploadContext;
