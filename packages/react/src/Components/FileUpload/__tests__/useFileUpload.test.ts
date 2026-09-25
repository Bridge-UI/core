// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { isString } from "es-toolkit/compat";
import { createElement, type DragEvent } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useFileUpload,
  type FileUploadOwnProps,
  type FileUploadProps,
} from "@/Components/FileUpload";
import { BridgeUIProvider } from "@/Provider";

const libDefaults = {
  size: "md",
  rounded: "md",
  multiple: false,
  color: "primary",
  variant: "button",
  orientation: "horizontal",
} as const satisfies Partial<FileUploadOwnProps>;

function renderUseFileUpload(
  props: FileUploadProps = {},
  options: { registryColor?: FileUploadOwnProps["color"] } = {},
) {
  return renderHook(
    () =>
      useFileUpload(props, libDefaults as Parameters<typeof useFileUpload>[1]),
    {
      wrapper: ({ children }) => {
        if (!("registryColor" in options)) {
          return children;
        }

        return createElement(BridgeUIProvider, {
          children,
          components: {
            FileUpload: {
              defaultProps: { color: options.registryColor },
            },
          },
        });
      },
    },
  );
}

function dragEnter(
  handler: undefined | ((event: DragEvent<HTMLDivElement>) => void),
) {
  act(() => {
    handler?.({
      preventDefault() {},
      stopPropagation() {},
    } as DragEvent<HTMLDivElement>);
  });
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

  expect(isString(result.current.baseField.rootBind.className)).toBe(true);
  expect(result.current.baseField.rootBind.className.length).toBeGreaterThan(0);
});

test("it should default buttonLabel based on multiple", () => {
  const single = renderUseFileUpload();
  const multi = renderUseFileUpload({ multiple: true });

  expect(multi.result.current.buttonLabel).toBe("Choose files");
  expect(single.result.current.buttonLabel).toBe("Choose file");
});

test("it should default color to primary", () => {
  const { result } = renderUseFileUpload();

  expect(result.current.merged.color).toBe("primary");
});

test("it should default rounded to md", () => {
  const { result } = renderUseFileUpload();

  expect(result.current.merged.rounded).toBe("md");
});

test("it should override color when prop is passed", () => {
  const { result } = renderUseFileUpload({ color: "secondary" });

  expect(result.current.merged.color).toBe("secondary");
});

test("it should override rounded when prop is passed", () => {
  const { result } = renderUseFileUpload({ rounded: "xl" });

  expect(result.current.merged.rounded).toBe("xl");
});

test("it should apply rounded class on dropzoneBind", () => {
  const { result } = renderUseFileUpload({
    rounded: "xl",
    variant: "dropzone",
  });

  expect(String(result.current.dropzoneBind.className)).toContain("rounded-xl");
});

test("it should hide the picker when a single file is selected", () => {
  const file = new File(["x"], "a.txt", { type: "text/plain" });
  const { result } = renderUseFileUpload({ value: file });

  expect(result.current.showPicker).toBe(false);
  expect(result.current.fileItems).toHaveLength(1);
  expect(result.current.fileItems[0]?.metaLabel).toContain("TXT");
});

test("it should expose dropzoneBind role button", () => {
  const { result } = renderUseFileUpload({ variant: "dropzone" });

  expect(result.current.dropzoneBind.role).toBe("button");
});

test("it should tint the dropzone with the color prop while dragging", () => {
  const { result } = renderUseFileUpload({
    color: "success",
    variant: "dropzone",
  });

  dragEnter(result.current.dropzoneBind.onDragEnter);

  expect(String(result.current.dropzoneBind.className)).toContain(
    "border-success-500",
  );
  expect(String(result.current.dropzoneBind.className)).not.toContain(
    "border-primary-500",
  );
});

test("it should tint the dropzone with the registry color while dragging", () => {
  const { result } = renderUseFileUpload(
    { variant: "dropzone" },
    { registryColor: "info" },
  );

  dragEnter(result.current.dropzoneBind.onDragEnter);

  expect(String(result.current.dropzoneBind.className)).toContain(
    "border-info-500",
  );
});

test("it should describe a remote item on fileItems", () => {
  const { result } = renderUseFileUpload({
    value: {
      size: 10,
      name: "photo.png",
      type: "image/png",
      url: "https://cdn.example/photo.png",
    },
  });

  expect(result.current.fileItems[0]?.value).toMatchObject({
    name: "photo.png",
  });
  expect(result.current.fileItems[0]?.isImage).toBe(true);
  expect(result.current.fileItems[0]?.previewUrl).toBe(
    "https://cdn.example/photo.png",
  );
});
