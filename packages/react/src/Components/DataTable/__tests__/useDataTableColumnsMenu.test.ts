// ** External Imports
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import type { DataTableVisibilityItem } from "@/Components/DataTable/hooks/useDataTable";
import { useDataTableColumnsMenu } from "@/Components/DataTable/hooks/useDataTableColumnsMenu";

const items: DataTableVisibilityItem[] = [
  { id: "name", label: "Name", hidden: false, hideable: true },
  { id: "role", label: "Role", hidden: false, hideable: true },
  { id: "id", label: "Id", hidden: true, hideable: false },
];

afterEach(() => {
  cleanup();
});

test("it should hide the footer for a menu overlay", () => {
  const { result } = renderHook(() => {
    return useDataTableColumnsMenu({
      items,
      overlay: "menu",
      onChange: vi.fn(),
    });
  });

  expect(result.current.showFooter).toBe(false);
});

test("it should show the footer for a modal overlay", () => {
  const { result } = renderHook(() => {
    return useDataTableColumnsMenu({
      items,
      overlay: "modal",
      onChange: vi.fn(),
    });
  });

  expect(result.current.showFooter).toBe(true);
});

test("it should commit live when the footer is hidden", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => {
    return useDataTableColumnsMenu({
      items,
      onChange,
      overlay: "menu",
    });
  });

  act(() => {
    result.current.onToggleItem(items[1]!);
  });

  expect(onChange).toHaveBeenCalledWith(["id", "role"]);
});

test("it should keep toggles in draft until apply when the footer is shown", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => {
    return useDataTableColumnsMenu({
      items,
      onChange,
      overlay: "modal",
    });
  });

  act(() => {
    result.current.onShowChange(true);
    result.current.onToggleItem(items[1]!);
  });

  expect(onChange).not.toHaveBeenCalled();
  expect(result.current.isHidden(items[1]!)).toBe(true);

  act(() => {
    result.current.onApply();
  });

  expect(onChange).toHaveBeenCalledWith(["id", "role"]);
  expect(result.current.show).toBe(false);
});

test("it should reset hideable columns in the draft", () => {
  const onChange = vi.fn();
  const hiddenItems: DataTableVisibilityItem[] = [
    { id: "name", hidden: true, label: "Name", hideable: true },
    { id: "role", label: "Role", hidden: false, hideable: true },
    { id: "id", label: "Id", hidden: true, hideable: false },
  ];
  const { result } = renderHook(() => {
    return useDataTableColumnsMenu({
      onChange,
      overlay: "modal",
      items: hiddenItems,
    });
  });

  act(() => {
    result.current.onShowChange(true);
    result.current.onReset();
    result.current.onApply();
  });

  expect(onChange).toHaveBeenCalledWith(["id"]);
});
