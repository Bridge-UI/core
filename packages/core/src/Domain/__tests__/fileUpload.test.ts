// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  fileMatchesAccept,
  fileWithinMaxSize,
  filesFromFileList,
  filterFileUploadSelection,
  formatFileMeta,
  formatFileSize,
  getFileTypeLabel,
  isImageFile,
  mergeFileUploadSelection,
  removeFileAtIndex,
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
