// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useListbox, type ListboxOwnProps } from "@/Components/Listbox";

const libDefaults = {
  color: "primary",
} as const satisfies Partial<ListboxOwnProps>;

const baseProps = {
  listboxId: "listbox-id",
  options: [{ label: "One", value: "one" }],
} satisfies ListboxOwnProps;

function mountUseListbox(props: Partial<ListboxOwnProps> = {}) {
  let result!: ReturnType<typeof useListbox>;

  const Wrapper = defineComponent({
    setup() {
      result = useListbox({ ...baseProps, ...props }, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should return default color as primary", () => {
  const { merged } = mountUseListbox();

  expect(merged.value.color).toBe("primary");
});

test("it should override color when prop is passed", () => {
  const { merged } = mountUseListbox({ color: "error" });

  expect(merged.value.color).toBe("error");
});

test("it should expose color classes for options", () => {
  const { checkClass, optionSelectedClass, optionHighlightedClass } =
    mountUseListbox({ color: "primary" });

  expect(optionSelectedClass.value).toBeTruthy();
  expect(optionHighlightedClass.value).toBeTruthy();
  expect(checkClass.value).toBeTruthy();
});

test("it should merge registry classes", () => {
  const { mergedClasses } = mountUseListbox({
    classes: { check: "custom-check" },
  });

  expect(mergedClasses.value.check).toBe("custom-check");
});

test("it should apply default scroll classes", () => {
  const { scrollBind } = mountUseListbox();

  expect(scrollBind.value.class).toContain("max-h-60");
  expect(scrollBind.value.class).toContain("overflow-y-auto");
});

test("it should apply custom maxHeight tailwind class", () => {
  const { scrollBind } = mountUseListbox({ maxHeight: "max-h-80" });

  expect(scrollBind.value.class).toContain("max-h-80");
  expect(scrollBind.value.class).not.toContain("max-h-60");
});

test("it should disable max height when disableMaxHeight is true", () => {
  const { scrollBind } = mountUseListbox({ disableMaxHeight: true });

  expect(scrollBind.value.class).not.toContain("max-h-60");
  expect(scrollBind.value.class).not.toContain("overflow-y-auto");
});

test("it should apply scroll classes when props are reactive like defineProps", () => {
  let result!: ReturnType<typeof useListbox>;

  const Wrapper = defineComponent({
    props: {
      options: { type: Array, required: true },
      listboxId: { type: String, required: true },
    },
    setup(props) {
      result = useListbox(props as unknown as ListboxOwnProps, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper, {
    props: {
      listboxId: "test-listbox",
      options: [{ label: "Active", value: "active" }],
    },
  });

  expect(result.scrollBind.value.class).toContain("max-h-60");
});
