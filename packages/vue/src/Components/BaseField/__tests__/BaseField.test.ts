// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  BaseField,
  useBaseField,
  type BaseFieldOwnProps,
} from "@/Components/BaseField";

const libDefaults = {
  size: "md",
  hideErrorMessage: false,
} satisfies Partial<BaseFieldOwnProps>;

function mountBaseField(
  props: Omit<BaseFieldOwnProps, "field"> = {},
  attrs: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) {
  return mount(
    defineComponent({
      inheritAttrs: false,
      setup(_, { slots: componentSlots }) {
        const field = useBaseField(() => ({ ...attrs, ...props }), libDefaults);

        return () =>
          h(
            BaseField,
            { field },
            {
              default: () =>
                h("input", {
                  type: "text",
                  "aria-label": "Control",
                }),
              ...componentSlots,
            },
          );
      },
    }),
    { attrs, slots },
  );
}

test("it should render the default slot control", () => {
  const wrapper = mountBaseField();

  expect(wrapper.find("input").exists()).toBe(true);
  expect(wrapper.find(".group").exists()).toBe(true);
});

test("it should render a label when label prop is provided", () => {
  const wrapper = mountBaseField({ label: "Email address" });

  expect(wrapper.text()).toContain("Email address");
});

test("it should render corner text when corner prop is provided", () => {
  const wrapper = mountBaseField({ corner: "Optional" });

  expect(wrapper.find("label").text()).toContain("Optional");
});

test("it should render description when description prop is provided", () => {
  const wrapper = mountBaseField({ description: "Helper text" });

  expect(wrapper.text()).toContain("Helper text");
});

test("it should keep description when error is true without errorMessage", () => {
  const wrapper = mountBaseField({
    error: true,
    description: "Helper text",
  });

  expect(wrapper.text()).toContain("Helper text");
});

test("it should hide description when errorMessage is shown", () => {
  const wrapper = mountBaseField({
    error: true,
    errorMessage: "Required",
    description: "Helper text",
  });

  expect(wrapper.text()).toContain("Required");
  expect(wrapper.text()).not.toContain("Helper text");
});

test("it should keep description on error when showDescriptionOnError is true", () => {
  const wrapper = mountBaseField({
    error: true,
    errorMessage: "Required",
    description: "Helper text",
    showDescriptionOnError: true,
  });

  expect(wrapper.text()).toContain("Required");
  expect(wrapper.text()).toContain("Helper text");
});

test("it should not reserve error space when description is present", () => {
  const wrapper = mountBaseField({ description: "Helper text" });

  expect(wrapper.find('[id$="-error"]').exists()).toBe(false);
});

test("it should render error message when errorMessage prop is provided", () => {
  const wrapper = mountBaseField({
    error: true,
    errorMessage: "Required",
  });

  expect(wrapper.text()).toContain("Required");
});

test("it should hide error message content when only error is true", () => {
  const wrapper = mountBaseField({ error: true });

  const errorRegion = wrapper.find('[id$="-error"]');

  expect(errorRegion.text()).toBe("");
  expect(errorRegion.exists()).toBe(true);
  expect(errorRegion.attributes("aria-hidden")).toBe("true");
});

test("it should render start slot content", () => {
  const wrapper = mountBaseField(
    {},
    {},
    {
      start: () => h("span", { "data-testid": "start-slot" }, "lock"),
    },
  );

  expect(wrapper.find('[data-testid="start-slot"]').exists()).toBe(true);
});

test("it should render end slot content", () => {
  const wrapper = mountBaseField(
    {},
    {},
    {
      end: () => h("span", { "data-testid": "end-slot" }, "Resend"),
    },
  );

  expect(wrapper.find('[data-testid="end-slot"]').exists()).toBe(true);
});

test("it should expose role group on the control group", () => {
  const wrapper = mountBaseField({}, { controlId: "field-id" });

  expect(wrapper.find('[role="group"]').attributes("id")).toBe("field-id");
});

test("it should set data-invalid on the root when error is set", () => {
  const wrapper = mountBaseField({ error: true });

  expect(wrapper.find(".group").attributes("data-invalid")).toBe("true");
});

test("it should not render error region when hideErrorMessage is true", () => {
  const wrapper = mountBaseField({
    error: true,
    hideErrorMessage: true,
    errorMessage: "Required",
  });

  expect(wrapper.find('[id$="-error"]').exists()).toBe(false);
});

test("it should render label from slot", () => {
  const wrapper = mountBaseField(
    {},
    {},
    {
      label: () => h("span", "Slot label"),
    },
  );

  expect(wrapper.text()).toContain("Slot label");
});
