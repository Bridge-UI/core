// ** External Imports
import { remove } from "es-toolkit/array";
import { findLast } from "es-toolkit/compat";

export type LayerId = string;

/**
 * Base shape for imperative layers hosted by Bridge UI (Modal, Dialog, Snackbar, …).
 */
export type LayerRegistryEntry = {
  id: LayerId;
  show: boolean;
  onClose?: () => void;
  onClosed?: () => void;
};

/**
 * Hides an entry (starts leave animation). Does not invoke `onClose`.
 */
export function hideLayer<T extends LayerRegistryEntry>(
  entries: T[],
  id: LayerId,
): T[] {
  const index = entries.findIndex((entry) => entry.id === id);

  if (index === -1 || !entries[index]?.show) {
    return entries;
  }

  const next = [...entries];

  next[index] = { ...next[index], show: false };

  return next;
}

/**
 * Creates a newly opened registry entry (`show: true`).
 */
export function createOpenLayerEntry<T extends LayerRegistryEntry>(
  id: LayerId,
  fields: Omit<T, "id" | "show">,
): T {
  return { id, show: true, ...fields } as T;
}

/**
 * Invokes `onClose` and hides the entry (imperative dismiss).
 *
 * `onClose` runs on the entry from the input array before returning the next
 * immutable snapshot. Synchronous callbacks that close other layers are supported,
 * but the caller must apply the returned array for state to update.
 */
export function closeLayer<T extends LayerRegistryEntry>(
  entries: T[],
  id: LayerId,
): T[] {
  const entry = entries.find((item) => item.id === id);

  if (!entry?.show) {
    return entries;
  }

  entry.onClose?.();

  return hideLayer(entries, id);
}

/**
 * Invokes `onClose` on the topmost visible entry and hides it.
 */
export function closeTopLayer<T extends LayerRegistryEntry>(entries: T[]): T[] {
  const top = findLast(entries, (entry) => entry.show);

  if (!top) {
    return entries;
  }

  return closeLayer(entries, top.id);
}

/**
 * Removes an entry after its leave animation completes.
 */
export function removeLayer<T extends LayerRegistryEntry>(
  entries: T[],
  id: LayerId,
): T[] {
  const next = [...entries];

  remove(next, (entry) => entry.id === id);

  return next;
}

/**
 * Whether the entry is still mounted (including during leave animation).
 */
export function isLayerMounted<T extends LayerRegistryEntry>(
  entries: T[],
  id: LayerId,
): boolean {
  return entries.some((entry) => entry.id === id);
}

/**
 * Number of mounted layers (visible or animating out).
 */
export function getLayerCount<T extends LayerRegistryEntry>(
  entries: T[],
): number {
  return entries.length;
}

/**
 * Patches an open entry (props, shell options, etc.).
 */
export function updateLayer<T extends LayerRegistryEntry>(
  entries: T[],
  id: LayerId,
  patch: Partial<Omit<T, "id">>,
): T[] {
  const index = entries.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return entries;
  }

  const next = [...entries];

  next[index] = { ...next[index], ...patch };

  return next;
}
