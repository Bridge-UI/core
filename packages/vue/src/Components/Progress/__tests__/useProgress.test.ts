// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useProgress, type ProgressOwnProps } from "@/Components/Progress";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

const libDefaults = {
  size: "md",
  rounded: "full",
  color: "primary",
  variant: "indeterminate",
} as const satisfies Partial<ProgressOwnProps>;

function mountUseProgress(
  props: Partial<ProgressOwnProps> = {},
  options: { registryVariant?: ProgressOwnProps["variant"] } = {},
) {
  let result!: ReturnType<typeof useProgress>;

  const Consumer = defineComponent({
    setup() {
      result = useProgress(props, libDefaults);

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
        Progress: {
          defaultProps: { variant: options.registryVariant },
        },
      },
    },
  });

  return result;
}

test("it should merge default variant as indeterminate", () => {
  const { merged } = mountUseProgress();

  expect(merged.value.variant).toBe("indeterminate");
});

test("it should override variant when prop is passed", () => {
  const { merged } = mountUseProgress({ value: 20, variant: "determinate" });

  expect(merged.value.variant).toBe("determinate");
});

test("it should compute rootBind with role progressbar", () => {
  const { rootBind } = mountUseProgress();

  expect(rootBind.value.role).toBe("progressbar");
});

test("it should set aria-valuenow on rootBind for determinate", () => {
  const { rootBind } = mountUseProgress({
    value: 55,
    variant: "determinate",
  });

  expect(rootBind.value["aria-valuenow"]).toBe(55);
});

test("it should expose bufferBind only for buffer variant", () => {
  const indeterminate = mountUseProgress();
  const buffer = mountUseProgress({
    value: 20,
    valueBuffer: 40,
    variant: "buffer",
  });

  expect(indeterminate.bufferBind.value).toBeNull();
  expect(buffer.bufferBind.value).not.toBeNull();
  expect(buffer.isBuffer.value).toBe(true);
});

test("it should apply bar width style for determinate", () => {
  const { barBind } = mountUseProgress({
    value: 80,
    variant: "determinate",
  });

  expect(barBind.value.style).toEqual({ width: "80%" });
});

test("it should include indeterminate animation class on barBind", () => {
  const { barBind } = mountUseProgress();

  expect(barBind.value.class).toContain(
    "animate-bridge-progress-indeterminate",
  );
});

test("it should include query animation class on barBind", () => {
  const { barBind } = mountUseProgress({ variant: "query" });

  expect(barBind.value.class).toContain("animate-bridge-progress-query");
});

test("it should resolve variant from BridgeUIProvider defaultProps", () => {
  const { merged } = mountUseProgress({}, { registryVariant: "determinate" });

  expect(merged.value.variant).toBe("determinate");
});

test("it should merge class into rootBind", () => {
  const { rootBind } = mountUseProgress({ class: "w-1/2" });

  expect(rootBind.value.class).toContain("w-1/2");
});
