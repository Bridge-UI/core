// ** External Imports
import { isNil } from "es-toolkit/compat";
import { useCallback, useMemo, useRef, useState } from "react";

// ** Core Imports
import {
  closeAllLayers,
  closeLayer,
  closeTopLayer,
  createLayerId,
  createOpenLayerEntry,
  isLayerMounted,
  removeLayer,
  syncLayerShow,
  trimLayersToMax,
  updateLayerMerged,
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

export type BridgeSnackbarControllerOptions = {
  /**
   * Maximum number of visible snackbars. When exceeded, the oldest closes before opening the new one.
   */
  max?: number;

  /**
   * Default auto-dismiss delay (ms) for `open()`. `false` keeps snackbars open until dismissed.
   * Per-call `duration` overrides this.
   *
   * @default 5000
   */
  timeout?: false | number;
};

function resolveOpenOptions(
  openOptions: BridgeSnackbarOpenOptions,
  timeout: false | number | undefined,
): BridgeSnackbarOpenOptions {
  if (!isNil(openOptions.duration)) {
    return openOptions;
  }

  if (isNil(timeout)) {
    return openOptions;
  }

  return { ...openOptions, duration: timeout };
}

export function useBridgeSnackbarController(
  options: BridgeSnackbarControllerOptions = {},
): BridgeSnackbarController {
  const { max, timeout = 5000 } = options;
  const [entries, setEntries] = useState<BridgeSnackbarEntry[]>([]);

  const entriesRef = useRef(entries);

  entriesRef.current = entries;

  const open = useCallback(
    (openOptions: BridgeSnackbarOpenOptions): LayerId => {
      const id = createLayerId();

      setEntries((current) => {
        let next = current;

        if (max != null && max > 0) {
          next = trimLayersToMax(next, max);
        }

        return [...next, toEntry(id, resolveOpenOptions(openOptions, timeout))];
      });

      return id;
    },
    [max, timeout],
  );

  const close = useCallback((id: LayerId) => {
    setEntries((current) => closeLayer(current, id));
  }, []);

  const closeTop = useCallback(() => {
    setEntries((current) => closeTopLayer(current));
  }, []);

  const closeAll = useCallback(() => {
    setEntries((current) => closeAllLayers(current));
  }, []);

  const isOpen = useCallback((id: LayerId) => {
    return isLayerMounted(entriesRef.current, id);
  }, []);

  const removeEntry = useCallback((id: LayerId) => {
    setEntries((current) => removeLayer(current, id));
  }, []);

  const update = useCallback(
    (id: LayerId, options: BridgeSnackbarUpdateOptions) => {
      setEntries((current) =>
        updateLayerMerged(current, id, options, ["props"]),
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
      closeAll,
      syncShow,
      removeEntry,
    };
  }, [
    open,
    close,
    isOpen,
    update,
    entries,
    closeTop,
    closeAll,
    syncShow,
    removeEntry,
  ]);
}
