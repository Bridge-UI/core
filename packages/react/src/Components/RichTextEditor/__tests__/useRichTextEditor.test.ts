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

test("it should mark FormField invalidated when error is true", () => {
  const { result } = renderHook(() => useRichTextEditor({ error: true }));

  expect(result.current.formField.invalidated).toBe(true);
});

test("it should build toolbar button binds for a tool", () => {
  const { result } = renderHook(() => useRichTextEditor({}));

  const bind = result.current.getToolbarButtonBind("bold");

  expect(bind.size).toBe("md");
  expect(bind.icon).toBe("bold");
  expect(bind.density).toBe("mini");
  expect(bind.color).toBe("primary");
  expect(bind["aria-label"]).toBe("Bold");
});

test("it should pass color and size to toolbar buttons", () => {
  const { result } = renderHook(() =>
    useRichTextEditor({ size: "sm", color: "info" }),
  );

  const bind = result.current.getToolbarButtonBind("bold");

  expect(bind.size).toBe("sm");
  expect(bind.color).toBe("info");
});

test("it should use error color on toolbar buttons when invalidated", () => {
  const { result } = renderHook(() =>
    useRichTextEditor({ error: true, color: "info" }),
  );

  const bind = result.current.getToolbarButtonBind("bold");

  expect(bind.color).toBe("error");
});
