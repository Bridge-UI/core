// ** Local Imports
import type { LayerId, LayerRegistryEntry } from "@core/Layer/types";

/**
 * Looks up a registry entry by id (read-only).
 */
export function findLayerEntry<T extends LayerRegistryEntry>(
  entries: readonly T[],
  id: LayerId,
): T | undefined {
  return entries.find((entry) => entry.id === id);
}

/**
 * Invokes `onClose` when the user dismisses a mounted layer.
 */
export function invokeLayerDismiss<T extends LayerRegistryEntry>(
  entries: readonly T[],
  id: LayerId,
): void {
  const entry = findLayerEntry(entries, id);

  if (!entry?.show) {
    return;
  }

  entry.onClose?.();
}

/**
 * Removes the entry and invokes `onClosed` after the leave animation completes.
 */
export function completeLayerHide<T extends LayerRegistryEntry>(
  entries: readonly T[],
  id: LayerId,
  show: boolean,
  removeEntry: (id: LayerId) => void,
): void {
  if (show) {
    return;
  }

  const entry = findLayerEntry(entries, id);

  removeEntry(id);
  entry?.onClosed?.();
}
