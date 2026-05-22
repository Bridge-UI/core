// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useBadge,
  type BadgeOwnProps,
  type BadgeProps,
} from "@/Components/Badge";

const libDefaults = {
  size: "sm",
  rounded: "md",
  variant: "flat",
  color: "primary",
  density: "default",
} satisfies Partial<BadgeOwnProps>;

function mountUseBadge(props: BadgeProps = {}) {
  let result!: ReturnType<typeof useBadge>;

  const Wrapper = defineComponent({
    setup() {
      result = useBadge(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should merge default color and variant", () => {
  const { merged } = mountUseBadge();

  expect(merged.value.variant).toBe("flat");
  expect(merged.value.color).toBe("primary");
});

test("it should override color when prop is passed", () => {
  const { merged } = mountUseBadge({ color: "error" });

  expect(merged.value.color).toBe("error");
});

test("it should compute root class as a non-empty string", () => {
  const { rootBind } = mountUseBadge();

  expect(rootBind.value.class.length).toBeGreaterThan(0);
});

test("it should merge class into root bind", () => {
  const { rootBind } = mountUseBadge({ class: "custom-badge" });

  expect(rootBind.value.class).toContain("custom-badge");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseBadge({
    id: "badge-root",
    "data-testid": "badge",
  });

  expect(rootBind.value.id).toBe("badge-root");
  expect(rootBind.value["data-testid"]).toBe("badge");
});

test("it should apply class after classes.root in root bind", () => {
  const { rootBind } = mountUseBadge({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootBind.value.class).toContain("p-4");
  expect(rootBind.value.class).not.toContain("p-2");
});

test("it should shrink-wrap width in flex layouts", () => {
  const { rootBind } = mountUseBadge();

  expect(rootBind.value.class).toContain("w-fit");
});

test("it should apply w-full when full is true", () => {
  const { rootBind } = mountUseBadge({ full: true });

  expect(rootBind.value.class).toContain("w-full");
  expect(rootBind.value.class).not.toContain("w-fit");
});

test("it should not apply w-full on mini density even when full is true", () => {
  const { rootBind } = mountUseBadge({ density: "mini", full: true });

  expect(rootBind.value.class).not.toContain("w-fit");
  expect(rootBind.value.class).not.toContain("w-full");
});

test("it should apply mini size classes when density is mini", () => {
  const { rootBind } = mountUseBadge({ density: "mini" });

  expect(rootBind.value.class).toContain("w-6");
  expect(rootBind.value.class).toContain("h-6");
});
