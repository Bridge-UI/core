// ** Core Imports
import { type FieldOverlayMode } from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Button } from "@/Components/Button";
import { Checkbox } from "@/Components/Checkbox";
import { DataTableToolbarButton } from "@/Components/DataTable/DataTableToolbarButton";
import type { DataTableVisibilityItem } from "@/Components/DataTable/hooks/useDataTable";
import { useDataTableColumnsMenu } from "@/Components/DataTable/hooks/useDataTableColumnsMenu";
import { FieldOverlay } from "@/Components/FieldOverlay";

/**
 * Internal column visibility overlay. Not part of the public API.
 */
export function DataTableColumnsMenu({
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
  const resolveMessage = useResolveMessage();
  const {
    show,
    onApply,
    onReset,
    isHidden,
    triggerRef,
    controlSize,
    onShowChange,
    onToggleItem,
    onToggleShow,
    overlayCustomProps,
    showFooter: showFooterResolved,
  } = useDataTableColumnsMenu({
    items,
    overlay,
    onChange,
    showFooter,
  });

  return (
    <span className="relative inline-flex items-center">
      <span ref={triggerRef} className="inline-flex">
        <DataTableToolbarButton
          icon="columns"
          onClick={onToggleShow}
          label={resolveMessage("Columns")}
        />
      </span>

      <FieldOverlay
        show={show}
        overlay={overlay}
        onShowChange={onShowChange}
        customProps={overlayCustomProps}
      >
        <div
          className={cn({
            "min-w-52 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 dark:bg-dark-800 dark:ring-white/10": true,
            "p-1": !showFooterResolved,
            "px-1 pb-0.5 pt-1": showFooterResolved,
          })}
        >
          <div
            className={cn({
              "flex max-h-60 flex-col overflow-y-auto overscroll-contain bridge-soft-scrollbar": true,
              "pb-2": showFooterResolved,
            })}
          >
            {items.map((item) => {
              const hidden = isHidden(item);

              return (
                <div
                  key={item.id}
                  aria-checked={!hidden}
                  role="menuitemcheckbox"
                  onClick={() => {
                    onToggleItem(item);
                  }}
                  className="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-start hover:bg-dark-500/5 dark:hover:bg-dark-500/10"
                >
                  <Checkbox
                    hideErrorMessage
                    checked={!hidden}
                    size={controlSize}
                    endLabel={item.label}
                    disabled={!item.hideable}
                    classes={{ root: "pointer-events-none" }}
                  />
                </div>
              );
            })}
          </div>

          {showFooterResolved ? (
            <div className="flex justify-end gap-2 border-t border-dark-200 px-2 pb-1 pt-1.5 dark:border-dark-700">
              <Button size="sm" variant="outline" onClick={onReset}>
                {resolveMessage("Reset")}
              </Button>

              <Button size="sm" onClick={onApply}>
                {resolveMessage("OK")}
              </Button>
            </div>
          ) : null}
        </div>
      </FieldOverlay>
    </span>
  );
}
