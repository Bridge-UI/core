// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { TimeRangeField } from "@/Components/TimeRangeField";

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

function mountTimeRangeField(optionsArg: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(TimeRangeField, {
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
  const wrapper = mountTimeRangeField();

  expect(wrapper.find("input").exists()).toBe(true);
});

test("it should keep the input read-only by default", () => {
  const wrapper = mountTimeRangeField();

  expect((wrapper.find("input").element as HTMLInputElement).readOnly).toBe(
    true,
  );
});

test("it should unlock the input when editable is set", () => {
  const wrapper = mountTimeRangeField({
    props: { editable: true },
  });

  expect((wrapper.find("input").element as HTMLInputElement).readOnly).toBe(
    false,
  );
});

test("it should open the picker on focus", async () => {
  mountTimeRangeField({
    props: {
      defaultValue: [
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ],
    },
  });

  const input = document.body.querySelector("input");

  expect(input).not.toBeNull();

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  expect(document.body.querySelectorAll("button").length).toBeGreaterThan(48);
});

test("it should call change when a time is selected", async () => {
  const onChange = vi.fn();

  mountTimeRangeField({
    props: {
      onChange,
      defaultValue: [
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ],
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  const hour = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "10",
  );

  hour?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalled();
});

test("it should emit change and clear when the clear control is clicked", async () => {
  const onChange = vi.fn();
  const onClear = vi.fn();

  mountTimeRangeField({
    props: {
      onClear,
      onChange,
      defaultValue: [
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ],
    },
  });

  const clearControl = document.body.querySelector('[aria-label="Clear"]');

  clearControl?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalledWith(null);
  expect(onClear).toHaveBeenCalled();
});
