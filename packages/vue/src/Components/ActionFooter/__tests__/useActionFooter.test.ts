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
  applyColor: "primary",
  cancelVariant: "flat",
  cancelColor: "secondary",
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
  const { merged, rootBind } = mountUseActionFooter();

  expect(merged.value.applyColor).toBe("primary");
  expect(merged.value.cancelColor).toBe("secondary");
  expect(merged.value.cancelVariant).toBe("flat");
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
