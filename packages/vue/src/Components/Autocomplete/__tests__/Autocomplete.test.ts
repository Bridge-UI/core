// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

// ** Local Imports
import { Autocomplete, AutocompleteOption } from "@/Components/Autocomplete";
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
  { label: "Done", value: "done" },
];

function mountAutocomplete(optionsArg: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(Autocomplete, {
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
  const wrapper = mountAutocomplete({
    props: {
      label: "Status",
      modelValue: undefined,
      placeholder: "Choose one",
    },
  });

  expect(wrapper.text()).toContain("Status");
  expect(wrapper.find('[role="combobox"]').exists()).toBe(true);
  expect(wrapper.find('[role="combobox"]').attributes("placeholder")).toBe(
    "Choose one",
  );
});

test("it should open the menu when the combobox is clicked", async () => {
  mountAutocomplete({
    props: {
      modelValue: undefined,
      placeholder: "Choose one",
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
  const wrapper = mountAutocomplete({
    props: { modelValue: undefined },
  });

  await wrapper.find('[role="combobox"]').trigger("click");
  await flushPromises();

  const option = document.body.querySelector('[role="option"]');

  expect(option).not.toBeNull();
  expect(document.body.textContent).toContain("Active");

  await option?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(wrapper.emitted("select")?.[0]?.[0]).toMatchObject({
    label: "Active",
    value: "active",
  });
  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["active"]);
});

test("it should clear the selected value", async () => {
  const wrapper = mountAutocomplete({
    props: { clearable: true, modelValue: "active" },
  });

  const clearButton = wrapper.find('[aria-label="Clear selection"]');

  expect(clearButton.exists()).toBe(true);

  await clearButton.trigger("click");

  expect(wrapper.emitted("clear")).toHaveLength(1);
  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
});

test("it should not show the clear control when readonly", () => {
  const wrapper = mountAutocomplete({
    props: { readonly: true, clearable: true, modelValue: "active" },
  });

  expect(wrapper.find('[aria-label="Clear selection"]').exists()).toBe(false);
});

test("it should open a dialog when overlay is modal", async () => {
  mountAutocomplete({
    props: {
      overlay: "modal",
      modelValue: undefined,
      customProps: {
        listbox: {
          customProps: { modal: { transition: "none" } },
        },
      },
    },
  });

  const combobox = document.body.querySelector('[role="combobox"]');

  await combobox?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
});

test("it should collect declarative AutocompleteOption children", async () => {
  const value = ref("pending");

  const Host = defineComponent({
    components: { Autocomplete, AutocompleteOption },
    setup() {
      return () =>
        h(
          Autocomplete,
          {
            modelValue: value.value,
            "onUpdate:modelValue": (next: string) => {
              value.value = next;
            },
          },
          () => [
            h(AutocompleteOption, { label: "Pending", value: "pending" }),
            h(AutocompleteOption, { label: "Done", value: "done" }),
          ],
        );
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });
  mountedWrappers.push(wrapper);

  await wrapper.find('[role="combobox"]').trigger("click");
  await flushPromises();

  expect(document.body.textContent).toContain("Done");
  expect(document.body.textContent).toContain("Pending");
});

test("it should not block pointer events on the field shell when closed", () => {
  mountAutocomplete({
    props: {
      searchable: false,
      modelValue: undefined,
    },
  });

  const root = document.body.querySelector(".group.w-full");

  expect(root?.getAttribute("aria-readonly")).not.toBe("true");
});

test("it should expose combobox aria attributes when open", async () => {
  mountAutocomplete({ props: { modelValue: undefined } });

  const combobox = document.body.querySelector('[role="combobox"]');

  expect(combobox?.getAttribute("aria-expanded")).toBe("false");

  await combobox?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(combobox?.getAttribute("aria-expanded")).toBe("true");
  expect(combobox?.getAttribute("aria-controls")).toBeTruthy();
});

test("it should filter options when searchable", async () => {
  mountAutocomplete({
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

test("it should render grouped options with section titles", async () => {
  mountAutocomplete({
    props: {
      modelValue: undefined,
      options: [
        {
          sticky: true,
          title: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending" },
          ],
        },
        { label: "Other", value: "other" },
      ],
    },
  });

  const combobox = document.body.querySelector('[role="combobox"]');

  await combobox?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(document.body.textContent).toContain("Other");
  expect(document.body.textContent).toContain("Status");
  expect(document.body.textContent).toContain("Active");
});

test("it should select from composed default slot", async () => {
  const onChange = vi.fn();

  mountAutocomplete({
    props: {
      onChange,
      options: [],
      modelValue: undefined,
    },
    slots: {
      default: () => [
        h(ListSection, { title: "Status" }),
        h(ListItem, { value: "active", primary: "Active" }),
        h(ListItem, { value: "pending", primary: "Pending" }),
      ],
    },
  });

  const combobox = document.body.querySelector('[role="combobox"]');

  await combobox?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(document.body.textContent).toContain("Status");

  const active = Array.from(
    document.body.querySelectorAll('[role="option"]'),
  ).find((el) => el.textContent?.includes("Active"));

  await active?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalledWith("active");
});

test("it should start with defaultValue when v-model is not bound", () => {
  mountAutocomplete({
    props: { defaultValue: "pending" },
  });

  const combobox = document.body.querySelector(
    '[role="combobox"]',
  ) as HTMLInputElement;

  expect(combobox.value).toBe("Pending");
});

test("it should select freely when defaultValue is set without v-model", async () => {
  const wrapper = mountAutocomplete({
    props: { defaultValue: "pending" },
  });

  await wrapper.find('[role="combobox"]').trigger("click");
  await flushPromises();

  const active = Array.from(
    document.body.querySelectorAll('[role="option"]'),
  ).find((el) => el.textContent?.includes("Active"));

  await active?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  const combobox = document.body.querySelector(
    '[role="combobox"]',
  ) as HTMLInputElement;

  expect(combobox.value).toBe("Active");
});

test("it should ignore defaultValue when modelValue is bound", () => {
  mountAutocomplete({
    props: { modelValue: "active", defaultValue: "pending" },
  });

  const combobox = document.body.querySelector(
    '[role="combobox"]',
  ) as HTMLInputElement;

  expect(combobox.value).toBe("Active");
});

test("it should not forward defaultValue to the trigger input", () => {
  mountAutocomplete({
    props: { defaultValue: "pending" },
  });

  const combobox = document.body.querySelector('[role="combobox"]');

  expect(combobox?.getAttribute("defaultvalue")).toBeNull();
});

test("it should commit free-solo text on Enter by default", async () => {
  const wrapper = mountAutocomplete({
    props: { modelValue: undefined },
  });

  const combobox = wrapper.find('[role="combobox"]');

  await combobox.trigger("click");
  await flushPromises();

  await combobox.setValue("custom");
  await combobox.trigger("keydown", { key: "Enter" });
  await flushPromises();

  expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["custom"]);
});

test("it should not commit free-solo text when freeSolo is disabled", async () => {
  const wrapper = mountAutocomplete({
    props: { freeSolo: false, modelValue: undefined },
  });

  const combobox = wrapper.find('[role="combobox"]');

  await combobox.trigger("click");
  await flushPromises();

  await combobox.setValue("custom");
  await combobox.trigger("keydown", { key: "Enter" });
  await flushPromises();

  const updates = wrapper.emitted("update:modelValue") ?? [];
  expect(updates.some((payload) => payload[0] === "custom")).toBe(false);
});
