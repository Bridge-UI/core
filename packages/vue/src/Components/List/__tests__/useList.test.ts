// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, inject, toValue } from "vue";

// ** Local Imports
import {
  LIST_INJECTION_KEY,
  useList,
  type ListOwnProps,
} from "@/Components/List";

function mountUseList(props: Partial<ListOwnProps> = {}) {
  let result!: ReturnType<typeof useList>;

  const Wrapper = defineComponent({
    setup() {
      result = useList(props);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should apply list root classes", () => {
  const { rootBind } = mountUseList();

  expect(rootBind.value.class).toContain("m-0");
  expect(rootBind.value.class).toContain("py-2");
  expect(rootBind.value.class).toContain("list-none");
});

test("it should apply nested indent when nested is true", () => {
  const { rootBind } = mountUseList({ nested: true });

  expect(rootBind.value.class).toContain("pl-4");
});

test("it should provide dense context to descendants", () => {
  let injectedDense = "missing";

  const Probe = defineComponent({
    setup() {
      const context = inject(LIST_INJECTION_KEY, null);

      injectedDense = String(context ? toValue(context).dense : "missing");

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      useList({ dense: true });

      return () => h(Probe);
    },
  });

  mount(Wrapper);

  expect(injectedDense).toBe("true");
});

test("it should merge class into root bind", () => {
  const { rootBind } = mountUseList({ class: "custom-list" });

  expect(rootBind.value.class).toContain("custom-list");
});
