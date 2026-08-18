// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { ColorField } from "@/Components/ColorField";

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

function mountColorField(optionsArg: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(ColorField, {
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
  const wrapper = mountColorField();

  expect(wrapper.find("input").exists()).toBe(true);
});

test("it should render the palette end icon by default", () => {
  const wrapper = mountColorField();

  expect(wrapper.find("svg").exists()).toBe(true);
});

test("it should keep the input read-only by default", () => {
  const wrapper = mountColorField();

  expect((wrapper.find("input").element as HTMLInputElement).readOnly).toBe(
    true,
  );
});

test("it should unlock the input when editable is set", () => {
  const wrapper = mountColorField({
    props: { editable: true },
  });

  expect((wrapper.find("input").element as HTMLInputElement).readOnly).toBe(
    false,
  );
});

test("it should show the formatted value", () => {
  const wrapper = mountColorField({
    props: { defaultValue: "#ea1212" },
  });

  expect((wrapper.find("input").element as HTMLInputElement).value).toBe(
    "#ea1212",
  );
});

test("it should format rgba in the field", () => {
  const wrapper = mountColorField({
    props: { format: "rgba", defaultValue: "#ea1212" },
  });

  expect((wrapper.find("input").element as HTMLInputElement).value).toBe(
    "rgba(234, 18, 18, 1)",
  );
});

test("it should open the picker on focus", async () => {
  mountColorField({
    props: { defaultValue: "#ea1212" },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  expect(
    document.body.querySelector('[aria-label="Saturation and brightness"]'),
  ).not.toBeNull();
});

test("it should forward field rounded to picker internals", async () => {
  mountColorField({
    props: { rounded: "full", defaultValue: "#ea1212" },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  expect(
    document.body.querySelector('[aria-label="Saturation and brightness"]')
      ?.className,
  ).toContain("rounded-panel-full");
});

test("it should keep picker chrome inside an unstyled menu overlay", async () => {
  mountColorField({
    props: { rounded: "full", defaultValue: "#ea1212" },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  const menu = document.body.querySelector('[role="menu"]');

  expect(menu?.className).toContain("rounded-none");
  expect(menu?.className).toContain("bg-transparent");
  expect(menu?.firstElementChild?.className).toContain("bg-white");
  expect(menu?.firstElementChild?.className).toContain("rounded-panel-full");
});

test("it should emit change when a swatch is selected", async () => {
  const onChange = vi.fn();

  mountColorField({
    props: {
      onChange,
      swatches: ["#ea1212"],
      defaultValue: "#000000",
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  const swatch = document.body.querySelector('[aria-label="#ea1212"]');

  swatch?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalledWith("#ea1212");
});

test("it should keep the overlay open when a color is picked without footer", async () => {
  const onChange = vi.fn();
  const onClose = vi.fn();

  mountColorField({
    props: {
      onClose,
      onChange,
      swatches: ["#ea1212"],
      defaultValue: "#000000",
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  const swatch = document.body.querySelector('[aria-label="#ea1212"]');

  swatch?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalledWith("#ea1212");
  expect(onClose).not.toHaveBeenCalled();
  expect(
    document.body.querySelector('[aria-label="Saturation and brightness"]'),
  ).not.toBeNull();
});

test("it should emit change and clear when the clear control is clicked", async () => {
  const onChange = vi.fn();
  const onClear = vi.fn();

  mountColorField({
    props: {
      onClear,
      onChange,
      defaultValue: "#ea1212",
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

  mountColorField({
    props: {
      onApply,
      onClose,
      onChange,
      showFooter: true,
      swatches: ["#ea1212"],
      defaultValue: "#000000",
    },
  });

  const input = document.body.querySelector("input");

  input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  await flushPromises();

  const swatch = document.body.querySelector('[aria-label="#ea1212"]');

  swatch?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).not.toHaveBeenCalled();

  const apply = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "Apply",
  );

  apply?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onApply).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith("#ea1212");
  expect(onClose).toHaveBeenCalledTimes(1);
});
