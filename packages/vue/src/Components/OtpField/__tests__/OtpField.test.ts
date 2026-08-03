// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";

// ** Local Imports
import { OtpField } from "@/Components/OtpField";

test("it should render the default number of pin inputs", () => {
  const wrapper = mount(OtpField);

  expect(wrapper.findAll('input[aria-label^="Digit"]')).toHaveLength(6);
});

test("it should render a custom length", () => {
  const wrapper = mount(OtpField, { props: { length: 4 } });

  expect(wrapper.findAll('input[aria-label^="Digit"]')).toHaveLength(4);
});

test("it should render a label when label prop is provided", () => {
  const wrapper = mount(OtpField, {
    props: { label: "Verification code" },
  });

  expect(wrapper.text()).toContain("Verification code");
});

test("it should emit change when typing a digit", async () => {
  const onChange = vi.fn();
  const wrapper = mount(OtpField, {
    props: {
      onChange,
      length: 4,
    },
  });

  const input = wrapper.findAll("input")[0]!;
  await input.setValue("1");

  expect(wrapper.emitted("change")?.[0]).toEqual(["1"]);
});

test("it should emit complete when all pins are filled", async () => {
  const wrapper = mount(OtpField, {
    props: {
      length: 4,
      modelValue: "123",
      "onUpdate:modelValue": (value: null | string | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.findAll("input")[3]!.setValue("4");

  expect(wrapper.emitted("complete")?.[0]).toEqual(["1234"]);
});

test("it should disable all pins when disabled", () => {
  const wrapper = mount(OtpField, { props: { disabled: true } });

  for (const input of wrapper.findAll("input")) {
    expect(input.attributes("disabled")).toBeDefined();
  }
});

test("it should show an error message when invalid", () => {
  const wrapper = mount(OtpField, {
    props: {
      error: true,
      label: "Code",
      errorMessage: "Invalid code",
    },
  });

  expect(wrapper.text()).toContain("Invalid code");
});
