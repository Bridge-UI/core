// ** External Imports
import { expect, test, vi } from "vitest";

// ** Local Imports
import {
  closeLayer,
  closeTopLayer,
  getLayerCount,
  hideLayer,
  isLayerMounted,
  removeLayer,
  updateLayer,
  type LayerRegistryEntry,
} from "@core/Utils/layerRegistry";

type TestEntry = LayerRegistryEntry & { label: string };

function createEntry(id: string, label: string, show = true): TestEntry {
  return { id, show, label };
}

test("closeLayer should invoke onClose before hiding", () => {
  const onClose = vi.fn();
  const entries: TestEntry[] = [{ id: "a", show: true, label: "A", onClose }];

  const next = closeLayer(entries, "a");

  expect(onClose).toHaveBeenCalledOnce();
  expect(next[0]?.show).toBe(false);
});

test("closeTopLayer should close only the topmost visible entry", () => {
  const outerClose = vi.fn();
  const innerClose = vi.fn();

  const entries: TestEntry[] = [
    { id: "outer", show: true, label: "outer", onClose: outerClose },
    { id: "inner", show: true, label: "inner", onClose: innerClose },
  ];

  const next = closeTopLayer(entries);

  expect(innerClose).toHaveBeenCalledOnce();
  expect(outerClose).not.toHaveBeenCalled();
  expect(next.find((entry) => entry.id === "inner")?.show).toBe(false);
  expect(next.find((entry) => entry.id === "outer")?.show).toBe(true);
});

test("isLayerMounted should stay true while animating out", () => {
  const entries: TestEntry[] = [createEntry("a", "A", false)];

  expect(isLayerMounted(entries, "a")).toBe(true);
  expect(getLayerCount(entries)).toBe(1);
});

test("updateLayer should patch an existing entry", () => {
  const entries: TestEntry[] = [createEntry("a", "before")];

  const next = updateLayer(entries, "a", {
    label: "after",
  });

  expect(next[0]?.label).toBe("after");
});

test("hideLayer should be idempotent", () => {
  const entries: TestEntry[] = [createEntry("a", "A", false)];

  expect(hideLayer(entries, "a")).toBe(entries);
});

test("removeLayer should drop the entry", () => {
  const entries: TestEntry[] = [createEntry("a", "A")];

  expect(removeLayer(entries, "a")).toEqual([]);
});
