// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import type { TimeValue } from "@bridge-ui/core";

// ** Local Imports
import { useTimeField, type TimeFieldOwnProps } from "@/Components/TimeField";

function mountUseTimeField(props: Partial<TimeFieldOwnProps> = {}) {
  let result!: ReturnType<typeof useTimeField>;

  const model = ref<null | TimeValue | undefined>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    props: {} as Record<string, never>,
    setup() {
      result = useTimeField(props, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should start closed", () => {
  const { open } = mountUseTimeField();

  expect(open.value).toBe(false);
});

test("it should expose null modelValue by default", () => {
  const { modelValue } = mountUseTimeField();

  expect(modelValue.value).toBeNull();
});
