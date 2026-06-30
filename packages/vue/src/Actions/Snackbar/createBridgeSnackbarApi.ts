// ** External Imports
import { isNil } from "es-toolkit/compat";
import { shallowRef } from "vue";

// ** Core Imports
import {
  closeAllLayers,
  closeLayer,
  closeTopLayer,
  createLayerId,
  createOpenLayerEntry,
  isLayerMounted,
  removeLayer,
  syncLayerShow,
  trimLayersToMax,
  updateLayerMerged,
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
  timeout?: false | number;
};

function resolveOpenOptions(
  openOptions: BridgeSnackbarOpenOptions,
  timeout: false | number | undefined,
): BridgeSnackbarOpenOptions {
  if (!isNil(openOptions.duration)) {
    return openOptions;
  }

  if (isNil(timeout)) {
    return openOptions;
  }

  return { ...openOptions, duration: timeout };
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
      next = trimLayersToMax(next, max);
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
    entries.value = closeAllLayers(entries.value);
  }

  function isOpen(id: LayerId) {
    return isLayerMounted(entries.value, id);
  }

  function removeEntry(id: LayerId) {
    entries.value = removeLayer(entries.value, id);
  }

  function update(id: LayerId, options: BridgeSnackbarUpdateOptions) {
    entries.value = updateLayerMerged(entries.value, id, options, ["props"]);
  }

  function syncShow(id: LayerId, show: boolean) {
    entries.value = syncLayerShow(entries.value, id, show);
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
