// ** External Imports
import { shallowRef } from "vue";

// ** Core Imports
import {
  closeLayer,
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

export function createBridgeSnackbarApi(): BridgeSnackbarController {
  const entries = shallowRef<BridgeSnackbarEntry[]>([]);

  function open(options: BridgeSnackbarOpenOptions): LayerId {
    const id = createLayerId();

    entries.value = [...entries.value, toEntry(id, options)];

    return id;
  }

  function close(id: LayerId) {
    entries.value = closeLayer(entries.value, id);
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
    closeAll,
    syncShow,
    removeEntry,
  };
}
