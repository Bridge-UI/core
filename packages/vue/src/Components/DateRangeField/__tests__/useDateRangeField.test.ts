// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import type { DateRangeValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import {
  useDateRangeField,
  type DateRangeFieldOwnProps,
} from "@/Components/DateRangeField";

function mountUseDateRangeField(props: Partial<DateRangeFieldOwnProps> = {}) {
  let result!: ReturnType<typeof useDateRangeField>;

  const model = ref<null | undefined | DateRangeValue>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    props: {} as Record<string, never>,
    setup() {
      result = useDateRangeField(props, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should start closed", () => {
  const { open } = mountUseDateRangeField();

  expect(open.value).toBe(false);
});

test("it should expose null model when uncontrolled without default", () => {
  const { modelValue } = mountUseDateRangeField();

  expect(modelValue.value).toBeNull();
});
