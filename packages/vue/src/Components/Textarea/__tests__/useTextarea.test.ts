// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useTextarea, type TextareaOwnProps } from "@/Components/Textarea";

function mountUseTextarea(props: TextareaOwnProps = {}) {
  let result!: ReturnType<typeof useTextarea>;
  const textareaRef = ref<null | HTMLTextAreaElement>(null);

  const Wrapper = defineComponent({
    setup() {
      result = useTextarea(props, textareaRef);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default autosize to false", () => {
  const { textareaBind } = mountUseTextarea();

  expect(textareaBind.value.class).not.toContain("overflow-hidden");
});

test("it should enable autosize by default when likeInput is true", () => {
  const { textareaBind } = mountUseTextarea({ likeInput: true });

  expect(textareaBind.value.class).toContain("overflow-hidden");
});

test("it should use textarea control tokens", () => {
  const { formField } = mountUseTextarea();

  expect(formField.control.value).toBe("textarea");
  expect(formField.inputBind.value.class).toContain("py-2");
});

test("it should apply resize-none when autosize is true", () => {
  const { textareaBind } = mountUseTextarea({ autosize: true });

  expect(textareaBind.value.class).toContain("resize-none");
});

test("it should apply vertical resize class when resize is vertical", () => {
  const { textareaBind } = mountUseTextarea({ resize: "vertical" });

  expect(textareaBind.value.class).toContain("resize-y");
});

test("it should default rows to 1 when likeInput is true", () => {
  const { textareaBind } = mountUseTextarea({ likeInput: true });

  expect(textareaBind.value.rows).toBe(1);
});

test("it should set aria-invalid when error is true", () => {
  const { formField } = mountUseTextarea({ error: true });

  expect(formField.inputBind.value["aria-invalid"]).toBe(true);
});
