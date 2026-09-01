// ** External Imports
import { mount } from "@vue/test-utils";
import { isString } from "es-toolkit/compat";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useEmptyState,
  type EmptyStateOwnProps,
} from "@/Components/EmptyState";

const libDefaults: Partial<EmptyStateOwnProps> = {
  size: "md",
  titleAs: "p",
  align: "center",
  mediaDecorative: true,
};

function mountUseEmptyState(props: Partial<EmptyStateOwnProps> = {}) {
  let result!: ReturnType<typeof useEmptyState>;

  const Wrapper = defineComponent({
    setup() {
      result = useEmptyState(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should return default size as md", () => {
  const { merged } = mountUseEmptyState();

  expect(merged.value.size).toBe("md");
});

test("it should override size when prop is passed", () => {
  const { merged } = mountUseEmptyState({ size: "sm" });

  expect(merged.value.size).toBe("sm");
});

test("it should return default align as center", () => {
  const { merged } = mountUseEmptyState();

  expect(merged.value.align).toBe("center");
});

test("it should compute root class as a non-empty string", () => {
  const { rootBind } = mountUseEmptyState();

  expect(isString(rootBind.value.class)).toBe(true);
  expect(rootBind.value.class.length).toBeGreaterThan(0);
});

test("it should include compact size classes when size is sm", () => {
  const { rootBind } = mountUseEmptyState({ size: "sm" });

  expect(rootBind.value.class).toContain("max-w-sm");
});

test("it should include start alignment classes when align is start", () => {
  const { rootBind } = mountUseEmptyState({ align: "start" });

  expect(rootBind.value.class).toContain("items-start");
});

test("it should include end alignment classes when align is end", () => {
  const { rootBind } = mountUseEmptyState({ align: "end" });

  expect(rootBind.value.class).toContain("ms-auto");
});

test("it should set iconBind size from the size token", () => {
  const { iconBind } = mountUseEmptyState();

  expect(iconBind.value.size).toBe("xl");
});

test("it should set compact iconBind size when size is sm", () => {
  const { iconBind } = mountUseEmptyState({ size: "sm" });

  expect(iconBind.value.size).toBe("lg");
});

test("it should let customProps.icon.size override the token size", () => {
  const { iconBind } = mountUseEmptyState({
    customProps: { icon: { size: "xs" } },
  });

  expect(iconBind.value.size).toBe("xs");
});

test("it should mark media as hidden when mediaDecorative is true", () => {
  const { mediaBind } = mountUseEmptyState();

  expect(mediaBind.value["aria-hidden"]).toBe(true);
});

test("it should not mark media as hidden when mediaDecorative is false", () => {
  const { mediaBind } = mountUseEmptyState({ mediaDecorative: false });

  expect(mediaBind.value["aria-hidden"]).toBeUndefined();
});

test("it should merge class into root bind", () => {
  const { rootBind } = mountUseEmptyState({ class: "custom-empty" });

  expect(rootBind.value.class).toContain("custom-empty");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseEmptyState({
    id: "empty-root",
    "data-testid": "empty",
  });

  expect(rootBind.value.id).toBe("empty-root");
  expect(rootBind.value["data-testid"]).toBe("empty");
});

test("it should apply class after classes.root in root bind", () => {
  const { rootBind } = mountUseEmptyState({
    class: "py-4",
    classes: { root: "py-10" },
  });

  expect(rootBind.value.class).toContain("py-4");
  expect(rootBind.value.class).not.toContain("py-10");
});

test("it should forward customProps.root onto rootBind", () => {
  const { rootBind } = mountUseEmptyState({
    customProps: { root: { id: "empty-root-part" } },
  });

  expect(rootBind.value.id).toBe("empty-root-part");
});

test("it should expose default titleAs as p", () => {
  const { merged } = mountUseEmptyState();

  expect(merged.value.titleAs).toBe("p");
});
