// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useDivider, type DividerOwnProps } from "@/Components/Divider";

const libDefaults = {
  color: "dark",
  orientation: "horizontal",
} satisfies Partial<DividerOwnProps>;

function mountUseDivider(props: Partial<DividerOwnProps> = {}) {
  let result!: ReturnType<typeof useDivider>;

  const Wrapper = defineComponent({
    setup() {
      result = useDivider(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should merge default color and orientation", () => {
  const { merged } = mountUseDivider();

  expect(merged.value.color).toBe("dark");
  expect(merged.value.orientation).toBe("horizontal");
});

test("it should override color when prop is passed", () => {
  const { merged } = mountUseDivider({ color: "primary" });

  expect(merged.value.color).toBe("primary");
});

test("it should override orientation when prop is passed", () => {
  const { merged } = mountUseDivider({ orientation: "vertical" });

  expect(merged.value.orientation).toBe("vertical");
});

test("it should compute root class as a non-empty string", () => {
  const { rootBind } = mountUseDivider();

  expect(rootBind.value.class.length).toBeGreaterThan(0);
});

test("it should merge class into root bind", () => {
  const { rootBind } = mountUseDivider({ class: "my-4" });

  expect(rootBind.value.class).toContain("my-4");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseDivider({
    id: "divider-root",
    "data-testid": "divider",
  });

  expect(rootBind.value.id).toBe("divider-root");
  expect(rootBind.value["data-testid"]).toBe("divider");
});

test("it should apply class after classes.root in root bind", () => {
  const { rootBind } = mountUseDivider({
    class: "my-8",
    classes: { root: "my-2" },
  });

  expect(rootBind.value.class).toContain("my-8");
  expect(rootBind.value.class).not.toContain("my-2");
});

test("it should apply vertical orientation classes", () => {
  const { rootBind } = mountUseDivider({ orientation: "vertical" });

  expect(rootBind.value.class).toContain("border-l");
  expect(rootBind.value["aria-orientation"]).toBe("vertical");
});

test("it should apply primary color class when color is primary", () => {
  const { rootBind } = mountUseDivider({ color: "primary" });

  expect(rootBind.value.class).toContain("border-primary-200");
});

test("it should set separator role on rootBind", () => {
  const { rootBind } = mountUseDivider();

  expect(rootBind.value.role).toBe("separator");
});
