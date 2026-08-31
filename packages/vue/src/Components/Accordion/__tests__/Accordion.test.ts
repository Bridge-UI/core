// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Accordion } from "@/Components/Accordion";
import { AccordionItem } from "@/Components/AccordionItem";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
});

const mountedWrappers: Array<ReturnType<typeof mount<typeof Accordion>>> = [];

function basicItems() {
  return [
    h(
      AccordionItem,
      { value: "a", title: "Shipping" },
      {
        default: () => "Delivery in 2–5 business days.",
      },
    ),
    h(
      AccordionItem,
      { value: "b", title: "Returns" },
      {
        default: () => "Free returns within 30 days.",
      },
    ),
    h(
      AccordionItem,
      { value: "c", disabled: true, title: "Warranty" },
      {
        default: () => "One year coverage.",
      },
    ),
  ];
}

function mountAccordion(
  options: Parameters<typeof mount<typeof Accordion>>[1] = {},
) {
  const wrapper = mount(Accordion, {
    ...options,
    props: {
      ...(options.props ?? {}),
      "onUpdate:modelValue": (value: string | string[]) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render triggers and the expanded panel", () => {
  const wrapper = mountAccordion({
    props: { modelValue: "a" },
    slots: { default: basicItems },
  });

  const shipping = wrapper
    .findAll("button")
    .find((button) => button.text().includes("Shipping"));
  const collapsed = wrapper
    .findAll('[role="region"]')
    .find((region) => region.text().includes("Free returns"));

  expect(shipping?.attributes("aria-expanded")).toBe("true");
  expect(collapsed?.attributes("aria-hidden")).toBe("true");
});

test("it should expand another item when clicked in single mode", async () => {
  const wrapper = mountAccordion({
    props: { modelValue: "a" },
    slots: { default: basicItems },
  });

  const returns = wrapper
    .findAll("button")
    .find((button) => button.text().includes("Returns"));

  await returns?.trigger("click");

  expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBe("b");

  const expanded = wrapper
    .findAll("button")
    .find((button) => button.text().includes("Returns"));

  expect(expanded?.attributes("aria-expanded")).toBe("true");
});

test("it should collapse the open item when clicked again in single mode", async () => {
  const wrapper = mountAccordion({
    props: { modelValue: "a" },
    slots: { default: basicItems },
  });

  const shipping = wrapper
    .findAll("button")
    .find((button) => button.text().includes("Shipping"));

  await shipping?.trigger("click");

  expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBe("");
});

test("it should not toggle a disabled item", async () => {
  const wrapper = mountAccordion({
    props: { modelValue: "a" },
    slots: { default: basicItems },
  });

  const warranty = wrapper
    .findAll("button")
    .find((button) => button.text().includes("Warranty"));

  await warranty?.trigger("click");

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
});

test("it should allow multiple expanded items when multiple is true", async () => {
  const wrapper = mountAccordion({
    slots: { default: basicItems },
    props: { multiple: true, modelValue: ["a"] },
  });

  const returns = wrapper
    .findAll("button")
    .find((button) => button.text().includes("Returns"));

  await returns?.trigger("click");

  expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toEqual(["a", "b"]);
});

test("it should apply outlined variant classes on the root", () => {
  const wrapper = mountAccordion({
    props: { modelValue: "a", variant: "outlined" },
    slots: {
      default: () => [
        h(
          AccordionItem,
          { value: "a", title: "One" },
          {
            default: () => "First",
          },
        ),
      ],
    },
  });

  const className = wrapper.classes().join(" ");

  expect(className).toContain("border");
  expect(className).toContain("divide-y");
  expect(className).not.toContain("gap-2");
  expect(className).toContain("rounded-lg");
});

test("it should apply plain variant classes on the root", () => {
  const wrapper = mountAccordion({
    props: { modelValue: "a", variant: "plain" },
    slots: {
      default: () => [
        h(
          AccordionItem,
          { value: "a", title: "One" },
          {
            default: () => "First",
          },
        ),
      ],
    },
  });

  const className = wrapper.classes().join(" ");

  expect(className).toContain("gap-1");
  expect(className).not.toContain("border");
  expect(className).not.toContain("divide-y");

  const trigger = wrapper.get("button");

  expect(trigger.classes()).toContain("py-1.5");
  expect(trigger.classes()).toContain("px-2");
  expect(trigger.classes()).toContain("min-h-8");
  expect(trigger.classes().join(" ")).not.toContain("text-primary-700");

  const panel = wrapper.get('[role="region"]');

  expect(panel.classes()).toContain("border-l");
  expect(panel.classes()).toContain("p-0");
  expect(panel.classes()).not.toContain("pb-4");
});

test("it should apply separated variant classes on the root", () => {
  const wrapper = mountAccordion({
    props: { modelValue: "a", variant: "separated" },
    slots: {
      default: () => [
        h(
          AccordionItem,
          { value: "a", title: "One" },
          {
            default: () => "First",
          },
        ),
      ],
    },
  });

  expect(wrapper.classes().join(" ")).toContain("gap-2");
});
