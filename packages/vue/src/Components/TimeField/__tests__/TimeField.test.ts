// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

// ** Local Imports
import { TimeField } from "@/Components/TimeField";

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

function mountTimeField(optionsArg: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(TimeField, {
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
  const wrapper = mountTimeField();

  expect(wrapper.find("input").exists()).toBe(true);
});

test("it should open the picker on focus", async () => {
  mountTimeField({
    props: { defaultValue: new Date(2021, 4, 21, 14, 30) },
  });

  const input = document.body.querySelector("input");

  expect(input).not.toBeNull();

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  expect(document.body.querySelectorAll("button").length).toBeGreaterThan(24);
});

test("it should call change when a time is selected", async () => {
  const onChange = vi.fn();

  mountTimeField({
    props: {
      onChange,
      defaultValue: new Date(2021, 4, 21, 14, 30),
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  const hour = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "15",
  );

  hour?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalled();
});

test("it should pass color to the nested TimePicker", async () => {
  mountTimeField({
    props: {
      color: "secondary",
      defaultValue: new Date(2021, 4, 21, 14, 30),
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  const hour = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "15",
  );

  expect(hour).toBeTruthy();
  expect(String(hour?.className)).toMatch(/secondary/);
});
