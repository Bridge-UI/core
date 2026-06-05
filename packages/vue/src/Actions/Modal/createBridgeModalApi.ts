// ** External Imports
import { remove } from "es-toolkit/array";
import { findLast, some } from "es-toolkit/compat";
import { shallowRef } from "vue";

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
    component: options.component,
    props: options.props as Record<string, unknown> | undefined,
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

export function createBridgeModalApi(): BridgeModalController {
  const entries = shallowRef<BridgeModalEntry[]>([]);

  function open<TProps = Record<string, unknown>>(
    options: BridgeModalOpenOptions<TProps>,
  ): string {
    const id = createModalStackId();

    entries.value = [...entries.value, toEntry(id, options)];

    return id;
  }

  function close(id: string) {
    entries.value = hideEntry(entries.value, id);
  }

  function closeTop() {
    entries.value = hideTop(entries.value);
  }

  function isOpen(id: string) {
    return some(entries.value, (entry) => entry.id === id && entry.show);
  }

  function removeEntry(id: string) {
    entries.value = removeEntryFromList(entries.value, id);
  }

  return {
    open,
    close,
    isOpen,
    entries,
    closeTop,
    removeEntry,
  };
}
