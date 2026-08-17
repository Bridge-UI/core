// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useStep } from "@/Components/Step/composables/useStep";
import { Stepper } from "@/Components/Stepper";

function mountUseStep(props: { error?: boolean; label: string }) {
  let result!: ReturnType<typeof useStep>;

  const ItemHost = defineComponent({
    setup() {
      result = useStep(props);

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      return () =>
        h(Stepper, { modelValue: 1 }, { default: () => h(ItemHost) });
    },
  });

  mount(Wrapper);

  return { result };
}

test("it should mark the first step as completed", () => {
  const { result } = mountUseStep({ label: "Account" });

  expect(result.index.value).toBe(0);
  expect(result.status.value).toBe("completed");
  expect(result.clickable.value).toBe(true);
});

test("it should mark an error step", () => {
  const { result } = mountUseStep({ error: true, label: "Account" });

  expect(result.status.value).toBe("error");
});
