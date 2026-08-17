// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { h } from "vue";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

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

test("it should keep the input read-only by default", () => {
  const wrapper = mountDateField();

  expect((wrapper.find("input").element as HTMLInputElement).readOnly).toBe(
    true,
  );
});

test("it should unlock the input when editable is set", () => {
  const wrapper = mountDateField({
    props: { editable: true },
  });

  expect((wrapper.find("input").element as HTMLInputElement).readOnly).toBe(
    false,
  );
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

test("it should close the overlay after Apply when showFooter is set", async () => {
  const onApply = vi.fn();
  const onChange = vi.fn();
  const onClose = vi.fn();

  mountDateField({
    props: {
      onApply,
      onClose,
      onChange,
      showFooter: true,
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

  expect(onChange).not.toHaveBeenCalled();

  const apply = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "Apply",
  );

  apply?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onApply).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(
    Array.from(document.body.querySelectorAll("button")).some(
      (node) => node.textContent === "Apply",
    ),
  ).toBe(false);
});

test("it should close the overlay after Cancel without applying", async () => {
  const onChange = vi.fn();
  const onCancel = vi.fn();
  const onClose = vi.fn();

  mountDateField({
    props: {
      onClose,
      onChange,
      onCancel,
      showFooter: true,
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

test("it should fill the picker in a drawer overlay by default", async () => {
  mountDateField({
    props: {
      overlay: "drawer",
      defaultValue: new Date(2021, 4, 21),
      customProps: { drawer: { transition: "none" } },
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  const yearButton = document.body.querySelector('[aria-label="Select year"]');
  const picker = yearButton?.closest(".shadow-none");

  expect(picker).not.toBeNull();
  expect(picker?.className).toContain("w-full");
  expect(picker?.className).not.toContain("w-fit");
  expect(picker?.className).toContain("overflow-visible");
});

test("it should open a dialog when overlay is modal", async () => {
  mountDateField({
    props: {
      overlay: "modal",
      defaultValue: new Date(2021, 4, 21),
      customProps: { modal: { transition: "none" } },
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
});

test("it should show footer actions when overlay is modal", async () => {
  mountDateField({
    props: {
      overlay: "modal",
      defaultValue: new Date(2021, 4, 1),
      customProps: { modal: { transition: "none" } },
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  expect(
    Array.from(document.body.querySelectorAll("button")).some(
      (node) => node.textContent === "Apply",
    ),
  ).toBe(true);
  expect(
    Array.from(document.body.querySelectorAll("button")).some(
      (node) => node.textContent === "Cancel",
    ),
  ).toBe(true);
});

test("it should apply the value and close the modal overlay after Apply", async () => {
  const onChange = vi.fn();

  mountDateField({
    props: {
      onChange,
      overlay: "modal",
      defaultValue: new Date(2021, 4, 1),
      customProps: { modal: { transition: "none" } },
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

  const apply = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "Apply",
  );

  apply?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalled();
  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("it should close the modal overlay after Cancel without applying", async () => {
  const onChange = vi.fn();

  mountDateField({
    props: {
      onChange,
      overlay: "modal",
      defaultValue: new Date(2021, 4, 1),
      customProps: { modal: { transition: "none" } },
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

  const cancel = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "Cancel",
  );

  cancel?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).not.toHaveBeenCalled();
  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("it should close the modal overlay when clicking outside the picker", async () => {
  mountDateField({
    props: {
      overlay: "modal",
      defaultValue: new Date(2021, 4, 21),
      customProps: { modal: { transition: "none" } },
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();

  const wrapper = document.body.querySelector(
    '[data-modal-part="overlay"]',
  )?.nextElementSibling;

  expect(wrapper).not.toBeNull();

  wrapper?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("it should close the modal overlay from a custom footer apply", async () => {
  const onChange = vi.fn();

  mountDateField({
    props: {
      onChange,
      overlay: "modal",
      defaultValue: new Date(2021, 4, 1),
      customProps: { modal: { transition: "none" } },
    },
    slots: {
      footer: (props: { apply: () => void }) => {
        return h("button", { type: "button", onClick: props.apply }, "Save");
      },
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

  const save = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "Save",
  );

  save?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalled();
  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});
