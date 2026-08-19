// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref, type Ref } from "vue";

// ** Local Imports
import { useStepper } from "@/Components/Stepper/composables/useStepper";
import type { StepperOwnProps } from "@/Components/Stepper/stepper.types";

const libDefaults = {
  size: "md",
  linear: true,
  color: "primary",
  orientation: "horizontal",
} as const;

function mountUseStepper(
  props: Partial<StepperOwnProps> = {},
  model: Ref<number | undefined> = ref(0),
) {
  let result!: ReturnType<typeof useStepper>;
  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useStepper(
        props,
        libDefaults as Parameters<typeof useStepper>[1],
        model,
        emit as Parameters<typeof useStepper>[3],
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { emit, model, result };
}

test("it should expose context defaults from useStepper", () => {
  const { result } = mountUseStepper({}, ref(0));

  expect(result.contextValue.value.linear).toBe(true);
  expect(result.contextValue.value.activeStep).toBe(0);
  expect(result.contextValue.value.orientation).toBe("horizontal");
});

test("it should emit change and update:modelValue when selecting a step", () => {
  const { emit, model, result } = mountUseStepper({}, ref(0));

  result.contextValue.value.registerStep("a");
  result.contextValue.value.registerStepMeta(0, {
    clickable: true,
    disabled: false,
  });
  result.contextValue.value.selectStep(0);

  expect(model.value).toBe(0);
  expect(emit).toHaveBeenCalledWith("change", 0);
  expect(emit).toHaveBeenCalledWith("update:modelValue", 0);
});

test("it should not select a disabled step", () => {
  const { emit, model, result } = mountUseStepper({}, ref(0));

  result.contextValue.value.registerStepMeta(1, {
    disabled: true,
    clickable: false,
  });
  result.contextValue.value.selectStep(1);

  expect(model.value).toBe(0);
  expect(emit).not.toHaveBeenCalled();
});
