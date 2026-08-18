// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useColorPicker,
  type ColorPickerOwnProps,
} from "@/Components/ColorPicker";

const libDefaults = {
  rounded: "md",
  format: "hex",
} as const satisfies Partial<ColorPickerOwnProps>;

function mountUseColorPicker(props: Partial<ColorPickerOwnProps> = {}) {
  let result!: ReturnType<typeof useColorPicker>;

  const emit = vi.fn();

  const Wrapper = defineComponent({
    setup() {
      result = useColorPicker(props, libDefaults, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should default showFooter to false", () => {
  const { showFooter } = mountUseColorPicker();

  expect(showFooter.value).toBe(false);
});

test("it should enable footer when showFooter is set", () => {
  const { showFooter } = mountUseColorPicker({ showFooter: true });

  expect(showFooter.value).toBe(true);
});

test("it should size the root to a fixed panel width", () => {
  const { rootBind } = mountUseColorPicker();

  expect(rootBind.value.class).toContain("w-72");
});

test("it should hide alpha for hex by default", () => {
  const { showAlpha } = mountUseColorPicker();

  expect(showAlpha.value).toBe(false);
});

test("it should show alpha for rgba", () => {
  const { showAlpha } = mountUseColorPicker({ format: "rgba" });

  expect(showAlpha.value).toBe(true);
});

test("it should use panel-full rounding when rounded is full", () => {
  const { areaBind } = mountUseColorPicker({ rounded: "full" });

  expect(areaBind.value.class).toContain("rounded-panel-full");
});

test("it should keep dark swatch chrome when error is set", () => {
  const { swatchSelectedClass } = mountUseColorPicker({ error: true });

  expect(swatchSelectedClass.value).toContain("ring-dark");
});
