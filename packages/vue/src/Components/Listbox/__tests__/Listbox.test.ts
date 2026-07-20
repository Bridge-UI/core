// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Listbox } from "@/Components/Listbox";
import { resetLayerStackForTests } from "@bridge-ui/core";

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

const options = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
];

function mountListbox(optionsArg: Parameters<typeof mount>[1] = {}) {
  const anchor = document.createElement("div");
  document.body.appendChild(anchor);

  const wrapper = mount(Listbox, {
    attachTo: document.body,
    ...optionsArg,
    props: {
      options,
      anchorEl: anchor,
      listboxId: "test-listbox",
      ...(optionsArg.props ?? {}),
      "onUpdate:modelValue": (value: boolean) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render options inside a listbox when open", async () => {
  mountListbox({ props: { modelValue: true } });

  await flushPromises();

  const listbox = document.body.querySelector('[role="listbox"]');

  expect(listbox).not.toBeNull();
  expect(listbox?.id).toBe("test-listbox");
  expect(document.body.textContent).toContain("Active");
  expect(document.body.textContent).toContain("Pending");
});

test("it should emit select when an option is clicked", async () => {
  const wrapper = mountListbox({ props: { modelValue: true } });

  await flushPromises();

  const option = document.body.querySelector('[role="option"]');

  await option?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(wrapper.emitted("select")?.[0]?.[0]).toMatchObject({
    label: "Active",
    value: "active",
  });
});

test("it should render the empty message when there are no options", async () => {
  mountListbox({
    props: {
      options: [],
      modelValue: true,
      emptyMessage: "Nothing here",
    },
  });

  await flushPromises();

  expect(document.body.textContent).toContain("Nothing here");
});

test("it should show loading progress bar when loading", async () => {
  mountListbox({
    props: {
      options: [],
      loading: true,
      modelValue: true,
    },
  });

  await flushPromises();

  expect(document.body.querySelector('[role="progressbar"]')).not.toBeNull();
});

test("it should keep options visible while loading", async () => {
  mountListbox({
    props: {
      loading: true,
      modelValue: true,
    },
  });

  await flushPromises();

  expect(document.body.querySelector('[role="progressbar"]')).not.toBeNull();
  expect(document.body.textContent).toContain("Active");
});

test("it should mark selected options with aria-selected on the list item", async () => {
  mountListbox({
    props: {
      modelValue: true,
      isSelected: (value: string) => value === "active",
    },
  });

  await flushPromises();

  const apple = document.body.querySelector("li");

  expect(apple?.getAttribute("aria-selected")).toBe("true");
});

test("it should render a scroll container with default max height", async () => {
  mountListbox({ props: { modelValue: true } });

  await flushPromises();

  const scrollContainer = document.body.querySelector(".overflow-y-auto");

  expect(scrollContainer).not.toBeNull();
  expect(scrollContainer?.classList.contains("max-h-60")).toBe(true);
});
