// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, ref, useModel } from "vue";

// ** Local Imports
import { useOptionalModel } from "@/Utils/useOptionalModel";

const OptionalModelHost = defineComponent({
  emits: ["update:modelValue"],
  template: `<input :value="value ?? ''" />`,
  props: {
    modelValue: { type: String, default: undefined },
  },
  setup(props) {
    const model = useModel(props, "modelValue");
    const uncontrolled = ref<string | undefined>(undefined);
    const value = useOptionalModel(model, uncontrolled);

    return { value };
  },
});

test("it should keep an initial value when v-model is not bound", () => {
  const UnboundHost = defineComponent({
    template: `<input :value="value ?? ''" />`,
    setup() {
      const model = ref<string | undefined>(undefined);
      const uncontrolled = ref<string | undefined>("fallback");
      const value = useOptionalModel(model, uncontrolled);

      return { value };
    },
  });

  const wrapper = mount(UnboundHost);

  expect(wrapper.find("input").element.value).toBe("fallback");
});

test("it should use v-model when it is bound", () => {
  const wrapper = mount(OptionalModelHost, {
    props: { modelValue: "hello" },
  });

  expect(wrapper.find("input").element.value).toBe("hello");
});

test("it should clear when v-model is set to undefined", async () => {
  const Host = defineComponent({
    components: { OptionalModelHost },
    setup() {
      const boundValue = ref<string | undefined>("hello");

      return { boundValue };
    },
    template: `
      <OptionalModelHost v-model="boundValue" />
      <button type="button" v-on:click="boundValue = undefined">Clear</button>
    `,
  });

  const wrapper = mount(Host);

  expect(wrapper.find("input").element.value).toBe("hello");

  await wrapper.find("button").trigger("click");

  expect(wrapper.find("input").element.value).toBe("");
});
