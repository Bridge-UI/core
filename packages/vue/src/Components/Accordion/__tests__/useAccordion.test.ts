// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref, type Ref } from "vue";

// ** Core Imports
import type { AccordionValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import type { AccordionOwnProps } from "@/Components/Accordion/accordion.types";
import { useAccordion } from "@/Components/Accordion/composables/useAccordion";

const libDefaults = {
  size: "md",
  multiple: false,
  disabled: false,
  color: "primary",
  variant: "default",
} as const;

function mountUseAccordion(
  props: Partial<AccordionOwnProps> = {},
  model: Ref<undefined | AccordionValue> = ref("a"),
) {
  let result!: ReturnType<typeof useAccordion>;
  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useAccordion(
        props,
        libDefaults as Parameters<typeof useAccordion>[1],
        model,
        emit as Parameters<typeof useAccordion>[3],
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { emit, model, result };
}

test("it should expose context defaults from useAccordion", () => {
  const { result } = mountUseAccordion({}, ref("a"));

  expect(result.contextValue.value.expanded).toBe("a");
  expect(result.contextValue.value.multiple).toBe(false);
  expect(result.contextValue.value.disabled).toBe(false);
});

test("it should emit change and update:modelValue when toggling an item", () => {
  const { emit, model, result } = mountUseAccordion({}, ref("a"));

  result.contextValue.value.registerItem("a");
  result.contextValue.value.registerItem("b");
  result.contextValue.value.toggleItem("b");

  expect(model.value).toBe("b");
  expect(emit).toHaveBeenCalledWith("change", "b");
  expect(emit).toHaveBeenCalledWith("update:modelValue", "b");
});

test("it should not toggle a disabled item", () => {
  const { emit, model, result } = mountUseAccordion({}, ref("a"));

  result.contextValue.value.registerItem("a");
  result.contextValue.value.registerItem("b", true);
  result.contextValue.value.toggleItem("b");

  expect(model.value).toBe("a");
  expect(emit).not.toHaveBeenCalled();
});
