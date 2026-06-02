// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, toRef } from "vue";

// ** Local Imports
import { usePasswordField } from "@/Components/PasswordField";

function mountUsePasswordField(
  options: Parameters<typeof usePasswordField>[0],
) {
  let result!: ReturnType<typeof usePasswordField>;

  const Wrapper = defineComponent({
    setup() {
      result = usePasswordField(options);

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
  const { toggleVisibility } = mountUsePasswordField({ onVisibilityChange });

  toggleVisibility();
  toggleVisibility();

  expect(onVisibilityChange).toHaveBeenCalledWith(true);
  expect(onVisibilityChange).toHaveBeenLastCalledWith(false);
});

test("it should read visible from props via toRef", () => {
  const Wrapper = defineComponent({
    props: { visible: Boolean },
    setup(props) {
      const { isVisible } = usePasswordField({
        visible: toRef(props, "visible"),
      });

      return () => h("span", { "data-visible": String(isVisible.value) });
    },
  });

  const wrapper = mount(Wrapper, { props: { visible: true } });

  expect(wrapper.attributes("data-visible")).toBe("true");
});
