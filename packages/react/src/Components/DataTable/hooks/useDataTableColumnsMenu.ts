// ** External Imports
import { useRef, useState } from "react";

// ** Core Imports
import {
  getDataTableHiddenColumnIds,
  getDataTableResetHiddenColumnIds,
  getFieldOverlayControlSize,
  resolveFieldOverlay,
  resolveFieldShowFooter,
  toggleDataTableColumnVisibility,
  type FieldOverlayMode,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { DataTableVisibilityItem } from "@/Components/DataTable/hooks/useDataTable";
import { derived, useBreakpoint } from "@/Utils";

/**
 * Column visibility overlay state: draft when the footer is shown, live
 * otherwise.
 */
export function useDataTableColumnsMenu({
  items,
  onChange,
  showFooter,
  overlay = "auto",
}: {
  items: DataTableVisibilityItem[];
  onChange: (hiddenIds: string[]) => void;
  overlay?: FieldOverlayMode;
  showFooter?: boolean;
}) {
  const breakpoint = useBreakpoint();
  const [show, setShow] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const draftHiddenIds = useRef<string[]>([]);
  const [, setDraftRevision] = useState(0);

  const overlayResolved = derived(() => {
    return resolveFieldOverlay(overlay, breakpoint.mobile);
  });
  const showFooterResolved = derived(() => {
    return resolveFieldShowFooter(showFooter, overlayResolved);
  });
  const controlSize = derived(() => {
    return getFieldOverlayControlSize(overlayResolved);
  });

  function setDraftHiddenIds(next: string[]) {
    draftHiddenIds.current = next;
    setDraftRevision((revision) => {
      return revision + 1;
    });
  }

  function snapshotHiddenIds() {
    setDraftHiddenIds(getDataTableHiddenColumnIds(items));
  }

  function hiddenIds() {
    if (showFooterResolved) {
      return draftHiddenIds.current;
    }

    return getDataTableHiddenColumnIds(items);
  }

  function isHidden(item: DataTableVisibilityItem) {
    return hiddenIds().includes(item.id);
  }

  function onToggleItem(item: DataTableVisibilityItem) {
    if (!item.hideable) {
      return;
    }

    const next = toggleDataTableColumnVisibility(
      hiddenIds(),
      item.id,
      !isHidden(item),
      items.map((column) => {
        return column.id;
      }),
    );

    if (showFooterResolved) {
      setDraftHiddenIds(next);

      return;
    }

    onChange(next);
  }

  function onToggleShow() {
    setShow((open) => {
      if (!open) {
        snapshotHiddenIds();
      }

      return !open;
    });
  }

  function onShowChange(next: boolean) {
    if (next) {
      snapshotHiddenIds();
    }

    setShow(next);
  }

  function onReset() {
    setDraftHiddenIds(getDataTableResetHiddenColumnIds(items));
  }

  function onApply() {
    onChange(draftHiddenIds.current);
    setShow(false);
  }

  return {
    show,
    onApply,
    onReset,
    isHidden,
    triggerRef,
    controlSize,
    onShowChange,
    onToggleItem,
    onToggleShow,
    showFooter: showFooterResolved,
    overlayCustomProps: {
      menu: {
        anchorEl: triggerRef,
        placement: "bottom" as const,
      },
    },
  };
}
