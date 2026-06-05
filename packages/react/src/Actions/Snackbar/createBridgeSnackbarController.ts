// ** External Imports
import { useCallback, useMemo, useRef, useState } from "react";

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

export function useBridgeSnackbarController(): BridgeSnackbarController {
  const [entries, setEntries] = useState<BridgeSnackbarEntry[]>([]);

  const entriesRef = useRef(entries);

  entriesRef.current = entries;

  const open = useCallback((options: BridgeSnackbarOpenOptions): LayerId => {
    const id = createLayerId();

    setEntries((current) => [...current, toEntry(id, options)]);

    return id;
  }, []);

  const close = useCallback((id: LayerId) => {
    setEntries((current) => closeLayer(current, id));
  }, []);

  const closeAll = useCallback(() => {
    setEntries((current) => {
      let next = current;

      for (const entry of current) {
        if (entry.show) {
          next = closeLayer(next, entry.id);
        }
      }

      return next;
    });
  }, []);

  const isOpen = useCallback((id: LayerId) => {
    return isLayerMounted(entriesRef.current, id);
  }, []);

  const removeEntry = useCallback((id: LayerId) => {
    setEntries((current) => removeLayer(current, id));
  }, []);

  const update = useCallback(
    (id: LayerId, options: BridgeSnackbarUpdateOptions) => {
      setEntries((current) => {
        const entry = current.find((item) => item.id === id);

        if (!entry || !options.props) {
          return updateLayer(current, id, options);
        }

        return updateLayer(current, id, {
          props: { ...entry.props, ...options.props },
        });
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
      closeAll,
      syncShow,
      removeEntry,
    };
  }, [open, close, isOpen, update, entries, closeAll, syncShow, removeEntry]);
}
