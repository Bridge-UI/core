// ** External Imports
import { useRef, useState } from "react";

// ** Core Imports
import type { FieldOverlayMode } from "@bridge-ui/core/Domain";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Checkbox } from "@/Components/Checkbox";
import { DataTableToolbarButton } from "@/Components/DataTable/DataTableToolbarButton";
import type { DataTableVisibilityItem } from "@/Components/DataTable/hooks/useDataTable";
import { FieldOverlay } from "@/Components/FieldOverlay";

/**
 * Internal column visibility overlay. Not part of the public API.
 */
export function DataTableColumnsMenu({
  items,
  onToggle,
  overlay = "auto",
}: {
  items: DataTableVisibilityItem[];
  onToggle: (columnId: string, hide: boolean) => void;
  overlay?: FieldOverlayMode;
}) {
  const [show, setShow] = useState(false);
  const resolveMessage = useResolveMessage();
  const triggerRef = useRef<HTMLSpanElement>(null);

  return (
    <span className="relative inline-flex items-center">
      <span ref={triggerRef} className="inline-flex">
        <DataTableToolbarButton
          icon="columns"
          label={resolveMessage("Columns")}
          onClick={() => {
            setShow((open) => {
              return !open;
            });
          }}
        />
      </span>

      <FieldOverlay
        show={show}
        overlay={overlay}
        onShowChange={setShow}
        customProps={{
          menu: {
            placement: "bottom",
            anchorEl: triggerRef,
          },
        }}
      >
        <div className="min-w-52 overflow-hidden rounded-md bg-white p-1 shadow-lg ring-1 ring-black/5 dark:bg-dark-800 dark:ring-white/10">
          {items.map((item) => {
            return (
              <div
                key={item.id}
                role="menuitemcheckbox"
                aria-checked={!item.hidden}
                className="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-start hover:bg-dark-500/5 dark:hover:bg-dark-500/10"
                onClick={() => {
                  if (!item.hideable) {
                    return;
                  }

                  onToggle(item.id, !item.hidden);
                }}
              >
                <Checkbox
                  size="sm"
                  hideErrorMessage
                  endLabel={item.label}
                  checked={!item.hidden}
                  disabled={!item.hideable}
                  classes={{ root: "pointer-events-none" }}
                />
              </div>
            );
          })}
        </div>
      </FieldOverlay>
    </span>
  );
}
