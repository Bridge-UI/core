// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  fileMatchesAccept,
  fileUploadItemsFromModel,
  fileUploadModelFromItems,
  fileWithinMaxSize,
  filesFromFileList,
  filterFileUploadSelection,
  formatFileMeta,
  formatFileSize,
  formatFileUploadStatusLabel,
  getFileTypeLabel,
  getFileUploadBrowserFile,
  getFileUploadItemKey,
  getFileUploadItemState,
  getFileUploadPreviewUrl,
  isFileUploadRemote,
  isImageFile,
  isImageUploadValue,
  mergeFileUploadSelection,
  removeFileAtIndex,
  resolveFileUploadItemMedia,
  shouldShowFileUploadDescription,
  type FileUploadRemote,
} from "@/Domain/fileUpload";

function makeFile(
  name: string,
  options: { size?: number; type?: string } = {},
): File {
  const { size = 0, type = "" } = options;
  const buffer = size > 0 ? new Uint8Array(size) : undefined;

  return new File(buffer ? [buffer] : [""], name, { type });
}

describe("filesFromFileList", () => {
  test("it should return an empty array for nullish input", () => {
    expect(filesFromFileList(null)).toEqual([]);
    expect(filesFromFileList(undefined)).toEqual([]);
  });

  test("it should convert a FileList into a File array", () => {
    const file = makeFile("a.txt", { type: "text/plain" });
    const list = {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
      [Symbol.iterator]: function* () {
        yield file;
      },
    } as unknown as FileList;

    expect(filesFromFileList(list)).toEqual([file]);
  });
});

describe("fileMatchesAccept", () => {
  test("it should accept every file when accept is empty", () => {
    expect(fileMatchesAccept(makeFile("a.png"), undefined)).toBe(true);
    expect(fileMatchesAccept(makeFile("a.png"), "")).toBe(true);
    expect(fileMatchesAccept(makeFile("a.png"), "  ")).toBe(true);
  });

  test("it should match file extensions", () => {
    expect(fileMatchesAccept(makeFile("doc.PDF"), ".pdf")).toBe(true);
    expect(fileMatchesAccept(makeFile("doc.txt"), ".pdf")).toBe(false);
  });

  test("it should match MIME types and wildcards", () => {
    expect(
      fileMatchesAccept(makeFile("a.png", { type: "image/png" }), "image/png"),
    ).toBe(true);
    expect(
      fileMatchesAccept(makeFile("a.png", { type: "image/png" }), "image/*"),
    ).toBe(true);
    expect(
      fileMatchesAccept(
        makeFile("a.png", { type: "image/png" }),
        "application/pdf",
      ),
    ).toBe(false);
  });

  test("it should match any token in a comma-separated accept list", () => {
    expect(
      fileMatchesAccept(
        makeFile("a.pdf", { type: "application/pdf" }),
        "image/*,.pdf",
      ),
    ).toBe(true);
  });
});

describe("fileWithinMaxSize", () => {
  test("it should accept every file when maxSize is missing or non-positive", () => {
    expect(fileWithinMaxSize(makeFile("a.txt", { size: 999 }), undefined)).toBe(
      true,
    );
    expect(fileWithinMaxSize(makeFile("a.txt", { size: 999 }), 0)).toBe(true);
  });

  test("it should reject files over the max size", () => {
    expect(fileWithinMaxSize(makeFile("a.txt", { size: 10 }), 10)).toBe(true);
    expect(fileWithinMaxSize(makeFile("a.txt", { size: 11 }), 10)).toBe(false);
  });
});

describe("formatFileSize", () => {
  test("it should format bytes and larger units", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(1024 * 1024)).toBe("1.0 MB");
  });

  test("it should treat invalid sizes as zero", () => {
    expect(formatFileSize(Number.NaN)).toBe("0 B");
    expect(formatFileSize(-4)).toBe("0 B");
  });
});

describe("getFileTypeLabel", () => {
  test("it should prefer the file extension", () => {
    expect(getFileTypeLabel(makeFile("photo.PNG"))).toBe("PNG");
    expect(getFileTypeLabel(makeFile("report.pdf"))).toBe("PDF");
  });

  test("it should fall back to the MIME subtype", () => {
    expect(getFileTypeLabel(makeFile("blob", { type: "image/jpeg" }))).toBe(
      "JPEG",
    );
  });
});

describe("isImageFile", () => {
  test("it should detect image MIME types", () => {
    expect(isImageFile(makeFile("a.png", { type: "image/png" }))).toBe(true);
    expect(isImageFile(makeFile("a.txt", { type: "text/plain" }))).toBe(false);
  });
});

describe("formatFileMeta", () => {
  test("it should join type and size", () => {
    expect(
      formatFileMeta(
        makeFile("workspace.png", { size: 820, type: "image/png" }),
      ),
    ).toBe("PNG · 820 B");
  });
});

describe("filterFileUploadSelection", () => {
  test("it should keep a single valid file when multiple is false", () => {
    const first = makeFile("a.png", { type: "image/png" });
    const second = makeFile("b.png", { type: "image/png" });
    const result = filterFileUploadSelection([], [first, second], {
      multiple: false,
      accept: "image/*",
    });

    expect(result.accepted).toEqual([first]);
    expect(result.rejected).toEqual([{ file: second, reason: "maxFiles" }]);
  });

  test("it should reject by accept and maxSize", () => {
    const badType = makeFile("a.txt", { type: "text/plain" });
    const tooBig = makeFile("b.png", { size: 20, type: "image/png" });
    const result = filterFileUploadSelection([], [badType, tooBig], {
      maxSize: 10,
      multiple: true,
      accept: "image/*",
    });

    expect(result.accepted).toEqual([]);
    expect(result.rejected).toEqual([
      { file: badType, reason: "accept" },
      { file: tooBig, reason: "maxSize" },
    ]);
  });

  test("it should respect remaining maxFiles slots", () => {
    const current = [makeFile("a.png", { type: "image/png" })];
    const next = makeFile("b.png", { type: "image/png" });
    const overflow = makeFile("c.png", { type: "image/png" });
    const result = filterFileUploadSelection(current, [next, overflow], {
      maxFiles: 2,
      multiple: true,
    });

    expect(result.accepted).toEqual([next]);
    expect(result.rejected).toEqual([{ file: overflow, reason: "maxFiles" }]);
  });
});

describe("mergeFileUploadSelection", () => {
  test("it should append accepted files when multiple is true", () => {
    const current = [makeFile("a.png", { type: "image/png" })];
    const next = makeFile("b.png", { type: "image/png" });
    const result = mergeFileUploadSelection(current, [next], {
      multiple: true,
    });

    expect(result.accepted).toEqual([...current, next]);
  });

  test("it should replace the selection when multiple is false", () => {
    const current = [makeFile("a.png", { type: "image/png" })];
    const next = makeFile("b.png", { type: "image/png" });
    const result = mergeFileUploadSelection(current, [next], {
      multiple: false,
    });

    expect(result.accepted).toEqual([next]);
  });
});

describe("isFileUploadRemote", () => {
  test("it should treat a plain attachment as remote and a File as local", () => {
    const remote: FileUploadRemote = {
      size: 10,
      name: "Diploma.pdf",
    };

    expect(isFileUploadRemote(remote)).toBe(true);
    expect(isFileUploadRemote(makeFile("a.txt"))).toBe(false);
  });
});

describe("isImageUploadValue", () => {
  test("it should use the MIME type, then the file extension", () => {
    const remote: FileUploadRemote = {
      size: 10,
      name: "photo.png",
      url: "https://cdn.example/photo.png?token=1",
    };
    const typed: FileUploadRemote = {
      size: 10,
      name: "blob",
      type: "image/png",
      url: "https://cdn.example/blob",
    };

    expect(isImageUploadValue(makeFile("a.png", { type: "image/png" }))).toBe(
      true,
    );
    expect(isImageUploadValue(typed)).toBe(true);
    expect(isImageUploadValue(remote)).toBe(true);
    expect(isImageUploadValue({ size: 10, name: "Diploma.pdf" })).toBe(false);
    expect(isImageUploadValue(makeFile("photo.png", { type: "" }))).toBe(true);
    expect(isImageUploadValue(makeFile("notes.txt", { type: "" }))).toBe(false);
  });
});

describe("getFileUploadPreviewUrl", () => {
  test("it should use the remote url for images and the object url for a File", () => {
    const remote: FileUploadRemote = {
      size: 10,
      name: "photo.png",
      url: "https://cdn.example/photo.png",
    };
    const file = makeFile("a.png", { type: "image/png" });

    expect(getFileUploadPreviewUrl(remote)).toBe(
      "https://cdn.example/photo.png",
    );
    expect(getFileUploadPreviewUrl(file, "blob:preview")).toBe("blob:preview");
    expect(
      getFileUploadPreviewUrl({ size: 10, name: "Diploma.pdf" }),
    ).toBeUndefined();
    expect(
      getFileUploadPreviewUrl(
        makeFile("photo.png", { type: "" }),
        "blob:preview",
      ),
    ).toBe("blob:preview");
  });
});

describe("getFileUploadItemKey", () => {
  test("it should use the file name plus index", () => {
    const file = makeFile("a.txt");

    expect(getFileUploadItemKey({ size: 10, name: "Diploma.pdf" }, 0)).toBe(
      "Diploma.pdf-0",
    );
    expect(getFileUploadItemKey(file, 2)).toBe("a.txt-2");
  });
});

describe("formatFileMeta remote", () => {
  test("it should omit the size when a remote attachment has only a name", () => {
    expect(formatFileMeta({ name: "Diploma.pdf" })).toBe("PDF");
  });

  test("it should format a remote attachment from its name and size", () => {
    expect(formatFileMeta({ size: 946 * 1024, name: "Diploma.pdf" })).toBe(
      "PDF · 946 KB",
    );
  });

  test("it should fall back to the MIME subtype when the name has no extension", () => {
    expect(
      formatFileMeta({
        size: 10,
        name: "blob",
        type: "application/pdf",
      }),
    ).toBe("PDF · 10 B");
  });
});

describe("filterFileUploadSelection remote", () => {
  test("it should count remote items toward maxFiles without revalidating them", () => {
    const remote: FileUploadRemote = {
      size: 999999,
      name: "old.exe",
    };
    const next = makeFile("a.png", { size: 4, type: "image/png" });
    const blocked = filterFileUploadSelection([remote], [next], {
      maxFiles: 1,
      maxSize: 10,
      multiple: true,
      accept: "image/*",
    });

    expect(blocked.accepted).toEqual([]);
    expect(blocked.rejected).toEqual([{ file: next, reason: "maxFiles" }]);

    const allowed = filterFileUploadSelection([remote], [next], {
      maxFiles: 2,
      maxSize: 10,
      multiple: true,
      accept: "image/*",
    });

    expect(allowed.accepted).toEqual([next]);
  });
});

describe("mergeFileUploadSelection remote", () => {
  test("it should keep remote items when appending a new file", () => {
    const remote: FileUploadRemote = {
      size: 10,
      name: "Diploma.pdf",
    };
    const next = makeFile("a.png", { type: "image/png" });
    const result = mergeFileUploadSelection([remote], [next], {
      multiple: true,
    });

    expect(result.accepted).toEqual([remote, next]);
  });
});

describe("fileUploadItemsFromModel", () => {
  test("it should read one item when multiple is false", () => {
    const file = makeFile("a.txt");

    expect(fileUploadItemsFromModel(null, false)).toEqual([]);
    expect(fileUploadItemsFromModel([file], false)).toEqual([]);
    expect(fileUploadItemsFromModel(file, false)).toEqual([file]);
    expect(fileUploadItemsFromModel(undefined, false)).toEqual([]);
  });

  test("it should read a list when multiple is true", () => {
    const file = makeFile("a.txt");

    expect(fileUploadItemsFromModel(null, true)).toEqual([]);
    expect(fileUploadItemsFromModel(file, true)).toEqual([]);
    expect(fileUploadItemsFromModel([file], true)).toEqual([file]);
  });
});

describe("fileUploadModelFromItems", () => {
  test("it should write one item or null when multiple is false", () => {
    const file = makeFile("a.txt");

    expect(fileUploadModelFromItems([], false)).toBeNull();
    expect(fileUploadModelFromItems([file], false)).toBe(file);
  });

  test("it should write the list when multiple is true", () => {
    const file = makeFile("a.txt");

    expect(fileUploadModelFromItems([], true)).toEqual([]);
    expect(fileUploadModelFromItems([file], true)).toEqual([file]);
  });
});

describe("removeFileAtIndex", () => {
  test("it should remove the file at the given index", () => {
    const files = [makeFile("a.txt"), makeFile("b.txt"), makeFile("c.txt")];

    expect(removeFileAtIndex(files, 1).map((file) => file.name)).toEqual([
      "a.txt",
      "c.txt",
    ]);
  });

  test("it should return the same array for out-of-range indexes", () => {
    const files = [makeFile("a.txt")];

    expect(removeFileAtIndex(files, -1)).toBe(files);
    expect(removeFileAtIndex(files, 2)).toBe(files);
  });
});

describe("formatFileUploadStatusLabel", () => {
  test("it should keep the type and size line when state is omitted", () => {
    expect(
      formatFileUploadStatusLabel(makeFile("notes.pdf", { size: 12 })),
    ).toContain("PDF");
  });

  test("it should describe each upload state", () => {
    expect(formatFileUploadStatusLabel({ name: "a.pdf", state: "idle" })).toBe(
      "Ready to upload",
    );
    expect(
      formatFileUploadStatusLabel({
        progress: 64,
        name: "a.pdf",
        state: "uploading",
      }),
    ).toBe("Uploading · 64%");
    expect(
      formatFileUploadStatusLabel({ name: "a.pdf", state: "processing" }),
    ).toBe("Processing document");
    expect(formatFileUploadStatusLabel({ name: "a.pdf", state: "error" })).toBe(
      "Upload failed. Try again.",
    );
    expect(
      formatFileUploadStatusLabel({
        name: "a.pdf",
        state: "done",
        size: 1.8 * 1024 * 1024,
      }),
    ).toBe("Uploaded · 1.8 MB");
  });

  test("it should prefer a custom description", () => {
    expect(
      formatFileUploadStatusLabel({
        name: "a.pdf",
        state: "done",
        description: "Open preview dialog",
      }),
    ).toBe("Open preview dialog");
  });
});

describe("shouldShowFileUploadDescription", () => {
  test("it should hide the default meta line at xs", () => {
    const file = makeFile("notes.pdf", { size: 12 });

    expect(shouldShowFileUploadDescription(file, "md")).toBe(true);
    expect(shouldShowFileUploadDescription(file, "xs")).toBe(false);
    expect(
      shouldShowFileUploadDescription(
        { progress: 10, name: "a.pdf", state: "uploading" },
        "xs",
      ),
    ).toBe(true);
    expect(
      shouldShowFileUploadDescription(
        { name: "a.pdf", description: "Open preview dialog" },
        "xs",
      ),
    ).toBe(true);
  });

  test("it should hide the line when description is cleared", () => {
    const uploading = {
      progress: 64,
      name: "a.pdf",
      state: "uploading" as const,
    };

    expect(
      shouldShowFileUploadDescription(
        { ...uploading, description: null },
        "xs",
      ),
    ).toBe(false);
    expect(
      shouldShowFileUploadDescription({ ...uploading, description: "" }, "md"),
    ).toBe(false);
  });
});

describe("resolveFileUploadItemMedia", () => {
  test("it should pick an icon from the upload state", () => {
    expect(
      resolveFileUploadItemMedia({ name: "a.pdf", state: "idle" }).kind,
    ).toBe("icon");
    expect(
      resolveFileUploadItemMedia({ name: "a.pdf", state: "uploading" }),
    ).toEqual({ spin: true, kind: "icon", icon: "loader" });
    expect(
      resolveFileUploadItemMedia({ name: "a.pdf", state: "error" }),
    ).toEqual({ spin: false, kind: "icon", icon: "error" });
    expect(
      resolveFileUploadItemMedia({ name: "a.pdf", state: "done" }),
    ).toEqual({ spin: false, kind: "icon", icon: "check" });
  });

  test("it should keep an image preview when the upload is done", () => {
    const value: FileUploadRemote = {
      state: "done",
      name: "photo.png",
      type: "image/png",
      url: "https://cdn.example/photo.png",
    };

    expect(resolveFileUploadItemMedia(value, value.url)).toEqual({
      kind: "image",
      src: value.url,
    });
  });
});

describe("getFileUploadBrowserFile", () => {
  test("it should return a nested file and its preview object url", () => {
    const file = makeFile("photo.png", { type: "image/png" });
    const value: FileUploadRemote = {
      file,
      name: file.name,
      type: file.type,
      state: "uploading",
    };

    expect(getFileUploadBrowserFile(file)).toBe(file);
    expect(getFileUploadBrowserFile(value)).toBe(file);
    expect(getFileUploadItemState(value)).toBe("uploading");
    expect(isImageUploadValue(value)).toBe(true);
    expect(getFileUploadPreviewUrl(value, "blob:photo")).toBe("blob:photo");
  });
});
