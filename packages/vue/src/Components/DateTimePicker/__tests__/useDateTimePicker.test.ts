// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useDateTimePicker,
  type DateTimePickerOwnProps,
} from "@/Components/DateTimePicker";

const libDefaults = {
  ampm: false,
  interval: 1,
  rounded: "md",
  startOfWeek: 0,
  color: "primary",
  showFooter: false,
  defaultView: "date",
} as const satisfies Partial<DateTimePickerOwnProps>;

function mountUseDateTimePicker(props: Partial<DateTimePickerOwnProps> = {}) {
  let result!: ReturnType<typeof useDateTimePicker>;

  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useDateTimePicker(props, libDefaults, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default showFooter to false", () => {
  const { showFooter } = mountUseDateTimePicker();

  expect(showFooter.value).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { showFooter } = mountUseDateTimePicker({ showFooter: true });

  expect(showFooter.value).toBe(true);
});
