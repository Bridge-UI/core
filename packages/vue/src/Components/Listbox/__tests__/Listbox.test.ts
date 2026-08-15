// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { h } from "vue";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { Listbox } from "@/Components/Listbox";
import { ListItem } from "@/Components/ListItem";
import { ListSection } from "@/Components/ListSection";

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

test("it should show loading progress bar and text when loading", async () => {
  mountListbox({
    props: {
      options: [],
      loading: true,
      modelValue: true,
    },
  });

  await flushPromises();

  expect(document.body.textContent).toContain("Loading...");
  expect(document.body.querySelector('[role="progressbar"]')).not.toBeNull();
});

test("it should use loadingMessage when provided", async () => {
  mountListbox({
    props: {
      options: [],
      loading: true,
      modelValue: true,
      loadingMessage: "Fetching...",
    },
  });

  await flushPromises();

  expect(document.body.textContent).toContain("Fetching...");
});

test("it should mark selected options with aria-selected on the option", async () => {
  mountListbox({
    props: {
      modelValue: true,
      isSelected: (value: string) => value === "active",
    },
  });

  await flushPromises();

  const apple = document.body.querySelector('[role="option"]');

  expect(apple?.getAttribute("aria-selected")).toBe("true");
});

test("it should render a scroll container with default max height", async () => {
  mountListbox({ props: { modelValue: true } });

  await flushPromises();

  const scrollContainer = document.body.querySelector(".overflow-y-auto");

  expect(scrollContainer).not.toBeNull();
  expect(scrollContainer?.classList.contains("max-h-60")).toBe(true);
});

test("it should apply size classes to empty message", async () => {
  mountListbox({
    props: {
      size: "xs",
      options: [],
      modelValue: true,
    },
  });

  await flushPromises();

  const empty = document.body.querySelector(".text-dark-500");

  expect(empty?.className).toContain("text-xs");
  expect(empty?.textContent).toContain("No options");
});

test("it should apply size classes to option rows", async () => {
  mountListbox({
    props: {
      size: "xs",
      modelValue: true,
    },
  });

  await flushPromises();

  const option = document.body.querySelector('[role="option"]');
  const primary = Array.from(document.body.querySelectorAll("span")).find(
    (el) => el.textContent === "Active",
  );

  expect(option?.className).toContain("px-3");
  expect(primary?.className).toContain("text-xs");
});

test("it should render section headers from entries", async () => {
  mountListbox({
    props: {
      options: [],
      modelValue: true,
      entries: [
        {
          sticky: true,
          type: "section",
          title: "Status",
          options: [{ label: "Active", value: "active" }],
        },
        {
          type: "option",
          option: { label: "Other", value: "other" },
        },
      ],
    },
  });

  await flushPromises();

  expect(document.body.textContent).toContain("Other");
  expect(document.body.textContent).toContain("Status");
  expect(document.body.textContent).toContain("Active");

  const section = Array.from(document.body.querySelectorAll("li")).find((el) =>
    el.classList.contains("sticky"),
  );

  expect(section).toBeTruthy();
});

test("it should render composed ListSection and ListItem children", async () => {
  const onSelect = vi.fn();

  mountListbox({
    props: {
      onSelect,
      options: [],
      modelValue: true,
      isSelected: (value: string) => value === "pending",
    },
    slots: {
      default: () => [
        h(ListSection, { sticky: true, title: "Status" }),
        h(ListItem, { value: "active", primary: "Active" }),
        h(ListItem, { value: "pending", primary: "Pending" }),
      ],
    },
  });

  await flushPromises();

  expect(document.body.textContent).toContain("Status");

  const pending = Array.from(
    document.body.querySelectorAll('[role="option"]'),
  ).find((el) => el.textContent?.includes("Pending"));

  expect(pending?.getAttribute("aria-selected")).toBe("true");

  const active = Array.from(
    document.body.querySelectorAll('[role="option"]'),
  ).find((el) => el.textContent?.includes("Active"));

  await active?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onSelect).toHaveBeenCalled();
});

test("it should show footer actions when showFooter is set", async () => {
  mountListbox({
    props: {
      modelValue: true,
      showFooter: true,
    },
  });

  await flushPromises();

  expect(document.body.textContent).toContain("Cancel");
  expect(document.body.textContent).toContain("Apply");
});
