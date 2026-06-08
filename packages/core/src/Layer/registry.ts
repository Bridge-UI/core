// ** External Imports
import { remove } from "es-toolkit/array";
import {
  findLast,
  isEmpty,
  isFunction,
  isNil,
  isPlainObject,
} from "es-toolkit/compat";

// ** Local Imports
import type {
  LayerId,
  LayerPatch,
  LayerRegistryEntry,
  LayerUpdatePatch,
} from "@core/Layer/types";

let fallbackIdCounter = 0;

/**
 * Invokes `onClose` and hides every visible entry.
 */
export function closeAllLayers<T extends LayerRegistryEntry>(
  entries: T[],
): T[] {
  let next = entries;

  for (const entry of entries) {
    if (entry.show) {
      next = closeLayer(next, entry.id);
    }
  }

  return next;
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
 * Creates a layer id via `crypto.randomUUID()` when available.
 * When `assigned` is provided (e.g. BridgeModalHost), that value is used as-is.
 */
export function createLayerId(assigned?: LayerId): LayerId {
  if (!isNil(assigned) && !isEmpty(assigned)) {
    return assigned;
  }

  if (isFunction(globalThis.crypto?.randomUUID)) {
    return globalThis.crypto.randomUUID();
  }

  fallbackIdCounter += 1;

  return `layer-${fallbackIdCounter}`;
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
 * Number of mounted layers (visible or animating out).
 */
export function getLayerCount<T extends LayerRegistryEntry>(
  entries: T[],
): number {
  return entries.length;
}

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
 * Whether the entry is still mounted (including during leave animation).
 */
export function isLayerMounted<T extends LayerRegistryEntry>(
  entries: T[],
  id: LayerId,
): boolean {
  return entries.some((entry) => entry.id === id);
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
 * Resets the fallback id counter. For tests only.
 */
export function resetLayerIdCounterForTests() {
  fallbackIdCounter = 0;
}

/**
 * Syncs a layer's `show` flag from the shell (e.g. `v-model` / `onShowChange`).
 */
export function syncLayerShow<T extends LayerRegistryEntry>(
  entries: T[],
  id: LayerId,
  show: boolean,
): T[] {
  const entry = entries.find((item) => item.id === id);

  if (!entry || entry.show === show) {
    return entries;
  }

  return show
    ? updateLayer(entries, id, { show: true } as LayerPatch<T>)
    : hideLayer(entries, id);
}

/**
 * Closes the oldest visible entries until fewer than `max` remain visible.
 */
export function trimLayersToMax<T extends LayerRegistryEntry>(
  entries: T[],
  max: number,
): T[] {
  let next = entries;
  let visible = next.filter((entry) => entry.show);

  while (visible.length >= max) {
    next = closeLayer(next, visible[0]!.id);
    visible = next.filter((entry) => entry.show);
  }

  return next;
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

/**
 * Patches an entry, shallow-merging the given keys with their current values.
 */
export function updateLayerMerged<T extends LayerRegistryEntry>(
  entries: T[],
  id: LayerId,
  patch: LayerUpdatePatch<T>,
  mergeKeys: (keyof LayerPatch<T>)[] = [],
): T[] {
  const entry = entries.find((item) => item.id === id);

  if (!entry) {
    return entries;
  }

  if (mergeKeys.length === 0) {
    return updateLayer(entries, id, patch as LayerPatch<T>);
  }

  const merged = { ...patch } as LayerPatch<T>;

  for (const key of mergeKeys) {
    const patchValue = patch[key];
    const currentValue = entry[key as keyof T];

    if (
      !isNil(patchValue) &&
      !isNil(currentValue) &&
      isPlainObject(patchValue) &&
      isPlainObject(currentValue)
    ) {
      merged[key] = {
        ...currentValue,
        ...patchValue,
      } as LayerPatch<T>[typeof key];
    }
  }

  return updateLayer(entries, id, merged);
}
