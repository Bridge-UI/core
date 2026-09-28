// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useActionFooter,
  type ActionFooterOwnProps,
} from "@/Components/ActionFooter";

const libDefaults = {
  color: "primary",
  cancelVariant: "flat",
} as const satisfies Partial<ActionFooterOwnProps>;

function mountUseActionFooter(props: Partial<ActionFooterOwnProps> = {}) {
  let result!: ReturnType<typeof useActionFooter>;

  const Wrapper = defineComponent({
    setup() {
      result = useActionFooter({ ...props }, libDefaults, () => undefined);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should return default Apply and Cancel tokens", () => {
  const { merged, rootBind, applyButtonBind, cancelButtonBind } =
    mountUseActionFooter();

  expect(merged.value.color).toBe("primary");
  expect(merged.value.cancelVariant).toBe("flat");
  expect(applyButtonBind.value.color).toBe("primary");
  expect(cancelButtonBind.value.color).toBe("primary");
  expect(rootBind.value.class).toContain("contents");
});

test("it should resolve i18n labels when none are provided", () => {
  const { applyLabel, cancelLabel } = mountUseActionFooter();

  expect(applyLabel.value).toBe("Apply");
  expect(cancelLabel.value).toBe("Cancel");
});

test("it should merge registry classes", () => {
  const { rootBind, mergedClasses } = mountUseActionFooter({
    classes: { root: "custom-footer" },
  });

  expect(mergedClasses.value.root).toBe("custom-footer");
  expect(rootBind.value.class).toContain("custom-footer");
});
