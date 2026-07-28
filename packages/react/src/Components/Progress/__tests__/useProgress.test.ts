// ** External Imports
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useProgress,
  type ProgressOwnProps,
  type ProgressProps,
} from "@/Components/Progress";
import { BridgeUIProvider } from "@/Provider";

const libDefaults = {
  size: "md",
  rounded: "full",
  color: "primary",
  variant: "indeterminate",
} as const satisfies Partial<ProgressOwnProps>;

function renderUseProgress(
  props: ProgressProps = {},
  options: { registryVariant?: ProgressOwnProps["variant"] } = {},
) {
  return renderHook(() => useProgress(props, libDefaults), {
    wrapper: ({ children }) => {
      if (!("registryVariant" in options)) {
        return children;
      }

      return createElement(BridgeUIProvider, {
        children,
        components: {
          Progress: {
            defaultProps: { variant: options.registryVariant },
          },
        },
      });
    },
  });
}

test("it should merge default variant as indeterminate", () => {
  const { result } = renderUseProgress();

  expect(result.current.merged.variant).toBe("indeterminate");
});

test("it should override variant when prop is passed", () => {
  const { result } = renderUseProgress({ value: 20, variant: "determinate" });

  expect(result.current.merged.variant).toBe("determinate");
});

test("it should compute rootBind with role progressbar", () => {
  const { result } = renderUseProgress();

  expect(result.current.rootBind.role).toBe("progressbar");
});

test("it should set aria-valuenow on rootBind for determinate", () => {
  const { result } = renderUseProgress({
    value: 55,
    variant: "determinate",
  });

  expect(result.current.rootBind["aria-valuenow"]).toBe(55);
});

test("it should expose bufferBind only for buffer variant", () => {
  const indeterminate = renderUseProgress();
  const buffer = renderUseProgress({
    value: 20,
    valueBuffer: 40,
    variant: "buffer",
  });

  expect(indeterminate.result.current.bufferBind).toBeNull();
  expect(buffer.result.current.bufferBind).not.toBeNull();
  expect(buffer.result.current.isBuffer).toBe(true);
});

test("it should apply bar width style for determinate", () => {
  const { result } = renderUseProgress({
    value: 80,
    variant: "determinate",
  });

  expect(result.current.barBind.style).toEqual({ width: "80%" });
});

test("it should include indeterminate animation class on barBind", () => {
  const { result } = renderUseProgress();

  expect(result.current.barBind.className).toContain(
    "animate-bridge-progress-indeterminate",
  );
});

test("it should include query animation class on barBind", () => {
  const { result } = renderUseProgress({ variant: "query" });

  expect(result.current.barBind.className).toContain(
    "animate-bridge-progress-query",
  );
});

test("it should resolve variant from BridgeUIProvider defaultProps", () => {
  const { result } = renderUseProgress({}, { registryVariant: "determinate" });

  expect(result.current.merged.variant).toBe("determinate");
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseProgress({ className: "w-1/2" });

  expect(result.current.rootBind.className).toContain("w-1/2");
});
