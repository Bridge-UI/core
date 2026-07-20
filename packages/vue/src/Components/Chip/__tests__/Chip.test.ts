// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Chip } from "@/Components/Chip";

afterEach(() => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  document.body.innerHTML = "";
});

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function mountChip(options: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(Chip, {
    attachTo: document.body,
    ...options,
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render the label", () => {
  mountChip({ props: { label: "Alpha" } });

  expect(document.body.textContent).toContain("Alpha");
});

test("it should apply size classes to the label", () => {
  mountChip({ props: { size: "xs", label: "Small" } });

  const label = document.body.querySelector(".truncate");

  expect(label?.textContent).toBe("Small");
  expect(label?.className).toContain("text-xs");
});

test("it should emit dismiss when dismissible clear is clicked", async () => {
  const wrapper = mountChip({
    props: { label: "Alpha", dismissible: true },
  });

  const clear = document.body.querySelector('[role="button"]');

  await clear?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  expect(wrapper.emitted("dismiss")).toHaveLength(1);
});

test("it should not render the dismiss control when dismissible is false", () => {
  mountChip({ props: { label: "Alpha" } });

  expect(document.body.querySelector('[role="button"]')).toBeNull();
});
