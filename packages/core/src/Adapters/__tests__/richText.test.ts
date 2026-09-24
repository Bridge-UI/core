// @vitest-environment happy-dom

/**
 * Core unit tests for RichTextEditor adapter helpers.
 */

// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  applyRichTextEditableA11y,
  DEFAULT_RICH_TEXT_TOOLS,
  isRichTextTool,
  RICH_TEXT_TOOL_ICONS,
  RICH_TEXT_TOOL_LABELS,
  RICH_TEXT_TOOLS,
  richTextValuesEqual,
} from "@/Adapters/richText";

describe("isRichTextTool", () => {
  test("it should accept known tools", () => {
    expect(isRichTextTool("bold")).toBe(true);
    expect(isRichTextTool("codeBlock")).toBe(true);
  });

  test("it should reject unknown values", () => {
    expect(isRichTextTool("boldx")).toBe(false);
    expect(isRichTextTool(null)).toBe(false);
  });
});

describe("RICH_TEXT_TOOLS", () => {
  test("it should cover default tools and label/icon maps", () => {
    for (const tool of RICH_TEXT_TOOLS) {
      expect(DEFAULT_RICH_TEXT_TOOLS).toContain(tool);
      expect(RICH_TEXT_TOOL_LABELS[tool]).toBeTruthy();
      expect(RICH_TEXT_TOOL_ICONS[tool]).toBeTruthy();
    }
  });
});

describe("richTextValuesEqual", () => {
  test("it should treat the same html string as equal", () => {
    expect(richTextValuesEqual("<p>a</p>", "<p>a</p>")).toBe(true);
  });

  test("it should treat nil and a value as different", () => {
    expect(richTextValuesEqual(undefined, "<p></p>")).toBe(false);
  });

  test("it should compare json documents", () => {
    expect(richTextValuesEqual({ type: "doc" }, { type: "doc" })).toBe(true);

    expect(richTextValuesEqual({ type: "doc" }, { type: "other" })).toBe(false);
  });
});

describe("applyRichTextEditableA11y", () => {
  test("it should set and clear aria-invalid", () => {
    const editable = document.createElement("div");

    applyRichTextEditableA11y(editable, { ariaInvalid: true });

    expect(editable.getAttribute("role")).toBe("textbox");
    expect(editable.getAttribute("aria-invalid")).toBe("true");

    applyRichTextEditableA11y(editable, { ariaInvalid: false });

    expect(editable.getAttribute("aria-invalid")).toBeNull();
  });
});
