// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useRadio, type RadioOwnProps } from "@/Components/Radio";

const libDefaults = {
  size: "md",
  rounded: "full",
  color: "primary",
} satisfies Partial<RadioOwnProps>;

function mountUseRadio(
  props: RadioOwnProps = {},
  modelValue: number | string | undefined = undefined,
) {
  let result!: ReturnType<typeof useRadio>;

  const modelRef = ref(modelValue);

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useRadio(() => props, libDefaults, modelRef);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { ...result, modelRef };
}

test("it should merge default size, rounded, and color", () => {
  const { merged } = mountUseRadio();

  expect(merged.value.size).toBe("md");
  expect(merged.value.rounded).toBe("full");
  expect(merged.value.color).toBe("primary");
});

test("it should be checked when model matches value", () => {
  const { isChecked } = mountUseRadio({ value: "a" }, "a");

  expect(isChecked.value).toBe(true);
});

test("it should not be checked when model differs from value", () => {
  const { isChecked } = mountUseRadio({ value: "a" }, "b");

  expect(isChecked.value).toBe(false);
});

test("it should set radio type on inputBind", () => {
  const { inputBind } = mountUseRadio({ value: "a" });

  expect(inputBind.value.type).toBe("radio");
});

test("it should forward value on inputBind", () => {
  const { inputBind } = mountUseRadio({ value: "plan-a" });

  expect(inputBind.value.value).toBe("plan-a");
});
