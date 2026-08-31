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
  expect(rootBind.value.class).toContain("px-2");
  expect(rootBind.value.class).toContain("py-2");
  expect(rootBind.value.class).toContain("list-none");
  expect(rootBind.value.class).toContain("flex");
  expect(rootBind.value.class).toContain("gap-1");
});

test("it should apply nested indent and a start-edge guide line", () => {
  const { rootBind } = mountUseList({ nested: true });

  expect(rootBind.value.class).toContain("border-l");
  expect(rootBind.value.class).toContain("ml-3.5");
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

test("it should provide iconOnly context to descendants", () => {
  let injectedIconOnly = "missing";

  const Probe = defineComponent({
    setup() {
      const context = inject(LIST_INJECTION_KEY, null);

      injectedIconOnly = String(
        context ? toValue(context).iconOnly : "missing",
      );

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      useList({ iconOnly: true });

      return () => h(Probe);
    },
  });

  mount(Wrapper);

  expect(injectedIconOnly).toBe("true");
});

test("it should inherit iconOnly from parent List context", () => {
  let injectedIconOnly = "missing";

  const Probe = defineComponent({
    setup() {
      const context = inject(LIST_INJECTION_KEY, null);

      injectedIconOnly = String(
        context ? toValue(context).iconOnly : "missing",
      );

      return () => h("div");
    },
  });

  const Inner = defineComponent({
    setup() {
      useList({});

      return () => h(Probe);
    },
  });

  const Outer = defineComponent({
    setup() {
      useList({ iconOnly: true });

      return () => h(Inner);
    },
  });

  mount(Outer);

  expect(injectedIconOnly).toBe("true");
});

test("it should hide nested lists when an ancestor is iconOnly", () => {
  let result!: ReturnType<typeof useList>;

  const Inner = defineComponent({
    setup() {
      result = useList({ nested: true });

      return () => h("div");
    },
  });

  const Outer = defineComponent({
    setup() {
      useList({ iconOnly: true });

      return () => h(Inner);
    },
  });

  mount(Outer);

  expect(result.rootBind.value.hidden).toBe(true);
  expect(result.rootBind.value.class).toContain("hidden");
});

test("it should merge class into root bind", () => {
  const { rootBind } = mountUseList({ class: "custom-list" });

  expect(rootBind.value.class).toContain("custom-list");
});
