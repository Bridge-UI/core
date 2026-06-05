// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useSwitcher, type SwitcherOwnProps } from "@/Components/Switcher";

const libDefaults = {
  size: "md",
  error: false,
  withoutErrorMessage: false,
} satisfies Partial<SwitcherOwnProps>;

function mountUseSwitcher(
  props: Omit<SwitcherOwnProps, "field"> = {},
  attrs: Record<string, unknown> = {},
) {
  let result!: ReturnType<typeof useSwitcher>;

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useSwitcher(() => ({ ...attrs, ...props }), libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper, { attrs });

  return result;
}

test("it should merge default size and error flags", () => {
  const { merged } = mountUseSwitcher();

  expect(merged.value.size).toBe("md");
  expect(merged.value.error).toBe(false);
  expect(merged.value.withoutErrorMessage).toBe(false);
});

test("it should override size when prop is passed", () => {
  const { merged } = mountUseSwitcher({ size: "lg" });

  expect(merged.value.size).toBe("lg");
});

test("it should mark field as invalidated when error is true", () => {
  const { invalidated } = mountUseSwitcher({ error: true });

  expect(invalidated.value).toBe(true);
});

test("it should expose control id from controlId prop", () => {
  const { controlId } = mountUseSwitcher({}, { controlId: "custom-id" });

  expect(controlId.value).toBe("custom-id");
});

test("it should fallback controlId to inherited id when controlId is not provided", () => {
  const { controlId } = mountUseSwitcher({}, { id: "inherited-id" });

  expect(controlId.value).toBe("inherited-id");
});

test("it should forward disabled and readonly on controlBind", () => {
  const { controlBind } = mountUseSwitcher({ disabled: true, readonly: true });

  expect(controlBind.value.disabled).toBe(true);
  expect(controlBind.value.readonly).toBe(true);
});

test("it should set aria-invalid on controlBind when error is set", () => {
  const { controlBind } = mountUseSwitcher({ error: true });

  expect(controlBind.value["aria-invalid"]).toBe(true);
});

test("it should set aria-describedby on controlBind when description is provided", () => {
  const { controlBind } = mountUseSwitcher(
    { description: "Helper" },
    { controlId: "switcher-id" },
  );

  expect(controlBind.value["aria-describedby"]).toBe("switcher-id-description");
});

test("it should set label for attribute to control id", () => {
  const { controlId, mainLabelBind } = mountUseSwitcher(
    { mainLabel: "Label" },
    { controlId: "switcher-id" },
  );

  expect(mainLabelBind.value.for).toBe(controlId.value);
});

test("it should reserve error message space by default", () => {
  const { reservesErrorMessageSpace } = mountUseSwitcher();

  expect(reservesErrorMessageSpace.value).toBe(true);
});

test("it should not reserve error message space when withoutErrorMessage is true", () => {
  const { reservesErrorMessageSpace } = mountUseSwitcher({
    withoutErrorMessage: true,
  });

  expect(reservesErrorMessageSpace.value).toBe(false);
});
