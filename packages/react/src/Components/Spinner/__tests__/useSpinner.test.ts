// ** External Imports
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useSpinner,
  type SpinnerOwnProps,
  type SpinnerProps,
} from "@/Components/Spinner";
import { BridgeUIProvider } from "@/Provider";

const libDefaults = {
  size: "md",
  thickness: 3.6,
  color: "primary",
  enableTrack: false,
  disableShrink: false,
  variant: "indeterminate",
} as const satisfies Partial<SpinnerOwnProps>;

function renderUseSpinner(
  props: SpinnerProps = {},
  options: { registryVariant?: SpinnerOwnProps["variant"] } = {},
) {
  return renderHook(() => useSpinner(props, libDefaults), {
    wrapper: ({ children }) => {
      if (!("registryVariant" in options)) {
        return children;
      }

      return createElement(BridgeUIProvider, {
        children,
        components: {
          Spinner: {
            defaultProps: { variant: options.registryVariant },
          },
        },
      });
    },
  });
}

test("it should merge default variant as indeterminate", () => {
  const { result } = renderUseSpinner();

  expect(result.current.merged.variant).toBe("indeterminate");
});

test("it should override variant when prop is passed", () => {
  const { result } = renderUseSpinner({ value: 20, variant: "determinate" });

  expect(result.current.merged.variant).toBe("determinate");
});

test("it should compute rootBind with role progressbar", () => {
  const { result } = renderUseSpinner();

  expect(result.current.rootBind.role).toBe("progressbar");
});

test("it should set aria-valuenow on rootBind for determinate", () => {
  const { result } = renderUseSpinner({
    value: 55,
    variant: "determinate",
  });

  expect(result.current.rootBind["aria-valuenow"]).toBe(55);
});

test("it should expose trackBind only when enableTrack is true", () => {
  const withoutTrack = renderUseSpinner();
  const withTrack = renderUseSpinner({ enableTrack: true });

  expect(withTrack.result.current.enableTrack).toBe(true);
  expect(withoutTrack.result.current.trackBind).toBeNull();
  expect(withTrack.result.current.trackBind).not.toBeNull();
});

test("it should include rotate animation class on rootBind", () => {
  const { result } = renderUseSpinner();

  expect(result.current.rootBind.className).toContain(
    "animate-bridge-spinner-rotate",
  );
});

test("it should omit dash animation when disableShrink is true", () => {
  const { result } = renderUseSpinner({ disableShrink: true });

  expect(result.current.circleBind.className).not.toContain(
    "animate-bridge-spinner-dash",
  );
});

test("it should resolve variant from BridgeUIProvider defaultProps", () => {
  const { result } = renderUseSpinner({}, { registryVariant: "determinate" });

  expect(result.current.merged.variant).toBe("determinate");
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseSpinner({ className: "text-red-500" });

  expect(result.current.rootBind.className).toContain("text-red-500");
});

test("it should apply determinate stroke dash style", () => {
  const { result } = renderUseSpinner({
    value: 50,
    variant: "determinate",
  });

  expect(result.current.circleBind.style?.strokeDashoffset).toBeTypeOf(
    "number",
  );
});
