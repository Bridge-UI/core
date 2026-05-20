// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveSlotOrProp,
} from "@/Utils/slotOrProp";

test("isPropPresent treats empty string as absent", () => {
  expect(isPropPresent("")).toBe(false);

  expect(isPropPresent("x")).toBe(true);

  expect(isPropPresent(null)).toBe(false);
});

test("hasNamedSlot detects slot functions", () => {
  expect(hasNamedSlot({}, "label")).toBe(false);

  expect(hasNamedSlot({ label: () => "x" }, "label")).toBe(true);
});

test("hasSlotOrProp is true when slot or prop is present", () => {
  expect(hasSlotOrProp({}, "label", "")).toBe(false);

  expect(hasSlotOrProp({}, "label", "Name")).toBe(true);

  expect(hasSlotOrProp({ label: () => "x" }, "label", "")).toBe(true);
});

test("resolveSlotOrProp renders fallback when slot is absent", () => {
  const Comp = defineComponent({
    setup() {
      return () =>
        h(resolveSlotOrProp({}, "description", "Inform your full name"));
    },
  });

  expect(mount(Comp).text()).toBe("Inform your full name");
});

test("resolveSlotOrProp prefers slot over fallback", () => {
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

test("resolveSlotOrProp renders nothing when both are absent", () => {
  const Comp = defineComponent({
    setup() {
      return () => h(resolveSlotOrProp({}, "description", ""));
    },
  });

  expect(mount(Comp).text()).toBe("");
});
