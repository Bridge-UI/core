// ** External Imports
import { mount } from "@vue/test-utils";
import { Info } from "lucide-vue-next";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useMiniButton,
  type MiniButtonOwnProps,
  type MiniButtonProps,
} from "@/Components/MiniButton";

const libDefaults: Partial<MiniButtonOwnProps> = {
  size: "md",
  as: "button",
  rounded: "md",
  variant: "flat",
  color: "primary",
};

function mountUseMiniButton(
  props: MiniButtonProps = { icon: Info },
  slots?: Record<string, () => unknown>,
) {
  let result!: ReturnType<typeof useMiniButton>;

  const Wrapper = defineComponent({
    setup() {
      result = useMiniButton(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper, { slots });

  return result;
}

test("it should default to button element", () => {
  const { tag, isButton } = mountUseMiniButton();

  expect(tag.value).toBe("button");
  expect(isButton.value).toBe(true);
});

test("it should be disabled when loading", () => {
  const { isDisabled, showSpinner, showIcon } = mountUseMiniButton({
    icon: Info,
    loading: true,
  });

  expect(showIcon.value).toBe(false);
  expect(isDisabled.value).toBe(true);
  expect(showSpinner.value).toBe(true);
});

test("it should show icon when not loading", () => {
  const { showIcon } = mountUseMiniButton();

  expect(showIcon.value).toBe(true);
});

test("it should show default slot instead of icon when slot is provided", () => {
  const { showDefaultSlot, showIcon } = mountUseMiniButton(
    {},
    {
      default: () => h("span", "AB"),
    },
  );

  expect(showIcon.value).toBe(false);
  expect(showDefaultSlot.value).toBe(true);
});

test("it should hide default slot when loading", () => {
  const { showDefaultSlot, showSpinner } = mountUseMiniButton(
    { loading: true },
    {
      default: () => h("span", "AB"),
    },
  );

  expect(showSpinner.value).toBe(true);
  expect(showDefaultSlot.value).toBe(false);
});

test("it should prefer icon over default slot when both are provided", () => {
  const { showDefaultSlot, showIcon } = mountUseMiniButton(
    { icon: Info },
    {
      default: () => h("span", "AB"),
    },
  );

  expect(showIcon.value).toBe(true);
  expect(showDefaultSlot.value).toBe(false);
});

test("it should merge class into rootClass", () => {
  const { rootClass } = mountUseMiniButton({
    icon: Info,
    class: "custom-mini",
  });

  expect(rootClass.value).toContain("custom-mini");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseMiniButton({
    icon: Info,
    id: "settings-btn",
    "data-testid": "mini-button",
  });

  expect(rootBind.value.id).toBe("settings-btn");
  expect(rootBind.value["data-testid"]).toBe("mini-button");
});
