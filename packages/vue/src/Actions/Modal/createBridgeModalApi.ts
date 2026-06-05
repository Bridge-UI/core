// ** External Imports
import { markRaw, shallowRef } from "vue";

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
  BridgeModalController,
  BridgeModalEntry,
  BridgeModalOpenOptions,
  BridgeModalUpdateOptions,
} from "@/Actions/Modal/bridgeModal.types";

function toEntry(
  id: LayerId,
  options: BridgeModalOpenOptions,
): BridgeModalEntry {
  return createOpenLayerEntry<BridgeModalEntry>(id, {
    modal: options.modal,
    props: options.props,
    onClose: options.onClose,
    onClosed: options.onClosed,
    component: markRaw(options.component),
  });
}

export function createBridgeModalApi(): BridgeModalController {
  const entries = shallowRef<BridgeModalEntry[]>([]);

  function open<TProps = Record<string, unknown>>(
    options: BridgeModalOpenOptions<TProps>,
  ): LayerId {
    const id = createLayerId();

    const entry: BridgeModalEntry = toEntry(
      id,
      options as BridgeModalOpenOptions,
    );

    entries.value = [...entries.value, entry];

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

  function update(id: LayerId, options: BridgeModalUpdateOptions) {
    entries.value = updateLayer(entries.value, id, options);
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
