// ** External Imports
import { shallowRef } from "vue";

// ** Core Imports
import {
  closeLayer,
  closeTopLayer,
  createLayerId,
  createOpenLayerEntry,
  hideLayer,
  isLayerMounted,
  removeLayer,
  updateLayer,
  type LayerId,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  BridgeSnackbarController,
  BridgeSnackbarEntry,
  BridgeSnackbarOpenOptions,
  BridgeSnackbarUpdateOptions,
} from "@/Actions/Snackbar/bridgeSnackbar.types";

function toEntry(
  id: LayerId,
  options: BridgeSnackbarOpenOptions,
): BridgeSnackbarEntry {
  const { onClose, onClosed, ...props } = options;

  return createOpenLayerEntry<BridgeSnackbarEntry>(id, {
    props,
    onClose,
    onClosed,
  });
}

export type BridgeSnackbarApiOptions = {
  /**
   * Maximum number of visible snackbars. When exceeded, the oldest closes before opening the new one.
   */
  max?: number;
  /**
   * Default auto-dismiss delay (ms) for `open()`. `false` keeps snackbars open until dismissed.
   *
   * @default 5000
   */
  timeout?: number | false;
};

function resolveOpenOptions(
  openOptions: BridgeSnackbarOpenOptions,
  timeout: number | false | undefined,
): BridgeSnackbarOpenOptions {
  if (openOptions.duration !== undefined) {
    return openOptions;
  }

  if (timeout === undefined) {
    return openOptions;
  }

  return { ...openOptions, duration: timeout };
}

function trimToMax<T extends { id: LayerId; show: boolean }>(
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

export function createBridgeSnackbarApi(
  options: BridgeSnackbarApiOptions = {},
): BridgeSnackbarController {
  const { max, timeout = 5000 } = options;

  const entries = shallowRef<BridgeSnackbarEntry[]>([]);

  function open(openOptions: BridgeSnackbarOpenOptions): LayerId {
    const id = createLayerId();

    let next = entries.value;

    if (max != null && max > 0) {
      next = trimToMax(next, max);
    }

    entries.value = [
      ...next,
      toEntry(id, resolveOpenOptions(openOptions, timeout)),
    ];

    return id;
  }

  function close(id: LayerId) {
    entries.value = closeLayer(entries.value, id);
  }

  function closeTop() {
    entries.value = closeTopLayer(entries.value);
  }

  function closeAll() {
    let next = entries.value;

    for (const entry of entries.value) {
      if (entry.show) {
        next = closeLayer(next, entry.id);
      }
    }

    entries.value = next;
  }

  function isOpen(id: LayerId) {
    return isLayerMounted(entries.value, id);
  }

  function removeEntry(id: LayerId) {
    entries.value = removeLayer(entries.value, id);
  }

  function update(id: LayerId, options: BridgeSnackbarUpdateOptions) {
    const entry = entries.value.find((item) => item.id === id);

    if (!entry || !options.props) {
      entries.value = updateLayer(entries.value, id, options);

      return;
    }

    entries.value = updateLayer(entries.value, id, {
      props: { ...entry.props, ...options.props },
    });
  }

  function syncShow(id: LayerId, show: boolean) {
    const entry = entries.value.find((item) => item.id === id);

    if (!entry || entry.show === show) {
      return;
    }

    entries.value = show
      ? updateLayer(entries.value, id, { show: true })
      : hideLayer(entries.value, id);
  }

  return {
    open,
    close,
    isOpen,
    update,
    entries,
    closeTop,
    closeAll,
    syncShow,
    removeEntry,
  };
}
