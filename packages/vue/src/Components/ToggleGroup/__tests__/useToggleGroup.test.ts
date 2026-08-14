// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref, type Ref } from "vue";

// ** Local Imports
import { useToggleGroup } from "@/Components/ToggleGroup/composables/useToggleGroup";
import type { ToggleGroupOwnProps } from "@/Components/ToggleGroup/toggleGroup.types";

const libDefaults = {
  size: "md",
  full: false,
  rounded: "full",
  disabled: false,
  variant: "solid",
  color: "primary",
  orientation: "horizontal",
} as const;

function mountUseToggleGroup(
  props: Partial<ToggleGroupOwnProps> = {},
  model: Ref<string | undefined> = ref("a"),
) {
  let result!: ReturnType<typeof useToggleGroup>;
  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useToggleGroup(
        props,
        libDefaults as Parameters<typeof useToggleGroup>[1],
        model,
        emit as Parameters<typeof useToggleGroup>[3],
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { emit, model, result };
}

test("it should expose context defaults from useToggleGroup", () => {
  const { result } = mountUseToggleGroup({}, ref("a"));

  expect(result.contextValue.value.selected).toBe("a");
  expect(result.contextValue.value.orientation).toBe("horizontal");
  expect(result.contextValue.value.tokenClasses.softFill).toBe(true);
});

test("it should register toggles and auto-select the first enabled one", () => {
  const model = ref<string | undefined>("");
  const { result } = mountUseToggleGroup({}, model);

  result.contextValue.value.registerToggleItem("a");
  result.contextValue.value.registerToggleItem("b");

  expect(model.value).toBe("a");
  expect(result.contextValue.value.toggleValues).toEqual(["a", "b"]);
});

test("it should emit change and update:modelValue when selecting", () => {
  const { emit, model, result } = mountUseToggleGroup({}, ref("a"));

  result.contextValue.value.registerToggleItem("a");
  result.contextValue.value.registerToggleItem("b");
  result.contextValue.value.setSelected("b");

  expect(model.value).toBe("b");
  expect(emit).toHaveBeenCalledWith("change", "b");
  expect(emit).toHaveBeenCalledWith("update:modelValue", "b");
});

test("it should not select a disabled toggle", () => {
  const { emit, model, result } = mountUseToggleGroup({}, ref("a"));

  result.contextValue.value.registerToggleItem("a");
  result.contextValue.value.registerToggleItem("b", true);
  result.contextValue.value.setSelected("b");

  expect(model.value).toBe("a");
  expect(emit).not.toHaveBeenCalled();
});
