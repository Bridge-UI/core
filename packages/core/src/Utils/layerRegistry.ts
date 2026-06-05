// ** External Imports
import { remove } from "es-toolkit/array";
import { findLast } from "es-toolkit/compat";

/**
 * Base shape for imperative layers hosted by Bridge UI (Modal, Dialog, Snackbar, …).
 */
export type LayerRegistryEntry = {
  id: string;
  show: boolean;
  onClose?: () => void;
  onClosed?: () => void;
};

/**
 * Hides an entry (starts leave animation). Does not invoke `onClose`.
 */
export function hideLayer<T extends LayerRegistryEntry>(
  entries: T[],
  id: string,
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
 * Invokes `onClose` and hides the entry (imperative dismiss).
 */
export function closeLayer<T extends LayerRegistryEntry>(
  entries: T[],
  id: string,
): T[] {
  const index = entries.findIndex((entry) => entry.id === id);

  if (index === -1 || !entries[index]?.show) {
    return entries;
  }

  entries[index].onClose?.();

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
  id: string,
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
  id: string,
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
  id: string,
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
