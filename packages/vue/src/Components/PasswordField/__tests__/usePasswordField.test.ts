// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { usePasswordField } from "@/Components/PasswordField";
import type { PasswordFieldOwnProps } from "@/Components/PasswordField/passwordField.types";

function mountUsePasswordField(
  props: Partial<PasswordFieldOwnProps> = {},
  options: { onVisibilityChange?: (visible: boolean) => void } = {},
) {
  let result!: ReturnType<typeof usePasswordField>;

  const Wrapper = defineComponent({
    setup() {
      result = usePasswordField(props as PasswordFieldOwnProps, options);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default to hidden password", () => {
  const { isVisible } = mountUsePasswordField();

  expect(isVisible.value).toBe(false);
});

test("it should use visible when controlled", () => {
  const { isVisible } = mountUsePasswordField({ visible: true });

  expect(isVisible.value).toBe(true);
});

test("it should toggle visibility when uncontrolled", () => {
  const { isVisible, toggleVisibility } = mountUsePasswordField();

  toggleVisibility();

  expect(isVisible.value).toBe(true);

  toggleVisibility();

  expect(isVisible.value).toBe(false);
});

test("it should call onVisibilityChange when toggling", () => {
  const onVisibilityChange = vi.fn();
  const { toggleVisibility } = mountUsePasswordField(
    {},
    { onVisibilityChange },
  );

  toggleVisibility();
  toggleVisibility();

  expect(onVisibilityChange).toHaveBeenCalledWith(true);
  expect(onVisibilityChange).toHaveBeenLastCalledWith(false);
});

test("it should read visible from props", () => {
  const Wrapper = defineComponent({
    props: { visible: Boolean },
    setup(props) {
      const { isVisible } = usePasswordField(props);

      return () => h("span", { "data-visible": String(isVisible.value) });
    },
  });

  const wrapper = mount(Wrapper, { props: { visible: true } });

  expect(wrapper.attributes("data-visible")).toBe("true");
});
