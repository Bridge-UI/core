// ** External Imports
import { afterEach, describe, expect, test } from "vitest";

// ** Local Imports
import { createQuillRichTextAdapter } from "@/Adapters/Examples/rich-text-quill";

describe("createQuillRichTextAdapter", () => {
  let host: HTMLDivElement;

  afterEach(() => {
    host?.remove();
  });

  test("it should mount, edit html, and destroy", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    const adapter = createQuillRichTextAdapter();

    const handle = adapter.mount({
      element: host,
      format: "html",
      onChange: () => {},
      value: "<p>Hello</p>",
      tools: ["bold", "italic"],
    });

    expect(handle.getValue()).toContain("Hello");

    handle.run("bold");
    handle.setValue("<p>World</p>");
    expect(String(handle.getValue())).toContain("World");

    handle.destroy();
  });

  test("it should support json delta format", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    const adapter = createQuillRichTextAdapter();

    const handle = adapter.mount({
      element: host,
      format: "json",
      tools: ["bold"],
      onChange: () => {},
      value: {
        ops: [{ insert: "JSON\n" }],
      },
    });

    const value = handle.getValue();
    expect(typeof value).toBe("object");
    expect(JSON.stringify(value)).toContain("JSON");

    handle.destroy();
  });
});
