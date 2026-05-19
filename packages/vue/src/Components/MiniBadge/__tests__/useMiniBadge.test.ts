// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useMiniBadge,
  type MiniBadgeOwnProps,
  type MiniBadgeProps,
} from "@/Components/MiniBadge";

const libDefaults: Partial<MiniBadgeOwnProps> = {
  size: "xs",
  rounded: "full",
  variant: "flat",
  color: "primary",
};

function mountUseMiniBadge(props: MiniBadgeProps = {}) {
  let result!: ReturnType<typeof useMiniBadge>;

  const Wrapper = defineComponent({
    setup() {
      result = useMiniBadge(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should merge default size", () => {
  const { merged } = mountUseMiniBadge();

  expect(merged.value.size).toBe("xs");
});

test("it should override size when prop is passed", () => {
  const { merged } = mountUseMiniBadge({ size: "sm" });

  expect(merged.value.size).toBe("sm");
});

test("it should compute rootClass as a non-empty string", () => {
  const { rootClass } = mountUseMiniBadge();

  expect(rootClass.value.length).toBeGreaterThan(0);
});

test("it should merge class into rootClass", () => {
  const { rootClass } = mountUseMiniBadge({ class: "custom-mini-badge" });

  expect(rootClass.value).toContain("custom-mini-badge");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseMiniBadge({
    id: "mini-badge-root",
    "data-testid": "mini-badge",
  });

  expect(rootBind.value.id).toBe("mini-badge-root");
  expect(rootBind.value["data-testid"]).toBe("mini-badge");
});
