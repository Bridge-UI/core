// ** External Imports
import { clamp, isArray, isNil } from "es-toolkit/compat";

/**
 * Reason a file was rejected by FileUpload validation.
 */
export type FileUploadRejectReason = "accept" | "maxSize" | "maxFiles";

/**
 * Attachment already stored on the server. Not a browser `File`.
 * Only `name` is required. `size` and `type` match `File` when known.
 * `url` is the remote location. Extra fields on the object are ignored.
 */
export type FileUploadRemote = {
  /**
   * File name shown on the card. Same as `File.name`.
   */
  name: string;

  /**
   * Size in bytes. Same as `File.size`. Omitted from the card when missing.
   */
  size?: number;

  /**
   * MIME type. Same as `File.type`. Used for the type label and image preview.
   */
  type?: string;

  /**
   * Remote location. Image preview when the item is an image.
   */
  url?: string;
};

/**
 * A newly picked `File` or a remote attachment already on the server.
 */
export type FileUploadValue = File | FileUploadRemote;

/**
 * Bound FileUpload selection.
 * One item or `null` when `multiple` is false, a list when `multiple` is true.
 */
export type FileUploadModel = null | FileUploadValue | FileUploadValue[];

/**
 * A file rejected by {@link filterFileUploadSelection}.
 */
export type FileUploadRejectedFile = {
  /**
   * The rejected file.
   */
  file: File;

  /**
   * Why the file was rejected.
   */
  reason: FileUploadRejectReason;
};

/**
 * Options for filtering and merging a FileUpload selection.
 */
export type FileUploadFilterOptions = {
  /**
   * Native `accept` filter string (extensions, MIME types, wildcards).
   */
  accept?: string;

  /**
   * Cap on total files when `multiple` is true (current + incoming).
   */
  maxFiles?: number;

  /**
   * Max bytes per file. Files over the limit are rejected.
   */
  maxSize?: number;

  /**
   * Allow more than one file in the selection.
   *
   * @default false
   */
  multiple?: boolean;
};

/**
 * Result of filtering incoming files against accept / size / count rules.
 */
export type FileUploadFilterResult = {
  /**
   * Files that passed validation (already sliced to remaining slots).
   */
  accepted: File[];

  /**
   * Files that failed validation.
   */
  rejected: FileUploadRejectedFile[];
};

/**
 * Next selection after merging validated incoming files into the current list.
 */
export type FileUploadMergeResult = {
  /**
   * Next selection. Replaces the current list when `multiple` is false.
   */
  accepted: FileUploadValue[];

  /**
   * Incoming files that failed validation.
   */
  rejected: FileUploadRejectedFile[];
};

const IMAGE_EXTENSIONS = new Set([
  "bmp",
  "gif",
  "ico",
  "jpg",
  "png",
  "svg",
  "tif",
  "apng",
  "avif",
  "heic",
  "heif",
  "jpeg",
  "tiff",
  "webp",
]);

/**
 * Reads a FileUpload model as a list.
 * A single item becomes a one-element list. An array is kept only when `multiple` is true.
 */
export function fileUploadItemsFromModel(
  model: undefined | FileUploadModel,
  multiple = false,
): FileUploadValue[] {
  if (multiple) {
    return isArray(model) ? model : [];
  }

  if (isNil(model) || isArray(model)) {
    return [];
  }

  return [model];
}

/**
 * Writes a FileUpload list back to the public model.
 * Single mode returns the first item, or `null` when the list is empty.
 */
export function fileUploadModelFromItems(
  items: FileUploadValue[],
  multiple = false,
): FileUploadModel {
  if (multiple) {
    return items;
  }

  return items[0] ?? null;
}

/**
 * Returns whether `value` is a remote attachment (not a browser `File`).
 */
export function isFileUploadRemote(
  value: FileUploadValue,
): value is FileUploadRemote {
  return !(value instanceof File);
}

function fileExtension(name: string): string {
  const path = name.split(/[?#]/)[0] ?? "";
  const base = path.split("/").pop() ?? path;
  const dot = base.lastIndexOf(".");

  if (dot <= 0 || dot >= base.length - 1) {
    return "";
  }

  return base.slice(dot + 1).toLowerCase();
}

function hasImageExtension(name: string): boolean {
  const extension = fileExtension(name);

  return extension !== "" && IMAGE_EXTENSIONS.has(extension);
}

/**
 * Converts a `FileList` (or nullish) into a plain `File[]`.
 */
export function filesFromFileList(list: null | FileList | undefined): File[] {
  if (isNil(list) || list.length === 0) {
    return [];
  }

  return Array.from(list);
}

/**
 * Returns whether `file` matches a native `accept` attribute value.
 * Empty / missing `accept` accepts every file.
 */
export function fileMatchesAccept(file: File, accept?: string): boolean {
  if (isNil(accept) || accept.trim() === "") {
    return true;
  }

  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) {
    return true;
  }

  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) {
      return name.endsWith(token);
    }

    if (token.endsWith("/*")) {
      const prefix = token.slice(0, -1);

      return type.startsWith(prefix);
    }

    return type === token;
  });
}

/**
 * Returns whether `file.size` is within `maxSize` bytes.
 * Missing / non-positive `maxSize` accepts every file.
 */
export function fileWithinMaxSize(file: File, maxSize?: number): boolean {
  if (isNil(maxSize) || maxSize <= 0) {
    return true;
  }

  return file.size <= maxSize;
}

/**
 * Formats a byte count for display (e.g. `1.5 MB`).
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }

  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }

  // eslint-disable-next-line perfectionist/sort-arrays -- KB → TB scale order
  const units = ["KB", "MB", "GB", "TB"] as const;

  let unitIndex = 0;
  let value = bytes / 1024;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const rounded = value < 10 ? value.toFixed(1) : String(Math.round(value));

  return `${rounded} ${units[unitIndex]}`;
}

/**
 * Returns whether `file` is an image suitable for an inline preview.
 */
export function isImageFile(file: File): boolean {
  return (file.type || "").toLowerCase().startsWith("image/");
}

/**
 * Returns whether `value` can show an image preview.
 * Uses the MIME type (`File.type` or remote `type`), then the extension of `name` or `url`.
 */
export function isImageUploadValue(value: FileUploadValue): boolean {
  if ((value.type || "").toLowerCase().startsWith("image/")) {
    return true;
  }

  if (isFileUploadRemote(value)) {
    return hasImageExtension(value.name) || hasImageExtension(value.url ?? "");
  }

  return false;
}

/**
 * Preview URL for an upload item.
 * Remote images use `url`. Browser images use `objectUrl`.
 */
export function getFileUploadPreviewUrl(
  value: FileUploadValue,
  objectUrl?: string,
): string | undefined {
  if (!isImageUploadValue(value)) {
    return undefined;
  }

  if (isFileUploadRemote(value)) {
    return value.url;
  }

  return objectUrl;
}

/**
 * List key from the file name and index.
 * A `File` and a remote item are told apart by object identity, not by an id.
 */
export function getFileUploadItemKey(
  value: FileUploadValue,
  index: number,
): string {
  return `${value.name}-${index}`;
}

/**
 * Short type label from the file name extension or MIME subtype (e.g. `PDF`).
 */
export function getFileTypeLabel(file: {
  name: string;
  type?: string;
}): string {
  const name = file.name.trim();
  const dot = name.lastIndexOf(".");

  if (dot > 0 && dot < name.length - 1) {
    return name.slice(dot + 1).toUpperCase();
  }

  const subtype = (file.type || "").split("/")[1];

  if (subtype) {
    return subtype.split("+")[0]!.toUpperCase();
  }

  return "FILE";
}

/**
 * Metadata line for a file card (e.g. `PNG · 820 KB`).
 */
export function formatFileMeta(file: FileUploadValue): string {
  const typeLabel = getFileTypeLabel(file);

  if (isNil(file.size)) {
    return typeLabel;
  }

  return `${typeLabel} · ${formatFileSize(file.size)}`;
}

/**
 * Filters `incoming` against accept / maxSize / maxFiles relative to `current`.
 * `accept` and `maxSize` apply only to incoming `File`s. Remote items already
 * in `current` are not revalidated, and they count toward `maxFiles`.
 * When `multiple` is false, only the first valid incoming file is kept and
 * it replaces the current selection.
 */
export function filterFileUploadSelection(
  current: FileUploadValue[],
  incoming: File[],
  options: FileUploadFilterOptions = {},
): FileUploadFilterResult {
  const { accept, maxSize, maxFiles, multiple = false } = options;
  const accepted: File[] = [];
  const rejected: FileUploadRejectedFile[] = [];

  if (!multiple) {
    for (const file of incoming) {
      if (!fileMatchesAccept(file, accept)) {
        rejected.push({ file, reason: "accept" });
        continue;
      }

      if (!fileWithinMaxSize(file, maxSize)) {
        rejected.push({ file, reason: "maxSize" });
        continue;
      }

      if (accepted.length === 0) {
        accepted.push(file);
      } else {
        rejected.push({ file, reason: "maxFiles" });
      }
    }

    return { accepted, rejected };
  }

  const remaining =
    !isNil(maxFiles) && maxFiles > 0
      ? clamp(maxFiles - current.length, 0, maxFiles)
      : Number.POSITIVE_INFINITY;

  for (const file of incoming) {
    if (!fileMatchesAccept(file, accept)) {
      rejected.push({ file, reason: "accept" });
      continue;
    }

    if (!fileWithinMaxSize(file, maxSize)) {
      rejected.push({ file, reason: "maxSize" });
      continue;
    }

    if (accepted.length >= remaining) {
      rejected.push({ file, reason: "maxFiles" });
      continue;
    }

    accepted.push(file);
  }

  return { accepted, rejected };
}

/**
 * Builds the next controlled list from `current` and validated `incoming`.
 */
export function mergeFileUploadSelection(
  current: FileUploadValue[],
  incoming: File[],
  options: FileUploadFilterOptions = {},
): FileUploadMergeResult {
  const filtered = filterFileUploadSelection(current, incoming, options);

  if (!options.multiple) {
    return filtered;
  }

  return {
    rejected: filtered.rejected,
    accepted: [...current, ...filtered.accepted],
  };
}

/**
 * Removes the item at `index` from `items` (immutable).
 */
export function removeFileAtIndex<T>(items: T[], index: number): T[] {
  if (index < 0 || index >= items.length) {
    return items;
  }

  return items.filter((_, i) => i !== index);
}
