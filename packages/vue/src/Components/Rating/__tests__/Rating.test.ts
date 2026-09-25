// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Rating } from "@/Components/Rating";

test("it should render five stars by default", () => {
  const wrapper = mount(Rating, {
    props: { endLabel: "Quality" },
  });

  expect(wrapper.findAll('[role="radio"]')).toHaveLength(5);
  expect(wrapper.text()).toContain("Quality");
});

test("it should select a value and clear it when the same item is clicked", async () => {
  const wrapper = mount(Rating, {
    props: { endLabel: "Quality" },
  });

  const item = wrapper.findAll('[role="radio"]')[2];

  await item?.trigger("click");

  expect(item?.attributes("aria-checked")).toBe("true");

  await item?.trigger("click");

  expect(item?.attributes("aria-checked")).toBe("false");
});

test("it should emit the next value in controlled mode", async () => {
  const wrapper = mount(Rating, {
    props: { modelValue: 1, endLabel: "Quality" },
  });

  await wrapper.findAll('[role="radio"]')[3]?.trigger("click");

  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([4]);
});

test("it should emit null when the current value is chosen again", async () => {
  const wrapper = mount(Rating, {
    props: { modelValue: 2, endLabel: "Quality" },
  });

  await wrapper.findAll('[role="radio"]')[1]?.trigger("click");

  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
});

test("it should preview a value on hover without committing it", async () => {
  const wrapper = mount(Rating, {
    props: { endLabel: "Quality" },
  });

  await wrapper.findAll('[role="radio"]')[2]?.trigger("mouseenter");

  const icons = wrapper.findAll("svg");

  expect(icons[2]?.classes()).toContain("text-primary-500");
  expect(icons[3]?.classes()).not.toContain("text-primary-500");
  expect(wrapper.findAll('[role="radio"]')[2]?.attributes("aria-checked")).toBe(
    "false",
  );

  await wrapper.get('[role="radiogroup"]').trigger("mouseleave");

  expect(icons[2]?.classes()).not.toContain("text-primary-500");
});

test("it should change the value from the keyboard", async () => {
  const wrapper = mount(Rating, {
    props: { endLabel: "Quality" },
  });

  await wrapper.findAll('[role="radio"]')[0]?.trigger("keydown", {
    key: "ArrowRight",
  });

  expect(wrapper.findAll('[role="radio"]')[0]?.attributes("aria-checked")).toBe(
    "true",
  );

  await wrapper.findAll('[role="radio"]')[0]?.trigger("keydown", {
    key: "ArrowRight",
  });

  expect(wrapper.findAll('[role="radio"]')[1]?.attributes("aria-checked")).toBe(
    "true",
  );

  await wrapper.findAll('[role="radio"]')[1]?.trigger("keydown", {
    key: "End",
  });

  expect(wrapper.findAll('[role="radio"]')[4]?.attributes("aria-checked")).toBe(
    "true",
  );

  await wrapper.findAll('[role="radio"]')[4]?.trigger("keydown", {
    key: "Home",
  });

  expect(wrapper.findAll('[role="radio"]')[0]?.attributes("aria-checked")).toBe(
    "true",
  );

  await wrapper.findAll('[role="radio"]')[0]?.trigger("keydown", {
    key: "ArrowLeft",
  });

  expect(wrapper.findAll('[role="radio"]')[0]?.attributes("aria-checked")).toBe(
    "false",
  );
});

test("it should render only max items", () => {
  const wrapper = mount(Rating, {
    props: { max: 3, endLabel: "Quality" },
  });

  expect(wrapper.findAll('[role="radio"]')).toHaveLength(3);
});

test("it should ignore changes when readonly", async () => {
  const wrapper = mount(Rating, {
    props: { modelValue: 2, readonly: true, endLabel: "Quality" },
  });

  await wrapper.findAll('[role="radio"]')[3]?.trigger("click");

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  expect(wrapper.findAll('[role="radio"]')[1]?.attributes("aria-checked")).toBe(
    "true",
  );
});

test("it should disable each item when disabled", () => {
  const wrapper = mount(Rating, {
    props: { disabled: true, endLabel: "Quality" },
  });

  for (const item of wrapper.findAll('[role="radio"]')) {
    expect((item.element as HTMLButtonElement).disabled).toBe(true);
  }
});

test("it should set aria-invalid when error is set", () => {
  const wrapper = mount(Rating, {
    props: {
      error: true,
      endLabel: "Quality",
      errorMessage: "Choose a score.",
    },
  });

  expect(wrapper.get('[role="radiogroup"]').attributes("aria-invalid")).toBe(
    "true",
  );
  expect(wrapper.text()).toContain("Choose a score.");
});

test("it should submit the value through a named hidden input", () => {
  const wrapper = mount(Rating, {
    props: { name: "score", defaultValue: 4 },
  });

  const input = wrapper.get('input[type="hidden"]')
    .element as HTMLInputElement;

  expect(input.name).toBe("score");
  expect(input.value).toBe("4");
});
