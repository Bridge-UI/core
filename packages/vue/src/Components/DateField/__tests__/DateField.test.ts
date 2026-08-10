// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

// ** Local Imports
import { DateField } from "@/Components/DateField";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function mountDateField(optionsArg: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(DateField, {
    attachTo: document.body,
    ...optionsArg,
    props: {
      ...(optionsArg.props ?? {}),
      "onUpdate:modelValue": (value: unknown) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render a text input", () => {
  const wrapper = mountDateField();

  expect(wrapper.find("input").exists()).toBe(true);
});

test("it should open the picker on focus", async () => {
  mountDateField({
    props: { defaultValue: new Date(2021, 4, 21) },
  });

  const input = document.body.querySelector("input");

  expect(input).not.toBeNull();

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  expect(
    document.body.querySelector('[aria-label="Select year"]'),
  ).not.toBeNull();
});

test("it should call change when a day is selected", async () => {
  const onChange = vi.fn();

  mountDateField({
    props: {
      onChange,
      defaultValue: new Date(2021, 4, 1),
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  const day = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "21",
  );

  day?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalled();
});

test("it should pass color to the nested DatePicker", async () => {
  mountDateField({
    props: {
      color: "secondary",
      defaultValue: new Date(2021, 4, 21),
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  const day = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "15",
  );

  expect(day).toBeTruthy();
  expect(String(day?.className)).toMatch(/secondary/);
});

test("it should show the clear control when a value is present", () => {
  mountDateField({
    props: { defaultValue: new Date(2021, 4, 21) },
  });

  expect(document.body.querySelector('[aria-label="Clear"]')).not.toBeNull();
});

test("it should not show the clear control when there is no value", () => {
  mountDateField();

  expect(document.body.querySelector('[aria-label="Clear"]')).toBeNull();
});

test("it should emit change and clear when the clear control is clicked", async () => {
  const onChange = vi.fn();
  const onClear = vi.fn();

  mountDateField({
    props: {
      onClear,
      onChange,
      defaultValue: new Date(2021, 4, 21),
    },
  });

  const clearControl = document.body.querySelector('[aria-label="Clear"]');

  clearControl?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalledWith(null);
  expect(onClear).toHaveBeenCalled();
});

test("it should not show the clear control when clearable is false", () => {
  mountDateField({
    props: { clearable: false, defaultValue: new Date(2021, 4, 21) },
  });

  expect(document.body.querySelector('[aria-label="Clear"]')).toBeNull();
});
