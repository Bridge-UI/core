// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

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

test("it should keep the input read-only by default", () => {
  const wrapper = mountTimeField();

  expect((wrapper.find("input").element as HTMLInputElement).readOnly).toBe(
    true,
  );
});

test("it should allow typing when editable is set", () => {
  const wrapper = mountTimeField({
    props: { editable: true },
  });

  expect((wrapper.find("input").element as HTMLInputElement).readOnly).toBe(
    false,
  );
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

test("it should emit change and clear when the clear control is clicked", async () => {
  const onChange = vi.fn();
  const onClear = vi.fn();

  mountTimeField({
    props: {
      onClear,
      onChange,
      defaultValue: new Date(2021, 4, 21, 14, 30),
    },
  });

  const clearControl = document.body.querySelector('[aria-label="Clear"]');

  clearControl?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalledWith(null);
  expect(onClear).toHaveBeenCalled();
});

test("it should close the overlay after Apply when showFooter is set", async () => {
  const onApply = vi.fn();
  const onChange = vi.fn();
  const onClose = vi.fn();

  mountTimeField({
    props: {
      onApply,
      onClose,
      onChange,
      showFooter: true,
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

  expect(onChange).not.toHaveBeenCalled();

  const apply = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "Apply",
  );

  apply?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onApply).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalled();
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(
    Array.from(document.body.querySelectorAll("button")).some(
      (node) => node.textContent === "Apply",
    ),
  ).toBe(false);
});

test("it should close the overlay after Cancel when showFooter is set", async () => {
  const onChange = vi.fn();
  const onCancel = vi.fn();
  const onClose = vi.fn();

  mountTimeField({
    props: {
      onClose,
      onChange,
      onCancel,
      showFooter: true,
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

  const cancel = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "Cancel",
  );

  cancel?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onChange).not.toHaveBeenCalled();
  expect(
    Array.from(document.body.querySelectorAll("button")).some(
      (node) => node.textContent === "Cancel",
    ),
  ).toBe(false);
});
