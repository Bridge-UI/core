// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { ToggleGroup } from "@/Components/ToggleGroup";
import { useToggleItem } from "@/Components/ToggleItem/hooks/useToggleItem";

afterEach(() => {
  cleanup();
});

test("it should mark the selected toggle item", () => {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ToggleGroup defaultValue="a" aria-label="Options">
        {children}
      </ToggleGroup>
    );
  }

  const { result } = renderHook(
    () => useToggleItem({ value: "a", children: "A" }),
    {
      wrapper: Wrapper,
    },
  );

  expect(result.current.rootBind.role).toBe("radio");
  expect(result.current.rootBind["aria-checked"]).toBe(true);
});

test("it should throw when used outside ToggleGroup", () => {
  expect(() => {
    renderHook(() => useToggleItem({ value: "a" }));
  }).toThrow("ToggleItem must be used within a ToggleGroup provider");
});
