// ** External Imports
import { expect, test, vi } from "vitest";

// ** Local Imports
import {
  closeAllLayers,
  closeLayer,
  closeTopLayer,
  createOpenLayerEntry,
  getLayerCount,
  hideLayer,
  isLayerMounted,
  removeLayer,
  syncLayerShow,
  trimLayersToMax,
  updateLayer,
  updateLayerMerged,
} from "@core/Layer/registry";
import type { LayerRegistryEntry } from "@core/Layer/types";

type TestEntry = LayerRegistryEntry & { label: string };

function createEntry(id: string, label: string, show = true): TestEntry {
  return { id, show, label };
}

test("createOpenLayerEntry should create a visible entry", () => {
  const entry = createOpenLayerEntry<TestEntry>("a", { label: "A" });

  expect(entry).toEqual({ id: "a", show: true, label: "A" });
});

test("closeLayer should invoke onClose before hiding", () => {
  const onClose = vi.fn();
  const entries: TestEntry[] = [{ id: "a", onClose, show: true, label: "A" }];

  const next = closeLayer(entries, "a");

  expect(onClose).toHaveBeenCalledOnce();
  expect(next[0]?.show).toBe(false);
});

test("closeTopLayer should close only the topmost visible entry", () => {
  const outerClose = vi.fn();
  const innerClose = vi.fn();

  const entries: TestEntry[] = [
    { show: true, id: "outer", label: "outer", onClose: outerClose },
    { show: true, id: "inner", label: "inner", onClose: innerClose },
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

test("syncLayerShow should toggle show without redundant updates", () => {
  const entries: TestEntry[] = [createEntry("a", "A", true)];

  expect(syncLayerShow(entries, "a", true)).toBe(entries);
  expect(syncLayerShow(entries, "a", false)[0]?.show).toBe(false);
  expect(syncLayerShow(entries, "a", true)[0]?.show).toBe(true);
});

test("closeAllLayers should dismiss every visible entry", () => {
  const firstClose = vi.fn();
  const secondClose = vi.fn();

  const entries: TestEntry[] = [
    { id: "a", show: true, label: "A", onClose: firstClose },
    { id: "b", show: true, label: "B", onClose: secondClose },
    { id: "c", label: "C", show: false },
  ];

  const next = closeAllLayers(entries);

  expect(firstClose).toHaveBeenCalledOnce();
  expect(secondClose).toHaveBeenCalledOnce();
  expect(next.every((entry) => !entry.show)).toBe(true);
});

test("trimLayersToMax should close oldest visible entries first", () => {
  const firstClose = vi.fn();
  const secondClose = vi.fn();

  const entries: TestEntry[] = [
    { id: "a", show: true, label: "A", onClose: firstClose },
    { id: "b", show: true, label: "B", onClose: secondClose },
    { id: "c", label: "C", show: false },
  ];

  const next = trimLayersToMax(entries, 2);

  expect(firstClose).toHaveBeenCalledOnce();
  expect(secondClose).not.toHaveBeenCalled();
  expect(next.find((entry) => entry.id === "a")?.show).toBe(false);
  expect(next.find((entry) => entry.id === "b")?.show).toBe(true);
});

test("updateLayerMerged should shallow-merge configured keys", () => {
  type NestedEntry = LayerRegistryEntry & {
    modal?: { size?: string; title?: string };
    props: { description?: string; title: string };
  };

  const entries: NestedEntry[] = [
    {
      id: "a",
      show: true,
      modal: { size: "md", title: "Modal" },
      props: { title: "Before", description: "Keep" },
    },
  ];

  const next = updateLayerMerged(
    entries,
    "a",
    {
      modal: { size: "lg" },
      props: { title: "After" },
    },
    ["props", "modal"],
  );

  expect(next[0]?.props).toEqual({
    title: "After",
    description: "Keep",
  });
  expect(next[0]?.modal).toEqual({
    size: "lg",
    title: "Modal",
  });
});
