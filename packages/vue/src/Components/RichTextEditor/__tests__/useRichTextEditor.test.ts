// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import type { RichTextValue } from "@bridge-ui/core/Adapters";

// ** Local Imports
import { useRichTextEditor } from "@/Components/RichTextEditor";

function renderUseRichTextEditor(
  props: Parameters<typeof useRichTextEditor>[0] = {},
) {
  const model = ref<undefined | RichTextValue>(undefined);
  let api: undefined | ReturnType<typeof useRichTextEditor>;

  const Host = defineComponent({
    setup() {
      api = useRichTextEditor(props, model, (() => {}) as never, ref(null));
      return () => h("div");
    },
  });

  mount(Host);

  return api!;
}

test("it should default format to html", () => {
  const api = renderUseRichTextEditor();

  expect(api.format.value).toBe("html");
});

test("it should expose default tools", () => {
  const api = renderUseRichTextEditor();

  expect(api.tools.value).toContain("bold");
  expect(api.tools.value).toContain("link");
});

test("it should respect tools prop", () => {
  const api = renderUseRichTextEditor({ tools: ["bold", "italic"] });

  expect(api.tools.value).toEqual(["bold", "italic"]);
});

test("it should hide toolbar when readOnly", () => {
  const api = renderUseRichTextEditor({ readOnly: true });

  expect(api.showToolbar.value).toBe(false);
});

test("it should use textarea control tokens via FormField", () => {
  const api = renderUseRichTextEditor();

  expect(api.formField.control.value).toBe("textarea");
});

test("it should build toolbar button binds for a tool", () => {
  const api = renderUseRichTextEditor();

  const bind = api.getToolbarButtonBind("bold");

  expect(bind.density).toBe("mini");
  expect(bind["aria-label"]).toBe("Bold");
  expect(bind.icon).toBe("bold");
});
