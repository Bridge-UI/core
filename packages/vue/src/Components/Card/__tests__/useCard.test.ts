// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useCard, type CardOwnProps } from "@/Components/Card";

const libDefaults: Partial<CardOwnProps> = {
  shadow: "none",
  padding: "none",
  rounded: "none",
  variant: "elevated",
};

function mountUseCard(props: Partial<CardOwnProps> = {}) {
  let result!: ReturnType<typeof useCard>;

  const Wrapper = defineComponent({
    setup() {
      result = useCard(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should return default variant as elevated", () => {
  const { merged } = mountUseCard();

  expect(merged.value.variant).toBe("elevated");
});

test("it should override variant when prop is passed", () => {
  const { merged } = mountUseCard({ variant: "outlined" });

  expect(merged.value.variant).toBe("outlined");
});

test("it should compute root class as a non-empty string", () => {
  const { rootBind } = mountUseCard();

  expect(typeof rootBind.value.class).toBe("string");
  expect(rootBind.value.class.length).toBeGreaterThan(0);
});

test("it should include shadow classes for elevated variant when shadow is set", () => {
  const { rootBind } = mountUseCard({ variant: "elevated", shadow: "sm" });

  expect(rootBind.value.class).toContain("shadow");
});

test("it should omit shadow classes for non-elevated variants", () => {
  const { rootBind } = mountUseCard({ variant: "flat", shadow: "sm" });

  expect(rootBind.value.class).not.toContain("shadow-sm");
});

test("it should include rounded classes when rounded is set", () => {
  const { rootBind } = mountUseCard({ rounded: "md" });

  expect(rootBind.value.class).toContain("rounded");
});

test("it should include header border for elevated variant", () => {
  const { headerBind } = mountUseCard({ title: "Test", variant: "elevated" });

  expect(headerBind.value.class).toContain("border-b");
});

test("it should omit header border for flat variant", () => {
  const { headerBind } = mountUseCard({ title: "Test", variant: "flat" });

  expect(headerBind.value.class).not.toContain("border-b");
});

test("it should omit header border when borderless is true", () => {
  const { headerBind } = mountUseCard({
    title: "Test",
    borderless: true,
    variant: "elevated",
  });

  expect(headerBind.value.class).not.toContain("border-b");
});

test("it should apply outlined border on root", () => {
  const { rootBind } = mountUseCard({ variant: "outlined" });

  expect(rootBind.value.class).toContain("border");
});

test("it should merge class into root bind", () => {
  const { rootBind } = mountUseCard({ class: "custom-card" });

  expect(rootBind.value.class).toContain("custom-card");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseCard({
    id: "card-root",
    "data-testid": "card",
  });

  expect(rootBind.value.id).toBe("card-root");
  expect(rootBind.value["data-testid"]).toBe("card");
});

test("it should apply class after classes.root in root bind", () => {
  const { rootBind } = mountUseCard({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootBind.value.class).toContain("p-4");
  expect(rootBind.value.class).not.toContain("p-2");
});
