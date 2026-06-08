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
  timeout?: number | false;
};

function resolveOpenOptions(
  openOptions: BridgeSnackbarOpenOptions,
  timeout: number | false | undefined,
): BridgeSnackbarOpenOptions {
  if (openOptions.duration !== undefined) {
    return openOptions;
  }

  if (timeout === undefined) {
    return openOptions;
  }

  return { ...openOptions, duration: timeout };
}

function trimToMax<T extends { id: LayerId; show: boolean }>(
  entries: T[],
  max: number,
): T[] {
  let next = entries;
  let visible = next.filter((entry) => entry.show);

  while (visible.length >= max) {
    next = closeLayer(next, visible[0]!.id);
    visible = next.filter((entry) => entry.show);
  }

  return next;
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
          next = trimToMax(next, max);
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
