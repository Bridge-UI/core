// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import {
  useColorField,
  type ColorFieldOwnProps,
} from "@/Components/ColorField";

function mountUseColorField(
  props: Partial<ColorFieldOwnProps> = {},
  slots: Record<string, unknown> = {},
) {
  let result!: ReturnType<typeof useColorField>;

  const model = ref<null | string | undefined>(null);
  const emit = vi.fn();

  const Wrapper = defineComponent({
    props: {} as Record<string, never>,
    setup() {
      result = useColorField(props, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper, { slots });

  return result;
}

test("it should start closed", () => {
  const { open } = mountUseColorField();

  expect(open.value).toBe(false);
});

test("it should expose null modelValue by default", () => {
  const { modelValue } = mountUseColorField();

  expect(modelValue.value).toBeNull();
});

test("it should default showSwatch to true", () => {
  const { showSwatch } = mountUseColorField();

  expect(showSwatch.value).toBe(true);
});

test("it should default endIcon to palette", () => {
  const { formField } = mountUseColorField();

  expect(formField.merged.value.endIcon).toBe("palette");
});

test("it should skip the default palette icon when end slot is set", () => {
  const { formField } = mountUseColorField({}, { end: "Custom" });

  expect(formField.merged.value.endIcon).toBeUndefined();
});

test("it should leave picker chrome intact in a menu overlay", () => {
  const { pickerClass } = mountUseColorField({ overlay: "menu" });

  expect(pickerClass.value).toBeUndefined();
});
