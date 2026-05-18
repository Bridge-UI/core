// ** External Imports
import { mount } from "@vue/test-utils";
import { CircleAlert } from "lucide-vue-next";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useButton, type ButtonProps } from "@/Components/Button";

const libDefaults: Partial<ButtonProps> = {
  as: "button",
  size: "md",
  color: "primary",
  variant: "solid",
  rounded: "sm",
};

function mountUseButton(props: ButtonProps = {}) {
  let result!: ReturnType<typeof useButton>;

  const Wrapper = defineComponent({
    setup() {
      result = useButton(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default to button element", () => {
  const { tag, isButton } = mountUseButton();

  expect(tag.value).toBe("button");
  expect(isButton.value).toBe(true);
});

test("it should render as anchor when as is a", () => {
  const { tag, isAnchor, isButton } = mountUseButton({ as: "a", href: "#" });

  expect(tag.value).toBe("a");
  expect(isAnchor.value).toBe(true);
  expect(isButton.value).toBe(false);
});

test("it should merge default color and variant", () => {
  const { merged } = mountUseButton();

  expect(merged.value.color).toBe("primary");
  expect(merged.value.variant).toBe("solid");
});

test("it should override color when prop is passed", () => {
  const { merged } = mountUseButton({ color: "error" });

  expect(merged.value.color).toBe("error");
});

test("it should be disabled when disabled prop is true", () => {
  const { isDisabled } = mountUseButton({ disabled: true });

  expect(isDisabled.value).toBe(true);
});

test("it should be disabled when loading is true", () => {
  const { isDisabled, showSpinner } = mountUseButton({ loading: true });

  expect(isDisabled.value).toBe(true);
  expect(showSpinner.value).toBe(true);
});

test("it should show start icon when startIcon is set and not loading", () => {
  const { showStartIcon } = mountUseButton({ startIcon: CircleAlert });

  expect(showStartIcon.value).toBe(true);
});

test("it should hide start icon when loading", () => {
  const { showStartIcon } = mountUseButton({
    loading: true,
    startIcon: CircleAlert,
  });

  expect(showStartIcon.value).toBe(false);
});

test("it should compute rootClass as a non-empty string", () => {
  const { rootClass } = mountUseButton();

  expect(typeof rootClass.value).toBe("string");
  expect(rootClass.value.length).toBeGreaterThan(0);
});

test("it should include full width class when full is true", () => {
  const { rootClass } = mountUseButton({ full: true });

  expect(rootClass.value).toContain("w-full");
});
