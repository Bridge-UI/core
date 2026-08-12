// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  presentSlotNames,
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

test("it should return only passed names from presentSlotNames", () => {
  const names = ["end", "label", "start"] as const;

  expect(presentSlotNames(names, {})).toEqual([]);

  expect(presentSlotNames(names, { end: () => "y", label: () => "x" })).toEqual(
    ["label", "end"],
  );
});

test("it should keep child instance across RenderFn fn identity churn", async () => {
  let mountCount = 0;

  const Inner = defineComponent({
    props: {
      label: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      mountCount += 1;

      return () => h("span", props.label);
    },
  });

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

  const wrapper = mount(Host, {
    props: { render: () => h(Inner, { label: "A" }) },
  });

  expect(wrapper.text()).toBe("A");
  expect(mountCount).toBe(1);

  await wrapper.setProps({
    render: () => h(Inner, { label: "B" }),
  });

  expect(wrapper.text()).toBe("B");
  expect(mountCount).toBe(1);
});

test("it should render nothing when RenderFn has no fn", () => {
  const Comp = defineComponent({
    setup() {
      return () => h(RenderFn, {});
    },
  });

  expect(mount(Comp).text()).toBe("");
});
