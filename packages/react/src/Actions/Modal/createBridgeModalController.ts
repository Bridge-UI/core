// ** External Imports
import { remove } from "es-toolkit/array";
import { findLast, some } from "es-toolkit/compat";
import { useCallback, useMemo, useRef, useState } from "react";

// ** Core Imports
import { createModalStackId } from "@bridge-ui/core";

// ** Local Imports
import type {
  BridgeModalController,
  BridgeModalEntry,
  BridgeModalOpenOptions,
} from "@/Actions/Modal/bridgeModal.types";

function toEntry<TProps>(
  id: string,
  options: BridgeModalOpenOptions<TProps>,
): BridgeModalEntry {
  return {
    id,
    show: true,
    modal: options.modal,
    onClose: options.onClose,
    onClosed: options.onClosed,
    props: options.props as Record<string, unknown> | undefined,
    component: options.component as BridgeModalEntry["component"],
  };
}

function hideEntry(
  entries: BridgeModalEntry[],
  id: string,
): BridgeModalEntry[] {
  const index = entries.findIndex((entry) => entry.id === id);

  if (index === -1 || !entries[index]?.show) {
    return entries;
  }

  const next = [...entries];

  next[index] = { ...next[index], show: false };

  return next;
}

function hideTop(entries: BridgeModalEntry[]): BridgeModalEntry[] {
  const top = findLast(entries, (entry) => entry.show);

  if (!top) {
    return entries;
  }

  return hideEntry(entries, top.id);
}

function removeEntryFromList(
  entries: BridgeModalEntry[],
  id: string,
): BridgeModalEntry[] {
  const next = [...entries];

  remove(next, (entry) => entry.id === id);

  return next;
}

export function useBridgeModalController(): BridgeModalController {
  const [entries, setEntries] = useState<BridgeModalEntry[]>([]);

  const entriesRef = useRef(entries);

  entriesRef.current = entries;

  const open = useCallback(
    <TProps>(options: BridgeModalOpenOptions<TProps>): string => {
      const id = createModalStackId();

      setEntries((current) => [...current, toEntry(id, options)]);

      return id;
    },
    [],
  );

  const close = useCallback((id: string) => {
    setEntries((current) => hideEntry(current, id));
  }, []);

  const closeTop = useCallback(() => {
    setEntries((current) => hideTop(current));
  }, []);

  const isOpen = useCallback((id: string) => {
    return some(entriesRef.current, (entry) => entry.id === id && entry.show);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((current) => removeEntryFromList(current, id));
  }, []);

  const getStackSize = useCallback(() => {
    return entriesRef.current.filter((entry) => entry.show).length;
  }, []);

  return useMemo(() => {
    return {
      entries,
      open,
      close,
      closeTop,
      isOpen,
      removeEntry,
      getStackSize,
    };
  }, [open, close, closeTop, isOpen, removeEntry, getStackSize, entries]);
}
