// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useCheckbox, type CheckboxOwnProps } from "@/Components/Checkbox";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

const libDefaults = {
  size: "md",
  rounded: "sm",
  color: "primary",
} satisfies Partial<CheckboxOwnProps>;

function mountUseCheckbox(props: CheckboxOwnProps = {}, checked = false) {
  let result!: ReturnType<typeof useCheckbox>;

  const checkedRef = ref(checked);

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useCheckbox(() => props, libDefaults, checkedRef);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { ...result, checkedRef };
}

test("it should merge default size, rounded, and color", () => {
  const { merged } = mountUseCheckbox();

  expect(merged.value.size).toBe("md");
  expect(merged.value.rounded).toBe("sm");
  expect(merged.value.color).toBe("primary");
});

test("it should inherit size from FormControl registry defaultProps", () => {
  let result!: ReturnType<typeof useCheckbox>;

  const Consumer = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useCheckbox(() => ({}), libDefaults, ref(false));

      return () => h("div");
    },
  });

  mount(BridgeUIProvider, {
    slots: { default: () => h(Consumer) },
    props: {
      components: { FormControl: { defaultProps: { size: "lg" } } },
    },
  });

  expect(result.merged.value.size).toBe("lg");
  expect(result.controlBind.value.class).toContain("w-6");
});

test("it should reflect checked state from model ref", () => {
  const { isChecked, checkedRef } = mountUseCheckbox({}, false);

  expect(isChecked.value).toBe(false);

  checkedRef.value = true;

  expect(isChecked.value).toBe(true);
});

test("it should use error color when form control is invalid and checked", () => {
  const { controlBind } = mountUseCheckbox({ error: true }, true);

  expect(controlBind.value.class).toContain("bg-error-600");
});

test("it should set checkbox type on inputBind", () => {
  const { inputBind } = mountUseCheckbox();

  expect(inputBind.value.type).toBe("checkbox");
});

test("it should hide native input visually", () => {
  const { inputBind } = mountUseCheckbox();

  expect(inputBind.value.class).toContain("sr-only");
});
