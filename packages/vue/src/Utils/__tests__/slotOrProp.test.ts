// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  RenderFn,
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

test("it should render RenderFn without remounting on fn identity churn", async () => {
  const fnA = () => h("span", "A");
  const fnB = () => h("span", "B");

  const Host = defineComponent({
    props: {
      render: {
        type: Function,
        required: true,
      },
    },
    setup(props) {
      return () => h(RenderFn, { fn: props.render as () => unknown });
    },
  });

  const wrapper = mount(Host, { props: { render: fnA } });

  expect(wrapper.text()).toBe("A");

  await wrapper.setProps({ render: fnB });

  expect(wrapper.text()).toBe("B");
});

test("it should render nothing when RenderFn has no fn", () => {
  const Comp = defineComponent({
    setup() {
      return () => h(RenderFn, {});
    },
  });

  expect(mount(Comp).text()).toBe("");
});
