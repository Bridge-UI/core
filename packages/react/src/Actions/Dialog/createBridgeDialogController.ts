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
      setEntries((current) => {
        const entry = current.find((item) => item.id === id);

        if (!entry) {
          return current;
        }

        const patch: Partial<BridgeDialogEntry> = {};

        if (options.props) {
          patch.props = { ...entry.props, ...options.props };
        }

        if (options.modal) {
          patch.modal = { ...entry.modal, ...options.modal };
        }

        return updateLayer(current, id, patch);
      });
    },
    [],
  );

  const syncShow = useCallback((id: LayerId, show: boolean) => {
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
