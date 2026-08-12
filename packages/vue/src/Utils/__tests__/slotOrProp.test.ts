// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  SlotOrProp,
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

test("it should render SlotOrProp fallback without remounting on slot identity churn", async () => {
  const slotA = () => h("span", "A");
  const slotB = () => h("span", "B");

  const Host = defineComponent({
    props: {
      slotFn: {
        type: Function,
        required: true,
      },
    },
    setup(props) {
      return () =>
        h(SlotOrProp, {
          name: "label",
          slots: { label: props.slotFn as () => unknown },
        });
    },
  });

  const wrapper = mount(Host, { props: { slotFn: slotA } });

  expect(wrapper.text()).toBe("A");

  await wrapper.setProps({ slotFn: slotB });

  expect(wrapper.text()).toBe("B");
});

test("it should render SlotOrProp text fallback when slot is absent", () => {
  const Comp = defineComponent({
    setup() {
      return () =>
        h(SlotOrProp, {
          slots: {},
          name: "description",
          fallback: "Inform your full name",
        });
    },
  });

  expect(mount(Comp).text()).toBe("Inform your full name");
});

test("it should prefer slot over fallback in SlotOrProp", () => {
  const Comp = defineComponent({
    setup() {
      return () =>
        h(SlotOrProp, {
          name: "description",
          fallback: "From prop",
          slots: {
            description: () => h("span", "From slot"),
          },
        });
    },
  });

  expect(mount(Comp).text()).toBe("From slot");
});

test("it should render nothing when both slot and fallback are absent", () => {
  const Comp = defineComponent({
    setup() {
      return () =>
        h(SlotOrProp, {
          slots: {},
          fallback: "",
          name: "description",
        });
    },
  });

  expect(mount(Comp).text()).toBe("");
});
