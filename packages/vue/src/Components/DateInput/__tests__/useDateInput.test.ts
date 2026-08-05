// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import type { DatePickerModel } from "@bridge-ui/core";

// ** Local Imports
import { useDateInput, type DateInputOwnProps } from "@/Components/DateInput";

function mountUseDateInput(props: Partial<DateInputOwnProps> = {}) {
  let result!: ReturnType<typeof useDateInput>;

  const model = ref<null | undefined | DatePickerModel>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    props: {} as Record<string, never>,
    setup() {
      result = useDateInput(props, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should start closed", () => {
  const { open } = mountUseDateInput();

  expect(open.value).toBe(false);
});

test("it should default to single mode", () => {
  const { mode } = mountUseDateInput();

  expect(mode.value).toBe("single");
});
