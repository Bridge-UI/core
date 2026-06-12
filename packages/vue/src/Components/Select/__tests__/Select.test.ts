// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { Select as SelectField, SelectOption } from "@/Components/Select";
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
  { label: "Done", value: "done" },
];

function mountSelect(optionsArg: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(SelectField, {
    attachTo: document.body,
    ...optionsArg,
    props: {
      options,
      ...(optionsArg.props ?? {}),
      "onUpdate:modelValue": (value: unknown) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render a combobox trigger with FormField chrome", () => {
  const wrapper = mountSelect({
    props: {
      label: "Status",
      modelValue: undefined,
      placeholder: "Select one",
    },
  });

  expect(wrapper.text()).toContain("Status");
  expect(wrapper.find('[role="combobox"]').exists()).toBe(true);
  expect(wrapper.find('[role="combobox"]').attributes("placeholder")).toBe(
    "Select one",
  );
});

test("it should open the menu when the combobox is clicked", async () => {
  mountSelect({
    props: {
      modelValue: undefined,
      placeholder: "Select one",
    },
  });

  const combobox = document.body.querySelector('[role="combobox"]');

  expect(combobox).not.toBeNull();
  expect(combobox?.className).toContain("cursor-pointer");

  await combobox?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(document.body.querySelector('[role="listbox"]')).not.toBeNull();
});

test("it should open the menu and select an option", async () => {
  const wrapper = mountSelect({
    props: { modelValue: undefined },
  });

  await wrapper.find('[role="combobox"]').trigger("click");
  await flushPromises();

  const option = document.body.querySelector('[role="option"]');

  expect(option).not.toBeNull();
  expect(document.body.textContent).toContain("Active");

  await option?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["active"]);
  expect(wrapper.emitted("select")?.[0]?.[0]).toMatchObject({
    label: "Active",
    value: "active",
  });
});

test("it should clear the selected value", async () => {
  const wrapper = mountSelect({
    props: { clearable: true, modelValue: "active" },
  });

  const clearButton = wrapper.find('[aria-label="Clear selection"]');

  expect(clearButton.exists()).toBe(true);

  await clearButton.trigger("click");

  expect(wrapper.emitted("clear")).toHaveLength(1);
  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
});

test("it should collect declarative SelectOption children", async () => {
  const value = ref("pending");

  const Host = defineComponent({
    components: { SelectField, SelectOption },
    setup() {
      return () =>
        h(
          SelectField,
          {
            modelValue: value.value,
            "onUpdate:modelValue": (next: string) => {
              value.value = next;
            },
          },
          () => [
            h(SelectOption, { label: "Pending", value: "pending" }),
            h(SelectOption, { label: "Done", value: "done" }),
          ],
        );
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });
  mountedWrappers.push(wrapper);

  await wrapper.find('[role="combobox"]').trigger("click");
  await flushPromises();

  expect(document.body.textContent).toContain("Pending");
  expect(document.body.textContent).toContain("Done");
});

test("it should not block pointer events on the field shell when closed", () => {
  mountSelect({
    props: {
      searchable: false,
      modelValue: undefined,
    },
  });

  const root = document.body.querySelector(".group.w-full");

  expect(root?.getAttribute("aria-readonly")).not.toBe("true");
});

test("it should expose combobox aria attributes when open", async () => {
  mountSelect({ props: { modelValue: undefined } });

  const combobox = document.body.querySelector('[role="combobox"]');

  expect(combobox?.getAttribute("aria-expanded")).toBe("false");

  await combobox?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(combobox?.getAttribute("aria-expanded")).toBe("true");
  expect(combobox?.getAttribute("aria-controls")).toBeTruthy();
});

test("it should filter options when searchable", async () => {
  mountSelect({
    props: {
      searchable: true,
      modelValue: undefined,
    },
  });

  const combobox = document.body.querySelector(
    '[role="combobox"]',
  ) as HTMLInputElement;

  await combobox?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  combobox.value = "pend";
  await combobox.dispatchEvent(new Event("input", { bubbles: true }));
  await flushPromises();

  expect(document.body.textContent).toContain("Pending");
  expect(document.body.textContent).not.toContain("Active");
});
