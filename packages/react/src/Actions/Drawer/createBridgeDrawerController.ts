// ** External Imports
import { useCallback, useMemo, useRef, useState } from "react";

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
} from "@bridge-ui/core";

// ** Local Imports
import type {
  BridgeDrawerController,
  BridgeDrawerEntry,
  BridgeDrawerOpenOptions,
  BridgeDrawerUpdateOptions,
} from "@/Actions/Drawer/bridgeDrawer.types";

function toEntry<TProps>(
  id: LayerId,
  options: BridgeDrawerOpenOptions<TProps>,
): BridgeDrawerEntry {
  return createOpenLayerEntry<BridgeDrawerEntry>(id, {
    drawer: options.drawer,
    onClose: options.onClose,
    onClosed: options.onClosed,
    props: options.props as undefined | Record<string, unknown>,
    component: options.component as BridgeDrawerEntry["component"],
  });
}

export function useBridgeDrawerController(): BridgeDrawerController {
  const [entries, setEntries] = useState<BridgeDrawerEntry[]>([]);

  const entriesRef = useRef(entries);

  entriesRef.current = entries;

  const open = useCallback(
    <TProps>(options: BridgeDrawerOpenOptions<TProps>): LayerId => {
      const id = createLayerId();

      setEntries((current) => [...current, toEntry(id, options)]);

      return id;
    },
    [],
  );

  const close = useCallback((id: LayerId) => {
    setEntries((current) => closeLayer(current, id));
  }, []);

  const closeTop = useCallback(() => {
    setEntries((current) => closeTopLayer(current));
  }, []);

  const isOpen = useCallback((id: LayerId) => {
    return isLayerMounted(entriesRef.current, id);
  }, []);

  const removeEntry = useCallback((id: LayerId) => {
    setEntries((current) => removeLayer(current, id));
  }, []);

  const update = useCallback(
    (id: LayerId, options: BridgeDrawerUpdateOptions) => {
      setEntries((current) => updateLayer(current, id, options));
    },
    [],
  );

  const syncShow = useCallback((id: LayerId, show: boolean) => {
    setEntries((current) => syncLayerShow(current, id, show));
  }, []);

  return useMemo(() => {
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
  }, [open, close, isOpen, update, entries, closeTop, syncShow, removeEntry]);
}
