// ** External Imports
import { useCallback, useMemo, useRef, useState } from "react";

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
} from "@bridge-ui/core";

// ** Local Imports
import type {
  BridgeModalController,
  BridgeModalEntry,
  BridgeModalOpenOptions,
  BridgeModalUpdateOptions,
} from "@/Actions/Modal/bridgeModal.types";

function toEntry<TProps>(
  id: string,
  options: BridgeModalOpenOptions<TProps>,
): BridgeModalEntry {
  return createOpenLayerEntry<BridgeModalEntry>(id, {
    modal: options.modal,
    onClose: options.onClose,
    onClosed: options.onClosed,
    props: options.props as Record<string, unknown> | undefined,
    component: options.component as BridgeModalEntry["component"],
  });
}

export function useBridgeModalController(): BridgeModalController {
  const [entries, setEntries] = useState<BridgeModalEntry[]>([]);

  const entriesRef = useRef(entries);

  entriesRef.current = entries;

  const open = useCallback(
    <TProps>(options: BridgeModalOpenOptions<TProps>): string => {
      const id = createLayerId();

      setEntries((current) => [...current, toEntry(id, options)]);

      return id;
    },
    [],
  );

  const close = useCallback((id: string) => {
    setEntries((current) => closeLayer(current, id));
  }, []);

  const closeTop = useCallback(() => {
    setEntries((current) => closeTopLayer(current));
  }, []);

  const isOpen = useCallback((id: string) => {
    return isLayerMounted(entriesRef.current, id);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((current) => removeLayer(current, id));
  }, []);

  const update = useCallback(
    (id: string, options: BridgeModalUpdateOptions) => {
      setEntries((current) => updateLayer(current, id, options));
    },
    [],
  );

  const syncShow = useCallback((id: string, show: boolean) => {
    setEntries((current) => {
      const entry = current.find((item) => item.id === id);

      if (!entry || entry.show === show) {
        return current;
      }

      return show
        ? updateLayer(current, id, { show: true })
        : hideLayer(current, id);
    });
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
