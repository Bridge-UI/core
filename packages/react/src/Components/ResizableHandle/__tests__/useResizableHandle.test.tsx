// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import { useResizableHandle } from "@/Components/ResizableHandle";

afterEach(() => {
  cleanup();
});

const libDefaults = {
  disabled: false,
  hideGrip: false,
} as const;

function wrapper({ children }: { children: ReactNode }) {
  return <Resizable>{children}</Resizable>;
}

test("it should bind a focusable separator", () => {
  const { result } = renderHook(() => useResizableHandle({}, libDefaults), {
    wrapper,
  });

  expect(result.current.showGrip).toBe(true);
  expect(result.current.disabled).toBe(false);
  expect(result.current.rootBind.tabIndex).toBe(0);
  expect(result.current.rootBind.role).toBe("separator");
  expect(result.current.rootBind["aria-orientation"]).toBe("vertical");
});

test("it should hide the grip with hideGrip", () => {
  const { result } = renderHook(
    () => useResizableHandle({ hideGrip: true }, libDefaults),
    { wrapper },
  );

  expect(result.current.showGrip).toBe(false);
});

test("it should leave the tab order when disabled", () => {
  const { result } = renderHook(
    () => useResizableHandle({ disabled: true }, libDefaults),
    { wrapper },
  );

  expect(result.current.disabled).toBe(true);
  expect(result.current.rootBind.tabIndex).toBe(-1);
  expect(result.current.rootBind["data-disabled"]).toBe("");
});
