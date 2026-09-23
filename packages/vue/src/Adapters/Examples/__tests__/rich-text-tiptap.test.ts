// ** External Imports
import { afterEach, describe, expect, test } from "vitest";

// ** Local Imports
import { createTiptapRichTextAdapter } from "@/Adapters/Examples/rich-text-tiptap";

describe("createTiptapRichTextAdapter", () => {
  let host: HTMLDivElement;

  afterEach(() => {
    host?.remove();
  });

  test("it should mount, edit html, and destroy", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    const adapter = createTiptapRichTextAdapter();
    const changes: string[] = [];

    const handle = adapter.mount({
      element: host,
      format: "html",
      value: "<p>Hello</p>",
      tools: ["bold", "italic"],
      onChange: (value) => {
        changes.push(String(value));
      },
    });

    expect(handle.getValue()).toContain("Hello");

    handle.run("bold");
    handle.setValue("<p>World</p>");
    expect(handle.getValue()).toContain("World");

    handle.destroy();
  });

  test("it should support json format", () => {
    host = document.createElement("div");
    document.body.appendChild(host);

    const adapter = createTiptapRichTextAdapter();

    const handle = adapter.mount({
      element: host,
      format: "json",
      tools: ["bold"],
      onChange: () => {},
      value: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "JSON" }],
          },
        ],
      },
    });

    const value = handle.getValue();
    expect(typeof value).toBe("object");
    expect(JSON.stringify(value)).toContain("JSON");

    handle.destroy();
  });
});
