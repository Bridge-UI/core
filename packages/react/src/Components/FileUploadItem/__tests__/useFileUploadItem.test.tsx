// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Core Imports
import {
  fileUploadOrientationProps,
  fileUploadStateProps,
} from "@bridge-ui/core/Tokens";

// ** Local Imports
import FileUploadContext from "@/Components/FileUpload/FileUploadContext";
import type { FileUploadItemSlotProps } from "@/Components/FileUpload/fileUpload.types";
import { useFileUploadItem } from "@/Components/FileUploadItem/hooks/useFileUploadItem";

afterEach(() => {
  cleanup();
});

const file = new File(["hello"], "note.txt", { type: "text/plain" });

const item = {
  index: 0,
  value: file,
  isImage: false,
  metaLabel: "TXT",
  sizeLabel: "5 B",
  remove: () => undefined,
} satisfies FileUploadItemSlotProps;

function wrapper({ children }: { children: ReactNode }) {
  return (
    <FileUploadContext.Provider
      value={{
        size: "md",
        rounded: "md",
        disabled: false,
        color: "primary",
        orientation: "horizontal",
        stateItems: fileUploadStateProps,
        mediaBind: { className: "media" },
        actionsBind: { className: "actions" },
        contentBind: { className: "content" },
        orientationItems: fileUploadOrientationProps,
        descriptionBind: { className: "description" },
        titleBind: { className: "title text-dark-900" },
        getItemBind: () => ({ className: "item w-full flex-row" }),
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
}

test("it should describe a file without an upload state", () => {
  const { result } = renderHook(() => useFileUploadItem(item), { wrapper });

  expect(result.current.showRetry).toBe(false);
  expect(result.current.showDescription).toBe(true);
  expect(result.current.statusLabel).toContain("TXT");
  expect(result.current.media).toEqual({
    spin: false,
    kind: "icon",
    icon: "download",
  });
});

test("it should mark an uploading card and hide xs meta", () => {
  const { result } = renderHook(
    () =>
      useFileUploadItem({
        ...item,
        value: { progress: 64, name: "a.pdf", state: "uploading" },
      }),
    {
      wrapper: ({ children }) => (
        <FileUploadContext.Provider
          value={{
            size: "xs",
            rounded: "md",
            mediaBind: {},
            actionsBind: {},
            contentBind: {},
            color: "primary",
            descriptionBind: {},
            orientation: "horizontal",
            stateItems: fileUploadStateProps,
            titleBind: { className: "text-dark-900" },
            getItemBind: () => ({ className: "item" }),
            orientationItems: fileUploadOrientationProps,
          }}
        >
          {children}
        </FileUploadContext.Provider>
      ),
    },
  );

  expect(result.current.showDescription).toBe(true);
  expect(result.current.statusLabel).toBe("Uploading · 64%");
  expect(String(result.current.titleBind.className)).toContain("animate-pulse");
  expect(result.current.media).toEqual({
    spin: true,
    kind: "icon",
    icon: "loader",
  });
});

test("it should hide the state line when description is cleared", () => {
  const { result: empty } = renderHook(
    () =>
      useFileUploadItem({
        ...item,
        description: "",
        value: { name: "a.pdf", state: "uploading" },
      }),
    { wrapper },
  );

  expect(empty.current.showDescription).toBe(false);

  const { result: cleared } = renderHook(
    () =>
      useFileUploadItem({
        ...item,
        description: null,
        value: { name: "a.pdf", state: "error" },
      }),
    { wrapper },
  );

  expect(cleared.current.showDescription).toBe(false);
});

test("it should replace the state line with description", () => {
  const { result } = renderHook(
    () =>
      useFileUploadItem({
        ...item,
        description: "Open preview dialog",
        value: { name: "a.pdf", state: "error" },
      }),
    { wrapper },
  );

  expect(result.current.showDescription).toBe(true);
  expect(result.current.statusLabel).toBe("Open preview dialog");
});

test("it should apply a vertical orientation override", () => {
  const { result } = renderHook(
    () => useFileUploadItem({ ...item, orientation: "vertical" }),
    { wrapper },
  );

  expect(result.current.rootBind["data-orientation"]).toBe("vertical");
  expect(String(result.current.rootBind.className)).toContain("flex-col");
});
