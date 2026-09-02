// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useAccordion } from "@/Components/Accordion/hooks/useAccordion";

afterEach(() => {
  cleanup();
});

test("it should expose context defaults from useAccordion", () => {
  const { result } = renderHook(() =>
    useAccordion(
      { defaultValue: "a" },
      {
        size: "md",
        color: "dark",
        multiple: false,
        disabled: false,
        variant: "default",
      },
    ),
  );

  expect(result.current.contextValue.expanded).toBe("a");
  expect(result.current.contextValue.multiple).toBe(false);
  expect(result.current.contextValue.disabled).toBe(false);
});

test("it should normalize multiple defaultValue to an array", () => {
  const { result } = renderHook(() =>
    useAccordion(
      { multiple: true, defaultValue: ["a", "b"] },
      {
        size: "md",
        color: "dark",
        multiple: false,
        disabled: false,
        variant: "default",
      },
    ),
  );

  expect(result.current.contextValue.expanded).toEqual(["a", "b"]);
  expect(result.current.contextValue.multiple).toBe(true);
});
