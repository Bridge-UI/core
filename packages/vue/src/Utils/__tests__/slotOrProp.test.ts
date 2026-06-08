// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveNamedSlot,
  resolveSlotOrProp,
} from "@/Utils/slotOrProp";

test("it should treat empty string as absent in isPropPresent", () => {
  expect(isPropPresent("")).toBe(false);

  expect(isPropPresent("x")).toBe(true);

  expect(isPropPresent(null)).toBe(false);
});

test("it should detect slot functions in hasNamedSlot", () => {
  expect(hasNamedSlot({}, "label")).toBe(false);

  expect(hasNamedSlot({ label: () => "x" }, "label")).toBe(true);
});

test("it should be true when slot or prop is present in hasSlotOrProp", () => {
  expect(hasSlotOrProp({}, "label", "")).toBe(false);

  expect(hasSlotOrProp({}, "label", "Name")).toBe(true);

  expect(hasSlotOrProp({ label: () => "x" }, "label", "")).toBe(true);
});

test("it should return the stable slot function reference from resolveNamedSlot", () => {
  const slotFn = () => h("span", "From slot");

  expect(resolveNamedSlot({}, "label")).toBeUndefined();

  expect(resolveNamedSlot({ label: slotFn }, "label")).toBe(slotFn);
});

test("it should return the stable slot function when present from resolveSlotOrProp", () => {
  const slotFn = () => h("span", "From slot");

  expect(
    resolveSlotOrProp({ description: slotFn }, "description", "From prop"),
  ).toBe(slotFn);
});

test("it should render fallback when slot is absent from resolveSlotOrProp", () => {
  const Comp = defineComponent({
    setup() {
      return () =>
        h(resolveSlotOrProp({}, "description", "Inform your full name"));
    },
  });

  expect(mount(Comp).text()).toBe("Inform your full name");
});

test("it should prefer slot over fallback in resolveSlotOrProp", () => {
  const Comp = defineComponent({
    setup() {
      return () =>
        h(
          resolveSlotOrProp(
            {
              description: () => h("span", "From slot"),
            },
            "description",
            "From prop",
          ),
        );
    },
  });

  expect(mount(Comp).text()).toBe("From slot");
});

test("it should render nothing when both slot and fallback are absent", () => {
  const Comp = defineComponent({
    setup() {
      return () => h(resolveSlotOrProp({}, "description", ""));
    },
  });

  expect(mount(Comp).text()).toBe("");
});
