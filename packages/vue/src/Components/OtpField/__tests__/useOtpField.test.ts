// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { defineComponent, ref } from "vue";

// ** Local Imports
import { useOtpField } from "@/Components/OtpField";

function mountUseOtpField(
  props: Parameters<typeof useOtpField>[0] = {},
  modelValue: null | string | undefined = undefined,
) {
  const model = ref(modelValue);
  let api: undefined | ReturnType<typeof useOtpField>;

  const Comp = defineComponent({
    setup() {
      api = useOtpField(props, model, {
        onChange: vi.fn(),
        onComplete: vi.fn(),
      });
      return () => null;
    },
  });

  mount(Comp);

  return { model, api: api! };
}

test("it should merge default size color and variant", () => {
  const { api } = mountUseOtpField();

  expect(api.merged.value.size).toBe("md");
  expect(api.merged.value.color).toBe("primary");
  expect(api.merged.value.variant).toBe("outline");
  expect(api.length.value).toBe(6);
});

test("it should expose digit slots from model value", () => {
  const { api } = mountUseOtpField({ length: 4 }, "12");

  expect(api.digits.value).toEqual(["1", "2", "", ""]);
});

test("it should mark the field as invalidated when error is set", () => {
  const { api } = mountUseOtpField({ error: true });

  expect(api.invalidated.value).toBe(true);
});

test("it should resolve numeric input mode by default", () => {
  const { api } = mountUseOtpField();

  expect(api.inputType.value).toBe("numeric");
  expect(api.inputBind(0).inputmode).toBe("numeric");
});
