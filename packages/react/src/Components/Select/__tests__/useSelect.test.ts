// ** External Imports
import { renderHook } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import { useSelect } from "@/Components/Select";
import type { SelectOption } from "@/Components/Select/select.types";

const options: SelectOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
];

function renderUseSelect(props: Parameters<typeof useSelect>[0] = { options }) {
  const triggerRef = createRef<HTMLInputElement>();

  const hook = renderHook(() => useSelect(props, triggerRef));

  return { ...hook, triggerRef };
}

test("it should merge default form field size and variant", () => {
  const { result } = renderUseSelect();

  expect(result.current.formField.merged.size).toBe("md");
  expect(result.current.formField.merged.variant).toBe("outline");
  expect(result.current.formField.merged.color).toBe("primary");
});

test("it should forward loading to FormField when loading is true", () => {
  const { result } = renderUseSelect({ options, loading: true });

  expect(result.current.isLoading).toBe(true);
  expect(result.current.formField.merged.loading).toBe(true);
  expect(result.current.formField.showLoading).toBe(true);
});

test("it should expose combobox semantics on trigger bind", () => {
  const { result } = renderUseSelect({ options, "aria-label": "Fruit" });

  expect(result.current.triggerBind.role).toBe("combobox");
  expect(result.current.triggerBind["aria-expanded"]).toBe(false);
  expect(result.current.triggerBind["aria-controls"]).toBeTruthy();
});

test("it should start closed", () => {
  const { result } = renderUseSelect();

  expect(result.current.open).toBe(false);
});

test("it should reflect selected value in display for single mode", () => {
  const { result } = renderUseSelect({ options, value: "apple" });

  expect(result.current.triggerBind.value).toBe("Apple");
});

test("it should enable clear bind when value is set", () => {
  const { result } = renderUseSelect({ options, value: "apple" });

  expect(result.current.hasValue).toBe(true);
  expect(result.current.clearable).toBe(true);
  expect(result.current.clearBind["data-select-clear"]).toBe(true);
});

test("it should resolve visible options from props", () => {
  const { result } = renderUseSelect({ options });

  expect(result.current.visibleOptions).toHaveLength(2);
  expect(result.current.visibleOptions[0]?.label).toBe("Apple");
});

test("it should apply invalidated listbox palette when field is invalid", () => {
  const { result } = renderUseSelect({ options, error: true });

  expect(result.current.formField.invalidated).toBe(true);
});
