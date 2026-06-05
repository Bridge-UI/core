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
  BridgeDialogController,
  BridgeDialogEntry,
  BridgeDialogOpenOptions,
  BridgeDialogUpdateOptions,
} from "@/Actions/Dialog/bridgeDialog.types";

function toEntry(
  id: LayerId,
  options: BridgeDialogOpenOptions,
): BridgeDialogEntry {
  const { onClose, onClosed, modal, ...props } = options;

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
    const entry = entries.value.find((item) => item.id === id);

    if (!entry) {
      return;
    }

    const patch: Partial<BridgeDialogEntry> = {};

    if (options.props) {
      patch.props = { ...entry.props, ...options.props };
    }

    if (options.modal) {
      patch.modal = { ...entry.modal, ...options.modal };
    }

    entries.value = updateLayer(entries.value, id, patch);
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
    syncShow,
    removeEntry,
  };
}
