// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";

// ** Local Imports
import { Rating } from "@/Components/Rating";

test("it should render five stars by default", () => {
  const wrapper = mount(Rating, {
    props: { label: "Quality" },
  });

  expect(wrapper.findAll('[role="radio"]')).toHaveLength(5);
  expect(wrapper.text()).toContain("Quality");
});

test("it should select a value and clear it when the same item is clicked", async () => {
  const wrapper = mount(Rating, {
    props: { label: "Quality" },
  });

  const item = wrapper.findAll('[role="radio"]')[2];

  await item?.trigger("click");

  expect(item?.attributes("aria-checked")).toBe("true");

  await item?.trigger("click");

  expect(item?.attributes("aria-checked")).toBe("false");
});

test("it should emit the next value in controlled mode", async () => {
  const wrapper = mount(Rating, {
    props: { modelValue: 1, label: "Quality" },
  });

  await wrapper.findAll('[role="radio"]')[3]?.trigger("click");

  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([4]);
});

test("it should emit null when the current value is chosen again", async () => {
  const wrapper = mount(Rating, {
    props: { modelValue: 2, label: "Quality" },
  });

  await wrapper.findAll('[role="radio"]')[1]?.trigger("click");

  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
});

test("it should select a half step from the pointer", async () => {
  const wrapper = mount(Rating, {
    props: { step: 0.5, label: "Quality" },
  });

  const star = wrapper.findAll('[role="radio"]')[1]!;

  vi.spyOn(star.element, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 100,
    width: 100,
    bottom: 20,
    height: 20,
    toJSON() {
      return {};
    },
  });

  await star.trigger("click", { clientX: 20 });
  await star.trigger("click", { clientX: 80 });

  expect(wrapper.emitted("update:modelValue")).toEqual([[1.5], [2]]);
});

test("it should preview a value on hover without committing it", async () => {
  const wrapper = mount(Rating, {
    props: { label: "Quality" },
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
    props: { label: "Quality" },
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
    props: { max: 3, label: "Quality" },
  });

  expect(wrapper.findAll('[role="radio"]')).toHaveLength(3);
});

test("it should ignore changes when readonly", async () => {
  const wrapper = mount(Rating, {
    props: { modelValue: 2, readonly: true, label: "Quality" },
  });

  await wrapper.findAll('[role="radio"]')[3]?.trigger("click");

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  expect(wrapper.findAll('[role="radio"]')[1]?.attributes("aria-checked")).toBe(
    "true",
  );
});

test("it should move focus without changing the value when readonly", async () => {
  const wrapper = mount(Rating, {
    attachTo: document.body,
    props: { modelValue: 2, readonly: true, label: "Quality" },
  });

  const current = wrapper.findAll('[role="radio"]')[1];
  const next = wrapper.findAll('[role="radio"]')[2];

  (current?.element as HTMLButtonElement).focus();

  await current?.trigger("keydown", { key: "ArrowRight" });

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  expect(current?.attributes("aria-checked")).toBe("true");
  expect(document.activeElement).toBe(next?.element);

  wrapper.unmount();
});

test("it should forward fallthrough attrs and link the label to id", () => {
  const wrapper = mount(Rating, {
    props: { label: "Quality" },
    attrs: { id: "score", class: "mt-2", "data-testid": "rating" },
  });

  const root = wrapper.get("[data-testid='rating']");

  expect(root.classes()).toContain("mt-2");
  expect(root.classes()).toContain("group");
  expect(wrapper.get("label").attributes("for")).toBe("score-0");
  expect(wrapper.get('[role="radio"]').attributes("id")).toBe("score-0");
});

test("it should disable each item when disabled", () => {
  const wrapper = mount(Rating, {
    props: { disabled: true, label: "Quality" },
  });

  for (const item of wrapper.findAll('[role="radio"]')) {
    expect((item.element as HTMLButtonElement).disabled).toBe(true);
  }
});

test("it should set aria-invalid when error is set", () => {
  const wrapper = mount(Rating, {
    props: {
      error: true,
      label: "Quality",
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

  const input = wrapper.get('input[type="hidden"]').element as HTMLInputElement;

  expect(input.value).toBe("4");
  expect(input.name).toBe("score");
});

test("it should fill the next item halfway for a fractional value", () => {
  const wrapper = mount(Rating, {
    props: { modelValue: 1.5, label: "Quality" },
  });

  const items = wrapper.findAll('[role="radio"]');

  expect(items[0]?.findAll("svg")).toHaveLength(1);
  expect(items[1]?.findAll("svg")).toHaveLength(2);
  expect(items[1]?.find(".overflow-hidden").attributes("style")).toContain(
    "width: 50%",
  );
  expect(items[0]?.find("svg").classes()).toContain("text-primary-500");
  expect(items[2]?.find("svg").classes()).not.toContain("text-primary-500");
  expect(items[1]?.find(".overflow-hidden svg").classes()).toContain(
    "text-primary-500",
  );
});
