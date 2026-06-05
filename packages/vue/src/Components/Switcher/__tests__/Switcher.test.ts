// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  Switcher,
  useSwitcher,
  type SwitcherOwnProps,
} from "@/Components/Switcher";

const libDefaults = {
  size: "md",
  error: false,
  withoutErrorMessage: false,
} satisfies Partial<SwitcherOwnProps>;

function mountSwitcher(
  props: Omit<SwitcherOwnProps, "field"> = {},
  attrs: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      inheritAttrs: false,
      setup() {
        const field = useSwitcher(() => ({ ...attrs, ...props }), libDefaults);

        return () =>
          h(Switcher, { field }, () =>
            h("input", {
              ...field.controlBind.value,
              type: "checkbox",
              "aria-label": "Control",
            }),
          );
      },
    }),
    { attrs },
  );
}

test("it should render the control element", () => {
  const wrapper = mountSwitcher();

  expect(wrapper.find("input").exists()).toBe(true);
  expect(wrapper.find(".group\\/switcher").exists()).toBe(true);
});

test("it should render main label when mainLabel prop is provided", () => {
  const wrapper = mountSwitcher({ mainLabel: "Email notifications" });

  expect(wrapper.text()).toContain("Email notifications");
});

test("it should link label to inherited input id when id is provided", () => {
  const wrapper = mountSwitcher(
    { mainLabel: "Email notifications" },
    { id: "switcher-id" },
  );

  const input = wrapper.find("input");
  const label = wrapper.find('label[for="switcher-id"]');

  expect(label.exists()).toBe(true);
  expect(input.attributes("id")).toBe("switcher-id");
});

test("it should render start and end labels when provided", () => {
  const wrapper = mountSwitcher({
    endLabel: "End",
    mainLabel: "Main",
    startLabel: "Start",
  });

  expect(wrapper.text()).toContain("End");
  expect(wrapper.text()).toContain("Main");
  expect(wrapper.text()).toContain("Start");
});

test("it should render description when description prop is provided", () => {
  const wrapper = mountSwitcher({ description: "Helper text" });

  expect(wrapper.text()).toContain("Helper text");
});

test("it should hide description when field is invalid", () => {
  const wrapper = mountSwitcher({
    error: true,
    description: "Helper text",
  });

  expect(wrapper.text()).not.toContain("Helper text");
});

test("it should render error message when errorMessage prop is provided", () => {
  const wrapper = mountSwitcher({
    error: true,
    errorMessage: "Required",
  });

  expect(wrapper.text()).toContain("Required");
});

test("it should hide error message content when only error is true", () => {
  const wrapper = mountSwitcher({ error: true });

  const errorRegion = wrapper.find('[id$="-error"]');

  expect(errorRegion.text()).toBe("");
  expect(errorRegion.exists()).toBe(true);
  expect(errorRegion.attributes("aria-hidden")).toBe("true");
});

test("it should apply disabled attribute on the control when disabled", () => {
  const wrapper = mountSwitcher({ disabled: true });

  expect(wrapper.find("input").attributes("disabled")).toBeDefined();
});

test("it should apply readonly attribute on the control when readonly", () => {
  const wrapper = mountSwitcher({ readonly: true });

  expect(wrapper.find("input").attributes("readonly")).toBeDefined();
});

test("it should set aria-invalid on the control when error is set", () => {
  const wrapper = mountSwitcher({ error: true });

  expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
});

test("it should set aria-describedby to description id when description is shown", () => {
  const wrapper = mountSwitcher(
    { description: "Helper" },
    { controlId: "field-id" },
  );

  const input = wrapper.find("input");

  expect(wrapper.find("#field-id-description").exists()).toBe(true);
  expect(input.attributes("aria-describedby")).toBe("field-id-description");
});

test("it should set aria-describedby to error id when error is shown", () => {
  const wrapper = mountSwitcher(
    { error: true, errorMessage: "Required" },
    { controlId: "field-id" },
  );

  const input = wrapper.find("input");

  expect(wrapper.find("#field-id-error").exists()).toBe(true);
  expect(input.attributes("aria-describedby")).toBe("field-id-error");
});

test("it should set data-invalid on the root when error is set", () => {
  const wrapper = mountSwitcher({ error: true });

  expect(wrapper.find(".group\\/switcher").attributes("data-invalid")).toBe(
    "true",
  );
});

test("it should apply error color on labels when error is set", () => {
  const wrapper = mountSwitcher({
    error: true,
    mainLabel: "Label",
  });

  expect(wrapper.find("label").classes()).toContain("text-error-600");
});

test("it should not render error region when withoutErrorMessage is true", () => {
  const wrapper = mountSwitcher({
    error: true,
    errorMessage: "Required",
    withoutErrorMessage: true,
  });

  expect(wrapper.find('[id$="-error"]').exists()).toBe(false);
});

test("it should render main label from slot", () => {
  const WithSlot = defineComponent({
    inheritAttrs: false,
    setup(_, { slots }) {
      const field = useSwitcher(() => ({}), libDefaults);

      return () =>
        h(
          Switcher,
          { field },
          {
            mainLabel: slots.mainLabel,
            default: () =>
              h("input", {
                ...field.controlBind.value,
                type: "checkbox",
                "aria-label": "Control",
              }),
          },
        );
    },
  });

  const slotWrapper = mount(WithSlot, {
    slots: {
      mainLabel: () => h("span", "Slot label"),
    },
  });

  expect(slotWrapper.text()).toContain("Slot label");
});
