// ** External Imports
import { markRaw, shallowRef } from "vue";

// ** Core Imports
import {
  closeLayer,
  closeTopLayer,
  createModalStackId,
  isLayerMounted,
  removeLayer,
  updateLayer,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  BridgeModalController,
  BridgeModalEntry,
  BridgeModalOpenOptions,
  BridgeModalUpdateOptions,
} from "@/Actions/Modal/bridgeModal.types";

function toEntry(
  id: string,
  options: BridgeModalOpenOptions,
): BridgeModalEntry {
  return {
    id,
    show: true,
    modal: options.modal,
    props: options.props,
    onClose: options.onClose,
    onClosed: options.onClosed,
    component: markRaw(options.component),
  };
}

export function createBridgeModalApi(): BridgeModalController {
  const entries = shallowRef<BridgeModalEntry[]>([]);

  function open<TProps = Record<string, unknown>>(
    options: BridgeModalOpenOptions<TProps>,
  ): string {
    const id = createModalStackId();

    const entry: BridgeModalEntry = toEntry(
      id,
      options as BridgeModalOpenOptions,
    );

    entries.value = [...entries.value, entry];

    return id;
  }

  function close(id: string) {
    entries.value = closeLayer(entries.value, id);
  }

  function closeTop() {
    entries.value = closeTopLayer(entries.value);
  }

  function isOpen(id: string) {
    return isLayerMounted(entries.value, id);
  }

  function removeEntry(id: string) {
    entries.value = removeLayer(entries.value, id);
  }

  function update(id: string, options: BridgeModalUpdateOptions) {
    entries.value = updateLayer(entries.value, id, options);
  }

  return {
    open,
    close,
    isOpen,
    update,
    entries,
    closeTop,
    removeEntry,
  };
}
