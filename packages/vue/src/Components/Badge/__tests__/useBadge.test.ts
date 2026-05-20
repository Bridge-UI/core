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

const libDefaults: Partial<BadgeOwnProps> = {
  size: "sm",
  rounded: "md",
  variant: "flat",
  color: "primary",
};

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

test("it should compute rootClass as a non-empty string", () => {
  const { rootClass } = mountUseBadge();

  expect(rootClass.value.length).toBeGreaterThan(0);
});

test("it should merge class into rootClass", () => {
  const { rootClass } = mountUseBadge({ class: "custom-badge" });

  expect(rootClass.value).toContain("custom-badge");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseBadge({
    id: "badge-root",
    "data-testid": "badge",
  });

  expect(rootBind.value.id).toBe("badge-root");
  expect(rootBind.value["data-testid"]).toBe("badge");
});

test("it should apply class after classes.root in rootClass", () => {
  const { rootClass } = mountUseBadge({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootClass.value).toContain("p-4");
  expect(rootClass.value).not.toContain("p-2");
});

test("it should shrink-wrap width in flex layouts", () => {
  const { rootClass } = mountUseBadge();

  expect(rootClass.value).toContain("w-fit");
});

test("it should apply w-full when full is true", () => {
  const { rootClass } = mountUseBadge({ full: true });

  expect(rootClass.value).toContain("w-full");
  expect(rootClass.value).not.toContain("w-fit");
});

test("it should not apply w-full on mini density even when full is true", () => {
  const { rootClass } = mountUseBadge({ density: "mini", full: true });

  expect(rootClass.value).not.toContain("w-fit");
  expect(rootClass.value).not.toContain("w-full");
});

test("it should apply mini size classes when density is mini", () => {
  const { rootClass } = mountUseBadge({ density: "mini" });

  expect(rootClass.value).toContain("w-6");
  expect(rootClass.value).toContain("h-6");
});
