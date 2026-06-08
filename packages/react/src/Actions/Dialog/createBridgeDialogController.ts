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

export function useBridgeDialogController(): BridgeDialogController {
  const [entries, setEntries] = useState<BridgeDialogEntry[]>([]);

  const entriesRef = useRef(entries);

  entriesRef.current = entries;

  const open = useCallback((options: BridgeDialogOpenOptions): LayerId => {
    const id = createLayerId();

    setEntries((current) => [...current, toEntry(id, options)]);

    return id;
  }, []);

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
    (id: LayerId, options: BridgeDialogUpdateOptions) => {
      setEntries((current) =>
        updateLayerMerged(current, id, options, ["props", "modal"]),
      );
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
