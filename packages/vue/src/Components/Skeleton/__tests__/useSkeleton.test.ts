// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useSkeleton, type SkeletonOwnProps } from "@/Components/Skeleton";

const libDefaults = {
  rounded: "md",
} satisfies Partial<SkeletonOwnProps>;

function mountUseSkeleton(props: Partial<SkeletonOwnProps> = {}) {
  let result!: ReturnType<typeof useSkeleton>;

  const Wrapper = defineComponent({
    setup() {
      result = useSkeleton(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should merge default rounded", () => {
  const { merged } = mountUseSkeleton();

  expect(merged.value.rounded).toBe("md");
});

test("it should override rounded when prop is passed", () => {
  const { merged } = mountUseSkeleton({ rounded: "full" });

  expect(merged.value.rounded).toBe("full");
});

test("it should compute root class as a non-empty string", () => {
  const { rootBind } = mountUseSkeleton();

  expect(rootBind.value.class.length).toBeGreaterThan(0);
});

test("it should merge class into root bind", () => {
  const { rootBind } = mountUseSkeleton({ class: "h-4 w-32" });

  expect(rootBind.value.class).toContain("h-4");
  expect(rootBind.value.class).toContain("w-32");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseSkeleton({
    id: "skeleton-root",
    "data-testid": "skeleton",
  });

  expect(rootBind.value.id).toBe("skeleton-root");
  expect(rootBind.value["data-testid"]).toBe("skeleton");
});

test("it should apply class after classes.root in root bind", () => {
  const { rootBind } = mountUseSkeleton({
    class: "h-8",
    classes: { root: "h-4" },
  });

  expect(rootBind.value.class).toContain("h-8");
  expect(rootBind.value.class).not.toContain("h-4");
});

test("it should apply rounded-full class when rounded is full", () => {
  const { rootBind } = mountUseSkeleton({ rounded: "full" });

  expect(rootBind.value.class).toContain("rounded-full");
});

test("it should apply pulse animation classes", () => {
  const { rootBind } = mountUseSkeleton();

  expect(rootBind.value.class).toContain("animate-pulse");
});
