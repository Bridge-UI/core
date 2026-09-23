/**
 * Core unit tests for RichTextEditor adapter helpers.
 */

// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  DEFAULT_RICH_TEXT_TOOLS,
  isRichTextTool,
  RICH_TEXT_TOOL_ICONS,
  RICH_TEXT_TOOL_LABELS,
  RICH_TEXT_TOOLS,
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
