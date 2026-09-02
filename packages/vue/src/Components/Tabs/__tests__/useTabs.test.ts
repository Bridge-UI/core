// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref, type Ref } from "vue";

// ** Local Imports
import { useTabs } from "@/Components/Tabs/composables/useTabs";
import type { TabsOwnProps } from "@/Components/Tabs/tabs.types";

const libDefaults = {
  size: "md",
  color: "dark",
  variant: "pill",
  keepMounted: true,
  activation: "automatic",
  orientation: "horizontal",
} as const;

function mountUseTabs(
  props: Partial<TabsOwnProps> = {},
  model: Ref<string | undefined> = ref("a"),
) {
  let result!: ReturnType<typeof useTabs>;
  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useTabs(
        props,
        libDefaults as Parameters<typeof useTabs>[1],
        model,
        emit as Parameters<typeof useTabs>[3],
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { emit, model, result };
}

test("it should expose context defaults from useTabs", () => {
  const { result } = mountUseTabs({}, ref("a"));

  expect(result.contextValue.value.selected).toBe("a");
  expect(result.contextValue.value.activation).toBe("automatic");
  expect(result.contextValue.value.orientation).toBe("horizontal");
});

test("it should register tabs and auto-select the first enabled one", () => {
  const model = ref<string | undefined>("");
  const { result } = mountUseTabs({}, model);

  result.contextValue.value.registerTab("a");
  result.contextValue.value.registerTab("b");

  expect(model.value).toBe("a");
  expect(result.contextValue.value.tabValues).toEqual(["a", "b"]);
});

test("it should emit change and update:modelValue when selecting a tab", () => {
  const { emit, model, result } = mountUseTabs({}, ref("a"));

  result.contextValue.value.registerTab("a");
  result.contextValue.value.registerTab("b");
  result.contextValue.value.setSelected("b");

  expect(model.value).toBe("b");
  expect(emit).toHaveBeenCalledWith("change", "b");
  expect(emit).toHaveBeenCalledWith("update:modelValue", "b");
});

test("it should not select a disabled tab", () => {
  const { emit, model, result } = mountUseTabs({}, ref("a"));

  result.contextValue.value.registerTab("a");
  result.contextValue.value.registerTab("b", true);
  result.contextValue.value.setSelected("b");

  expect(model.value).toBe("a");
  expect(emit).not.toHaveBeenCalled();
});
