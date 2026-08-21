// ** External Imports
import { useState } from "react";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Checkbox } from "@/Components/Checkbox";
import { DataTableToolbarButton } from "@/Components/DataTable/DataTableToolbarButton";
import type { DataTableVisibilityItem } from "@/Components/DataTable/hooks/useDataTable";
import { Menu } from "@/Components/Menu";

/**
 * Internal column visibility menu. Not part of the public API.
 */
export function DataTableColumnsMenu({
  items,
  onToggle,
}: {
  items: DataTableVisibilityItem[];
  onToggle: (columnId: string, hide: boolean) => void;
}) {
  const [show, setShow] = useState(false);
  const resolveMessage = useResolveMessage();

  return (
    <Menu
      show={show}
      placement="bottom-end"
      onShowChange={setShow}
      slots={{
        trigger: (
          <DataTableToolbarButton
            icon="columns"
            label={resolveMessage("Columns")}
          />
        ),
      }}
    >
      <div className="min-w-52 p-1">
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
    </Menu>
  );
}
