// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import type { TimeRangeValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import {
  useTimeRangeField,
  type TimeRangeFieldOwnProps,
} from "@/Components/TimeRangeField";

function mountUseTimeRangeField(props: Partial<TimeRangeFieldOwnProps> = {}) {
  let result!: ReturnType<typeof useTimeRangeField>;

  const model = ref<null | undefined | TimeRangeValue>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    props: {} as Record<string, never>,
    setup() {
      result = useTimeRangeField(props, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should start closed", () => {
  const { open } = mountUseTimeRangeField();

  expect(open.value).toBe(false);
});

test("it should expose null modelValue by default", () => {
  const { modelValue } = mountUseTimeRangeField();

  expect(modelValue.value).toBeNull();
});
