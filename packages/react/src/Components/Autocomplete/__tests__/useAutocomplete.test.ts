// ** External Imports
import { renderHook } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import { useAutocomplete } from "@/Components/Autocomplete";
import type { SelectOption } from "@/Components/Autocomplete/autocomplete.types";

const options: SelectOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
];

function renderUseAutocomplete(
  props: Parameters<typeof useAutocomplete>[0] = { options },
) {
  const triggerRef = createRef<HTMLInputElement>();

  const hook = renderHook(() => useAutocomplete(props, triggerRef));

  return { ...hook, triggerRef };
}

test("it should merge default form field size and variant", () => {
  const { result } = renderUseAutocomplete();

  expect(result.current.formField.merged.size).toBe("md");
  expect(result.current.formField.merged.color).toBe("primary");
  expect(result.current.formField.merged.variant).toBe("outline");
});

test("it should expose combobox semantics on trigger bind", () => {
  const { result } = renderUseAutocomplete({ options, "aria-label": "Fruit" });

  expect(result.current.triggerBind.role).toBe("combobox");
  expect(result.current.triggerBind["aria-expanded"]).toBe(false);
  expect(result.current.triggerBind["aria-controls"]).toBeTruthy();
});

test("it should start closed", () => {
  const { result } = renderUseAutocomplete();

  expect(result.current.open).toBe(false);
});

test("it should reflect selected value in display for single mode", () => {
  const { result } = renderUseAutocomplete({ options, value: "apple" });

  expect(result.current.triggerBind.value).toBe("Apple");
});

test("it should enable clear bind when value is set", () => {
  const { result } = renderUseAutocomplete({ options, value: "apple" });

  expect(result.current.hasValue).toBe(true);
  expect(result.current.clearable).toBe(true);
  expect(result.current.clearBind["data-autocomplete-clear"]).toBe(true);
});

test("it should resolve visible options from props", () => {
  const { result } = renderUseAutocomplete({ options });

  expect(result.current.visibleOptions).toHaveLength(2);
  expect(result.current.visibleOptions[0]?.label).toBe("Apple");
});

test("it should apply invalidated listbox palette when field is invalid", () => {
  const { result } = renderUseAutocomplete({ options, error: true });

  expect(result.current.formField.invalidated).toBe(true);
});
