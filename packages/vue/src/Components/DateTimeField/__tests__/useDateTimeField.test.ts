// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import {
  useDateTimeField,
  type DateTimeFieldOwnProps,
} from "@/Components/DateTimeField";

function mountUseDateTimeField(props: Partial<DateTimeFieldOwnProps> = {}) {
  let result!: ReturnType<typeof useDateTimeField>;

  const model = ref<Date | null | undefined>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    props: {} as Record<string, never>,
    setup() {
      result = useDateTimeField(props, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should start closed", () => {
  const { open } = mountUseDateTimeField();

  expect(open.value).toBe(false);
});

test("it should expose null modelValue by default", () => {
  const { modelValue } = mountUseDateTimeField();

  expect(modelValue.value).toBeNull();
});
