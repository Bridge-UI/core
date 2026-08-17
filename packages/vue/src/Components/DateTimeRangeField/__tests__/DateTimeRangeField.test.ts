// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { DateTimeRangeField } from "@/Components/DateTimeRangeField";

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

function mountDateTimeRangeField(optionsArg: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(DateTimeRangeField, {
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
  const wrapper = mountDateTimeRangeField();

  expect(wrapper.find("input").exists()).toBe(true);
});

test("it should keep the input read-only by default", () => {
  const wrapper = mountDateTimeRangeField();

  expect((wrapper.find("input").element as HTMLInputElement).readOnly).toBe(
    true,
  );
});

test("it should unlock the input when editable is set", () => {
  const wrapper = mountDateTimeRangeField({
    props: { editable: true },
  });

  expect((wrapper.find("input").element as HTMLInputElement).readOnly).toBe(
    false,
  );
});

test("it should open the picker on focus", async () => {
  mountDateTimeRangeField({
    props: {
      defaultValue: [
        new Date(2021, 4, 21, 14, 30),
        new Date(2021, 4, 25, 17, 0),
      ],
    },
  });

  const input = document.body.querySelector("input");

  expect(input).not.toBeNull();

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  expect(
    document.body.querySelector('[aria-label="Select year"]'),
  ).not.toBeNull();
  expect(document.body.querySelectorAll("button").length).toBeGreaterThan(48);
});

test("it should call change when a day is selected", async () => {
  const onChange = vi.fn();

  mountDateTimeRangeField({
    props: {
      onChange,
      defaultValue: [
        new Date(2021, 4, 1, 14, 30),
        new Date(2021, 4, 10, 17, 0),
      ],
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

test("it should pass color to the nested DateTimeRangePicker", async () => {
  mountDateTimeRangeField({
    props: {
      color: "secondary",
      defaultValue: [
        new Date(2021, 4, 21, 14, 30),
        new Date(2021, 4, 25, 17, 0),
      ],
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

test("it should emit change and clear when the clear control is clicked", async () => {
  const onChange = vi.fn();
  const onClear = vi.fn();

  mountDateTimeRangeField({
    props: {
      onClear,
      onChange,
      defaultValue: [
        new Date(2021, 4, 21, 14, 30),
        new Date(2021, 4, 25, 17, 0),
      ],
    },
  });

  const clearControl = document.body.querySelector('[aria-label="Clear"]');

  clearControl?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalledWith(null);
  expect(onClear).toHaveBeenCalled();
});
