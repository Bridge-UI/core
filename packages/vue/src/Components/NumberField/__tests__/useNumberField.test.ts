// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useNumberField } from "@/Components/NumberField";

function mountUseNumberField(
  model: ReturnType<typeof ref<number | null | undefined>>,
  options: Parameters<typeof useNumberField>[1] = {},
) {
  let result!: ReturnType<typeof useNumberField>;

  const Wrapper = defineComponent({
    setup() {
      result = useNumberField(model, options);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should return undefined inputValue when no value is set", () => {
  const model = ref<number | null | undefined>(undefined);
  const { inputValue, currentValue } = mountUseNumberField(model);

  expect(inputValue.value).toBeUndefined();
  expect(currentValue.value).toBeUndefined();
});

test("it should reflect model value", () => {
  const model = ref(5);
  const { inputValue, currentValue } = mountUseNumberField(model);

  expect(inputValue.value).toBe("5");
  expect(currentValue.value).toBe(5);
});

test("it should increment by step", () => {
  const model = ref(2);
  const { increment } = mountUseNumberField(model, { step: 2 });

  increment();

  expect(model.value).toBe(4);
});

test("it should decrement by step", () => {
  const model = ref(4);
  const { decrement } = mountUseNumberField(model, { step: 2 });

  decrement();

  expect(model.value).toBe(2);
});

test("it should not increment above max", () => {
  const model = ref(10);
  const { increment } = mountUseNumberField(model, { max: 10 });

  increment();

  expect(model.value).toBe(10);
});

test("it should not decrement below min", () => {
  const model = ref(0);
  const { decrement } = mountUseNumberField(model, { min: 0 });

  decrement();

  expect(model.value).toBe(0);
});

test("it should use min as base when value is undefined", () => {
  const model = ref<number | undefined>(undefined);
  const { increment } = mountUseNumberField(model, { min: 5 });

  increment();

  expect(model.value).toBe(6);
});
