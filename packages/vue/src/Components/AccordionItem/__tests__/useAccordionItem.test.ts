// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { Accordion } from "@/Components/Accordion";
import { useAccordionItem } from "@/Components/AccordionItem/composables/useAccordionItem";

function mountUseAccordionItem(value: string) {
  let result!: ReturnType<typeof useAccordionItem>;

  const ItemHost = defineComponent({
    setup() {
      result = useAccordionItem({
        value,
        title: value === "a" ? "Shipping" : "Returns",
      });

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      return () =>
        h(
          Accordion,
          { modelValue: "a", multiple: false },
          { default: () => h(ItemHost) },
        );
    },
  });

  mount(Wrapper);

  return { result };
}

test("it should mark the matching item as expanded", () => {
  const { result } = mountUseAccordionItem("a");

  expect(result.expanded.value).toBe(true);
  expect(result.triggerBind.value["aria-expanded"]).toBe(true);
});

test("it should mark a different item as collapsed", () => {
  const { result } = mountUseAccordionItem("b");

  expect(result.expanded.value).toBe(false);
});
