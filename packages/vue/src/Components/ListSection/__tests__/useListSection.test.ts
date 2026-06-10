// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { computed, defineComponent, h, provide } from "vue";

// ** Local Imports
import { LIST_INJECTION_KEY } from "@/Components/List";
import {
  useListSection,
  type ListSectionOwnProps,
} from "@/Components/ListSection";

function mountUseListSection(
  props: Partial<ListSectionOwnProps> = {},
  slots: Record<string, () => unknown> = {},
) {
  let result!: ReturnType<typeof useListSection>;

  const Wrapper = defineComponent({
    setup() {
      result = useListSection(
        props,
        slots as Parameters<typeof useListSection>[1],
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should resolve label from title prop", () => {
  const { label } = mountUseListSection({ title: "Settings" });

  expect(typeof label.value).toBe("function");
});

test("it should apply section title classes", () => {
  const { titleBind } = mountUseListSection({ title: "Settings" });

  expect(titleBind.value.class).toContain("uppercase");
  expect(titleBind.value.class).toContain("text-xs");
  expect(titleBind.value.role).toBe("presentation");
});

test("it should apply sticky classes when sticky is true", () => {
  const { titleBind } = mountUseListSection({ sticky: true, title: "Sticky" });

  expect(titleBind.value.class).toContain("sticky");
});

test("it should apply inset padding when inset is true", () => {
  const { titleBind } = mountUseListSection({ inset: true, title: "Inset" });

  expect(titleBind.value.class).toContain("pl-14");
});

test("it should inherit dense padding from parent List context", () => {
  let result!: ReturnType<typeof useListSection>;

  const Consumer = defineComponent({
    setup() {
      result = useListSection({ title: "Dense section" }, {});

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      provide(
        LIST_INJECTION_KEY,
        computed(() => ({ dense: true })),
      );

      return () => h(Consumer);
    },
  });

  mount(Wrapper);

  expect(result.titleBind.value.class).toContain("py-1.5");
  expect(result.titleBind.value.class).not.toContain("py-2");
});

test("it should apply list-none on root bind", () => {
  const { rootBind } = mountUseListSection({ title: "Section" });

  expect(rootBind.value.class).toContain("list-none");
});
