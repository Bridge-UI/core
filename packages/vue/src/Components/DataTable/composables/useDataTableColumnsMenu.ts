// ** External Imports
import { computed, ref, watch } from "vue";

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
import type { DataTableVisibilityItem } from "@/Components/DataTable/composables/useDataTable";
import { useBreakpoint } from "@/Utils";

/**
 * Column visibility overlay state: draft when the footer is shown, live
 * otherwise.
 */
export function useDataTableColumnsMenu(
  props: {
    items: DataTableVisibilityItem[];
    overlay?: FieldOverlayMode;
    showFooter?: boolean;
  },
  onChange: (hiddenIds: string[]) => void,
) {
  const show = ref(false);
  const breakpoint = useBreakpoint();
  const draftHiddenIds = ref<string[]>([]);
  const triggerRef = ref<null | HTMLSpanElement>(null);

  const overlayResolved = computed(() => {
    return resolveFieldOverlay(props.overlay, breakpoint.mobile);
  });

  const showFooterResolved = computed(() => {
    return resolveFieldShowFooter(props.showFooter, overlayResolved.value);
  });

  const controlSize = computed(() => {
    return getFieldOverlayControlSize(overlayResolved.value);
  });

  const overlayCustomProps = computed(() => {
    return {
      menu: {
        anchorEl: triggerRef.value,
        placement: "bottom" as const,
      },
    };
  });

  watch(
    show,
    (open) => {
      if (!open) {
        return;
      }

      snapshotHiddenIds();
    },
    { flush: "sync" },
  );

  function snapshotHiddenIds() {
    draftHiddenIds.value = getDataTableHiddenColumnIds(props.items);
  }

  function hiddenIds() {
    if (showFooterResolved.value) {
      return draftHiddenIds.value;
    }

    return getDataTableHiddenColumnIds(props.items);
  }

  function isHidden(item: DataTableVisibilityItem) {
    return hiddenIds().includes(item.id);
  }

  function onToggleShow() {
    show.value = !show.value;
  }

  function onToggleItem(item: DataTableVisibilityItem) {
    if (!item.hideable) {
      return;
    }

    const next = toggleDataTableColumnVisibility(
      hiddenIds(),
      item.id,
      !isHidden(item),
      props.items.map((column) => {
        return column.id;
      }),
    );

    if (showFooterResolved.value) {
      draftHiddenIds.value = next;

      return;
    }

    onChange(next);
  }

  function onReset() {
    draftHiddenIds.value = getDataTableResetHiddenColumnIds(props.items);
  }

  function onApply() {
    onChange(draftHiddenIds.value);
    show.value = false;
  }

  return {
    show,
    onApply,
    onReset,
    isHidden,
    triggerRef,
    controlSize,
    onToggleItem,
    onToggleShow,
    overlayCustomProps,
    showFooter: showFooterResolved,
  };
}
