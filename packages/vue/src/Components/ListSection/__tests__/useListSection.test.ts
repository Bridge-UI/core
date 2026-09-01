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

function mountUseListSection(props: Partial<ListSectionOwnProps> = {}) {
  let result!: ReturnType<typeof useListSection>;

  const Wrapper = defineComponent({
    setup() {
      result = useListSection(props);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should apply section title classes", () => {
  const { titleBind } = mountUseListSection({ title: "Settings" });

  expect(titleBind.value.role).toBe("presentation");
  expect(titleBind.value.class).toContain("px-2");
  expect(titleBind.value.class).toContain("py-1.5");
  expect(titleBind.value.class).toContain("text-xs");
  expect(titleBind.value.class).toContain("font-medium");
  expect(titleBind.value.class).not.toContain("uppercase");
});

test("it should apply sticky classes on root when sticky is true", () => {
  const { rootBind, titleBind } = mountUseListSection({
    sticky: true,
    title: "Sticky",
  });

  expect(rootBind.value.class).toContain("sticky");
  expect(titleBind.value.class).not.toContain("sticky");
});

test("it should apply sticky classes on title when as is div", () => {
  const { titleBind } = mountUseListSection({
    as: "div",
    sticky: true,
    title: "Sticky",
  });

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
      result = useListSection({ title: "Dense section" });

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      provide(
        LIST_INJECTION_KEY,
        computed(() => {
          return { dense: true };
        }),
      );

      return () => h(Consumer);
    },
  });

  mount(Wrapper);

  expect(result.titleBind.value.class).toContain("py-1");
  expect(result.titleBind.value.class).not.toContain("py-1.5");
});

test("it should apply list-none on root bind", () => {
  const { rootBind } = mountUseListSection({ title: "Section" });

  expect(rootBind.value.class).toContain("mt-1");
  expect(rootBind.value.class).toContain("list-none");
  expect(rootBind.value.class).toContain("first:mt-0");
});
