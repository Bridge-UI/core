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

const libDefaults = {
  padding: "normal",
} as const satisfies Partial<ListOwnProps>;

function mountUseList(props: Partial<ListOwnProps> = {}) {
  let result!: ReturnType<typeof useList>;

  const Wrapper = defineComponent({
    setup() {
      result = useList(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should return default padding as normal", () => {
  const { merged } = mountUseList();

  expect(merged.value.padding).toBe("normal");
});

test("it should override padding when prop is passed", () => {
  const { merged } = mountUseList({ padding: "none" });

  expect(merged.value.padding).toBe("none");
});

test("it should apply list root classes", () => {
  const { rootBind } = mountUseList();

  expect(rootBind.value.class).toContain("m-0");
  expect(rootBind.value.class).toContain("list-none");
});

test("it should apply padding classes on root bind", () => {
  const none = mountUseList({ padding: "none" });
  const normal = mountUseList({ padding: "normal" });

  expect(none.rootBind.value.class).toContain("p-0");
  expect(normal.rootBind.value.class).toContain("py-2");
});

test("it should apply nested indent on root bind", () => {
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
      useList({ dense: true }, libDefaults);

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
