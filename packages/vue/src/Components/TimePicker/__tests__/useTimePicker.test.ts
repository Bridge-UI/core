// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import type { TimeValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import {
  useTimePicker,
  type TimePickerOwnProps,
} from "@/Components/TimePicker";

const libDefaults = {
  ampm: false,
  interval: 1,
  rounded: "md",
  color: "primary",
  showSeconds: false,
} as const satisfies Partial<TimePickerOwnProps>;

function mountUseTimePicker(props: Partial<TimePickerOwnProps> = {}) {
  let result!: ReturnType<typeof useTimePicker>;

  const model = ref<null | TimeValue>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useTimePicker(props, libDefaults, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default showFooter to false", () => {
  const { showFooter } = mountUseTimePicker();

  expect(showFooter.value).toBe(false);
});

test("it should keep horizontal padding on the panel content, not the root", () => {
  const { rootBind, contentBind } = mountUseTimePicker();

  expect(contentBind.value).toContain("px-2.5");
  expect(rootBind.value.class).not.toContain("px-2.5");
});

test("it should enable footer when showFooter is set", () => {
  const { showFooter } = mountUseTimePicker({ showFooter: true });

  expect(showFooter.value).toBe(true);
});
