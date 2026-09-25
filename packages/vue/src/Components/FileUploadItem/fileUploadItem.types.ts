// ** External Imports
import type { HTMLAttributes } from "vue";

// ** Core Imports
import type { FileUploadOrientation } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  FileUploadItemSlotProps,
  FileUploadOrientationOverrides,
} from "@/Components/FileUpload/fileUpload.types";

export interface FileUploadItemOwnProps extends FileUploadItemSlotProps {
  /**
   * Replaces the meta line, including upload-state copy.
   * `null` or `""` hides the line.
   *
   * @default the attachment `description`, or the type · size / state label
   */
  description?: null | string;

  /**
   * Card layout. Overrides the `FileUpload` orientation for this card.
   *
   * @default inherited from FileUpload
   */
  orientation?: MergeProps<
    FileUploadOrientation,
    FileUploadOrientationOverrides
  >;
}

export type FileUploadItemProps = MergeHtmlProps<
  FileUploadItemOwnProps,
  HTMLAttributes
>;
