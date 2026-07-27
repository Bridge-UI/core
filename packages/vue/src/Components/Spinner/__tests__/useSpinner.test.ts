// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useSpinner, type SpinnerOwnProps } from "@/Components/Spinner";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

const libDefaults = {
  size: "md",
  thickness: 3.6,
  color: "primary",
  enableTrack: false,
  disableShrink: false,
  variant: "indeterminate",
} as const satisfies Partial<SpinnerOwnProps>;

function mountUseSpinner(
  props: Partial<SpinnerOwnProps> = {},
  options: { registryVariant?: SpinnerOwnProps["variant"] } = {},
) {
  let result!: ReturnType<typeof useSpinner>;

  const Consumer = defineComponent({
    setup() {
      result = useSpinner(props, libDefaults);

      return () => h("div");
    },
  });

  if (!("registryVariant" in options)) {
    mount(Consumer);

    return result;
  }

  mount(BridgeUIProvider, {
    slots: {
      default: () => h(Consumer),
    },
    props: {
      components: {
        Spinner: {
          defaultProps: { variant: options.registryVariant },
        },
      },
    },
  });

  return result;
}

test("it should merge default variant as indeterminate", () => {
  const { merged } = mountUseSpinner();

  expect(merged.value.variant).toBe("indeterminate");
});

test("it should override variant when prop is passed", () => {
  const { merged } = mountUseSpinner({ value: 20, variant: "determinate" });

  expect(merged.value.variant).toBe("determinate");
});

test("it should compute rootBind with role progressbar", () => {
  const { rootBind } = mountUseSpinner();

  expect(rootBind.value.role).toBe("progressbar");
});

test("it should set aria-valuenow on rootBind for determinate", () => {
  const { rootBind } = mountUseSpinner({
    value: 55,
    variant: "determinate",
  });

  expect(rootBind.value["aria-valuenow"]).toBe(55);
});

test("it should expose trackBind only when enableTrack is true", () => {
  const withoutTrack = mountUseSpinner();
  const withTrack = mountUseSpinner({ enableTrack: true });

  expect(withoutTrack.trackBind.value).toBeNull();
  expect(withTrack.trackBind.value).not.toBeNull();
  expect(withTrack.enableTrack.value).toBe(true);
});

test("it should include rotate animation class on svgBind", () => {
  const { svgBind } = mountUseSpinner();

  expect(svgBind.value.class).toContain("animate-bridge-spinner-rotate");
});

test("it should omit dash animation when disableShrink is true", () => {
  const { circleBind } = mountUseSpinner({ disableShrink: true });

  expect(circleBind.value.class).not.toContain("animate-bridge-spinner-dash");
});

test("it should resolve variant from BridgeUIProvider defaultProps", () => {
  const { merged } = mountUseSpinner({}, { registryVariant: "determinate" });

  expect(merged.value.variant).toBe("determinate");
});

test("it should merge class into rootBind", () => {
  const { rootBind } = mountUseSpinner({ class: "text-red-500" });

  expect(rootBind.value.class).toContain("text-red-500");
});

test("it should apply determinate stroke dash style", () => {
  const { circleBind } = mountUseSpinner({
    value: 50,
    variant: "determinate",
  });

  expect(circleBind.value.style?.strokeDashoffset).toBeTypeOf("number");
});
