// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import type { DatePickerModel } from "@bridge-ui/core";

// ** Local Imports
import { useDateField, type DateFieldOwnProps } from "@/Components/DateField";

function mountUseDateField(props: Partial<DateFieldOwnProps> = {}) {
  let result!: ReturnType<typeof useDateField>;

  const model = ref<null | undefined | DatePickerModel>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    props: {} as Record<string, never>,
    setup() {
      result = useDateField(props, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should start closed", () => {
  const { open } = mountUseDateField();

  expect(open.value).toBe(false);
});

test("it should default to single mode", () => {
  const { mode } = mountUseDateField();

  expect(mode.value).toBe("single");
});
