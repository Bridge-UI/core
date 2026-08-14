// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useToggle } from "@/Components/Toggle/hooks/useToggle";
import { ToggleGroup } from "@/Components/ToggleGroup";

afterEach(() => {
  cleanup();
});

test("it should mark the selected toggle", () => {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ToggleGroup defaultValue="a" aria-label="Options">
        {children}
      </ToggleGroup>
    );
  }

  const { result } = renderHook(
    () => useToggle({ value: "a", children: "A" }),
    {
      wrapper: Wrapper,
    },
  );

  expect(result.current.rootBind.role).toBe("radio");
  expect(result.current.rootBind["aria-checked"]).toBe(true);
});

test("it should throw when used outside ToggleGroup", () => {
  expect(() => {
    renderHook(() => useToggle({ value: "a" }));
  }).toThrow("Toggle must be used within a ToggleGroup provider");
});
