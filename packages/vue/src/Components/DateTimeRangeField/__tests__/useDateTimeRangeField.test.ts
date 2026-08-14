// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import type { DateRangeValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import {
  useDateTimeRangeField,
  type DateTimeRangeFieldOwnProps,
} from "@/Components/DateTimeRangeField";

function mountUseDateTimeRangeField(
  props: Partial<DateTimeRangeFieldOwnProps> = {},
) {
  let result!: ReturnType<typeof useDateTimeRangeField>;

  const model = ref<null | undefined | DateRangeValue>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    props: {} as Record<string, never>,
    setup() {
      result = useDateTimeRangeField(props, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should start closed", () => {
  const { open } = mountUseDateTimeRangeField();

  expect(open.value).toBe(false);
});

test("it should expose null modelValue by default", () => {
  const { modelValue } = mountUseDateTimeRangeField();

  expect(modelValue.value).toBeNull();
});
