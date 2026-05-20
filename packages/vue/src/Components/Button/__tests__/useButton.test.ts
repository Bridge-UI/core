// ** External Imports
import { mount } from "@vue/test-utils";
import { CircleAlert } from "lucide-vue-next";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useButton,
  type ButtonOwnProps,
  type ButtonProps,
} from "@/Components/Button";

const libDefaults: Partial<ButtonOwnProps> = {
  size: "md",
  as: "button",
  rounded: "md",
  color: "primary",
  variant: "solid",
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

test("it should show text when text prop is set", () => {
  const { showText } = mountUseButton({ text: "Label" });

  expect(showText.value).toBe(true);
});

test("it should hide default slot when text prop is set", () => {
  const { showDefaultSlot } = mountUseButton({ text: "Label" });

  expect(showDefaultSlot.value).toBe(false);
});

test("it should hide text when loading", () => {
  const { showText } = mountUseButton({ loading: true, text: "Label" });

  expect(showText.value).toBe(false);
});

test("it should merge class into rootClass", () => {
  const { rootClass } = mountUseButton({ class: "custom-button" });

  expect(rootClass.value).toContain("custom-button");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseButton({
    id: "submit-btn",
    "data-testid": "button",
  });

  expect(rootBind.value.id).toBe("submit-btn");
  expect(rootBind.value["data-testid"]).toBe("button");
});

test("it should apply class after classes.root in rootClass", () => {
  const { rootClass } = mountUseButton({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootClass.value).toContain("p-4");
  expect(rootClass.value).not.toContain("p-2");
});

test("it should include aria-disabled styles for non-button elements", () => {
  const { rootClass } = mountUseButton({ as: "a", href: "#" });

  expect(rootClass.value).toContain("aria-disabled:opacity-80");
});
