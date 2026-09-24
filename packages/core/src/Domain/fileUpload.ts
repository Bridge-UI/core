// ** External Imports
import { clamp, isNil } from "es-toolkit/compat";

/**
 * Reason a file was rejected by FileUpload validation.
 */
export type FileUploadRejectReason = "accept" | "maxSize" | "maxFiles";

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
 * Short type label from the file name extension or MIME subtype (e.g. `PDF`).
 */
export function getFileTypeLabel(file: File): string {
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
export function formatFileMeta(file: File): string {
  return `${getFileTypeLabel(file)} · ${formatFileSize(file.size)}`;
}

/**
 * Filters `incoming` against accept / maxSize / maxFiles relative to `current`.
 * When `multiple` is false, only the first valid incoming file is kept and
 * it replaces the current selection.
 */
export function filterFileUploadSelection(
  current: File[],
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
 * Builds the next controlled file list from `current` and validated `incoming`.
 */
export function mergeFileUploadSelection(
  current: File[],
  incoming: File[],
  options: FileUploadFilterOptions = {},
): FileUploadFilterResult {
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
 * Removes the file at `index` from `files` (immutable).
 */
export function removeFileAtIndex(files: File[], index: number): File[] {
  if (index < 0 || index >= files.length) {
    return files;
  }

  return files.filter((_, i) => i !== index);
}
