// ** External Imports
import { shallowRef } from "vue";

// ** Core Imports
import {
  closeLayer,
  closeTopLayer,
  createLayerId,
  createOpenLayerEntry,
  isLayerMounted,
  removeLayer,
  syncLayerShow,
  updateLayerMerged,
  type LayerId,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  BridgeDialogController,
  BridgeDialogEntry,
  BridgeDialogOpenOptions,
  BridgeDialogUpdateOptions,
} from "@/Actions/Dialog/bridgeDialog.types";

function toEntry(
  id: LayerId,
  options: BridgeDialogOpenOptions,
): BridgeDialogEntry {
  const { modal, onClose, onClosed, ...props } = options;

  return createOpenLayerEntry<BridgeDialogEntry>(id, {
    modal,
    props,
    onClose,
    onClosed,
  });
}

export function createBridgeDialogApi(): BridgeDialogController {
  const entries = shallowRef<BridgeDialogEntry[]>([]);

  function open(options: BridgeDialogOpenOptions): LayerId {
    const id = createLayerId();

    entries.value = [...entries.value, toEntry(id, options)];

    return id;
  }

  function close(id: LayerId) {
    entries.value = closeLayer(entries.value, id);
  }

  function closeTop() {
    entries.value = closeTopLayer(entries.value);
  }

  function isOpen(id: LayerId) {
    return isLayerMounted(entries.value, id);
  }

  function removeEntry(id: LayerId) {
    entries.value = removeLayer(entries.value, id);
  }

  function update(id: LayerId, options: BridgeDialogUpdateOptions) {
    entries.value = updateLayerMerged(entries.value, id, options, [
      "props",
      "modal",
    ]);
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
    syncShow,
    removeEntry,
  };
}
