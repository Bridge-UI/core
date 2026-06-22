// ** External Imports
import { expect, test, vi } from "vitest";

// ** Local Imports
import {
  completeLayerHide,
  findLayerEntry,
  invokeLayerDismiss,
} from "@/Layer/host";
import type { LayerRegistryEntry } from "@/Layer/types";

type TestEntry = LayerRegistryEntry & { label: string };

test("it should return the matching entry", () => {
  const entries: TestEntry[] = [
    { id: "a", show: true, label: "A" },
    { id: "b", show: true, label: "B" },
  ];

  expect(findLayerEntry(entries, "b")?.label).toBe("B");
});

test("it should call onClose only when visible", () => {
  const onClose = vi.fn();
  const entries: TestEntry[] = [{ id: "a", onClose, label: "A", show: false }];

  invokeLayerDismiss(entries, "a");

  expect(onClose).not.toHaveBeenCalled();
});

test("it should remove the entry and call onClosed", () => {
  const onClosed = vi.fn();
  const removeEntry = vi.fn();
  const entries: TestEntry[] = [{ id: "a", onClosed, label: "A", show: false }];

  completeLayerHide(entries, "a", false, removeEntry);

  expect(removeEntry).toHaveBeenCalledWith("a");
  expect(onClosed).toHaveBeenCalledOnce();
});

test("it should noop when show is true", () => {
  const removeEntry = vi.fn();

  completeLayerHide([], "a", true, removeEntry);

  expect(removeEntry).not.toHaveBeenCalled();
});
