// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useRichTextEditor } from "@/Components/RichTextEditor";

test("it should default format to html", () => {
  const { result } = renderHook(() => useRichTextEditor({}));

  expect(result.current.format).toBe("html");
});

test("it should expose default tools", () => {
  const { result } = renderHook(() => useRichTextEditor({}));

  expect(result.current.tools).toContain("bold");
  expect(result.current.tools).toContain("link");
});

test("it should respect tools prop", () => {
  const { result } = renderHook(() =>
    useRichTextEditor({ tools: ["bold", "italic"] }),
  );

  expect(result.current.tools).toEqual(["bold", "italic"]);
});

test("it should hide toolbar when readOnly", () => {
  const { result } = renderHook(() => useRichTextEditor({ readOnly: true }));

  expect(result.current.showToolbar).toBe(false);
});

test("it should use textarea control tokens via FormField", () => {
  const { result } = renderHook(() => useRichTextEditor({}));

  expect(result.current.formField.control).toBe("textarea");
});

test("it should set aria-invalid on content when error is true", () => {
  const { result } = renderHook(() => useRichTextEditor({ error: true }));

  expect(result.current.contentBind["aria-invalid"]).toBe(true);
});

test("it should build toolbar button binds for a tool", () => {
  const { result } = renderHook(() => useRichTextEditor({}));

  const bind = result.current.getToolbarButtonBind("bold");

  expect(bind.density).toBe("mini");
  expect(bind["aria-label"]).toBe("Bold");
  expect(bind.icon).toBe("bold");
});
