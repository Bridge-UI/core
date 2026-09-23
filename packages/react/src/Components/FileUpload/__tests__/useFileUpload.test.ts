// ** External Imports
import { renderHook } from "@testing-library/react";
import { isString } from "es-toolkit/compat";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useFileUpload,
  type FileUploadOwnProps,
  type FileUploadProps,
} from "@/Components/FileUpload";

const libDefaults = {
  size: "md",
  multiple: false,
  variant: "button",
} as const satisfies Partial<FileUploadOwnProps>;

function renderUseFileUpload(props: FileUploadProps = {}) {
  return renderHook(() =>
    useFileUpload(props, libDefaults as Parameters<typeof useFileUpload>[1]),
  );
}

test("it should return default variant as button", () => {
  const { result } = renderUseFileUpload();

  expect(result.current.merged.variant).toBe("button");
  expect(result.current.isDropzone).toBe(false);
});

test("it should mark dropzone variant", () => {
  const { result } = renderUseFileUpload({ variant: "dropzone" });

  expect(result.current.isDropzone).toBe(true);
});

test("it should return default size as md", () => {
  const { result } = renderUseFileUpload();

  expect(result.current.merged.size).toBe("md");
});

test("it should compute rootBind className as a non-empty string", () => {
  const { result } = renderUseFileUpload();

  expect(isString(result.current.rootBind.className)).toBe(true);
  expect(result.current.rootBind.className.length).toBeGreaterThan(0);
});

test("it should default buttonLabel based on multiple", () => {
  const single = renderUseFileUpload();
  const multi = renderUseFileUpload({ multiple: true });

  expect(single.result.current.buttonLabel).toBe("Choose file");
  expect(multi.result.current.buttonLabel).toBe("Choose files");
});

test("it should hide the picker when a single file is selected", () => {
  const file = new File(["x"], "a.txt", { type: "text/plain" });
  const { result } = renderUseFileUpload({ value: [file] });

  expect(result.current.showPicker).toBe(false);
  expect(result.current.fileItems).toHaveLength(1);
  expect(result.current.fileItems[0]?.metaLabel).toContain("TXT");
});

test("it should expose dropzoneBind role button", () => {
  const { result } = renderUseFileUpload({ variant: "dropzone" });

  expect(result.current.dropzoneBind.role).toBe("button");
});
