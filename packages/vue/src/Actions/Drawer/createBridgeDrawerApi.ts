// ** External Imports
import { markRaw, shallowRef } from "vue";

// ** Core Imports
import {
  closeLayer,
  closeTopLayer,
  createLayerId,
  createOpenLayerEntry,
  isLayerMounted,
  removeLayer,
  syncLayerShow,
  updateLayer,
  type LayerId,
} from "@bridge-ui/core/Layer";

// ** Local Imports
import type {
  BridgeDrawerController,
  BridgeDrawerEntry,
  BridgeDrawerOpenOptions,
  BridgeDrawerUpdateOptions,
} from "@/Actions/Drawer/bridgeDrawer.types";

function toEntry(
  id: LayerId,
  options: BridgeDrawerOpenOptions,
): BridgeDrawerEntry {
  return createOpenLayerEntry<BridgeDrawerEntry>(id, {
    props: options.props,
    drawer: options.drawer,
    onClose: options.onClose,
    onClosed: options.onClosed,
    component: markRaw(options.component),
  });
}

export function createBridgeDrawerApi(): BridgeDrawerController {
  const entries = shallowRef<BridgeDrawerEntry[]>([]);

  function open<TProps = Record<string, unknown>>(
    options: BridgeDrawerOpenOptions<TProps>,
  ): LayerId {
    const id = createLayerId();

    const entry: BridgeDrawerEntry = toEntry(
      id,
      options as BridgeDrawerOpenOptions,
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

  function update(id: LayerId, options: BridgeDrawerUpdateOptions) {
    entries.value = updateLayer(entries.value, id, options);
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
