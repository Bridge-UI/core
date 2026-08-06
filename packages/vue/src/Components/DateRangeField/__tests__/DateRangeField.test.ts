// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

// ** Local Imports
import { DateRangeField } from "@/Components/DateRangeField";

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

function mountDateRangeField(optionsArg: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(DateRangeField, {
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
  const wrapper = mountDateRangeField();

  expect(wrapper.find("input").exists()).toBe(true);
});

test("it should open the picker on focus", async () => {
  mountDateRangeField({
    props: {
      defaultValue: [new Date(2021, 4, 1), new Date(2021, 4, 10)],
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  expect(
    document.body.querySelectorAll('[aria-label="Select year"]'),
  ).toHaveLength(1);
});

test("it should emit change when a day is selected", async () => {
  const onChange = vi.fn();

  mountDateRangeField({
    props: { onChange },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  const day = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "15",
  );

  day?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalled();
});

test("it should pass color to the nested DateRangePicker", async () => {
  mountDateRangeField({
    props: {
      color: "secondary",
      defaultValue: [new Date(2021, 4, 1), new Date(2021, 4, 10)],
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  const day = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "15",
  );

  expect(String(day?.className)).toMatch(/secondary/);
});
