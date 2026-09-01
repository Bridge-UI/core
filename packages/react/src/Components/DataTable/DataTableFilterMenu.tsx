// ** External Imports
import { useRef, useState } from "react";

// ** Core Imports
import {
  flattenDataTableFilterOptionValues,
  getFieldOverlayControlSize,
  resolveFieldOverlay,
  setDataTableFilterDraftAll,
  toggleDataTableFilterDraft,
  type DataTableFilterOption,
  type FieldOverlayMode,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Button } from "@/Components/Button";
import { Checkbox } from "@/Components/Checkbox";
import { DataTableFilterOptions } from "@/Components/DataTable/DataTableFilterOptions";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { Icon } from "@/Components/Icon";
import { TextField } from "@/Components/TextField";
import { derived, useBreakpoint } from "@/Utils";

/**
 * Internal column filter overlay. Not part of the public API.
 */
export function DataTableFilterMenu({
  active,
  values,
  onApply,
  options,
  columnId,
  multiple,
  searchable,
  searchValue,
  overlay = "auto",
}: {
  active: boolean;
  columnId: string;
  multiple: boolean;
  onApply: (values: string[], query: string) => void;
  options: DataTableFilterOption[];
  overlay?: FieldOverlayMode;
  searchable: boolean;
  searchValue: string;
  values: string[];
}) {
  const breakpoint = useBreakpoint();
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const resolveMessage = useResolveMessage();
  const [draft, setDraft] = useState<string[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const optionValues = derived(() => {
    return flattenDataTableFilterOptionValues(options);
  });

  const controlSize = derived(() => {
    return getFieldOverlayControlSize(
      resolveFieldOverlay(overlay, breakpoint.mobile),
    );
  });

  const allSelected = derived(() => {
    return (
      optionValues.length > 0 &&
      optionValues.every((value) => {
        return draft.includes(value);
      })
    );
  });

  const allIndeterminate = derived(() => {
    return (
      optionValues.some((value) => {
        return draft.includes(value);
      }) && !allSelected
    );
  });

  function syncDraft() {
    setQuery(searchValue);
    setDraft([...values]);
  }

  return (
    <span className="relative z-2 inline-flex items-center leading-none">
      <button
        type="button"
        ref={triggerRef}
        aria-pressed={active}
        aria-label={resolveMessage("Filter column")}
        onClick={() => {
          setShow((open) => {
            if (!open) {
              syncDraft();
            }

            return !open;
          });
        }}
        className={cn({
          "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm leading-none hover:bg-dark-500/10 dark:hover:bg-dark-500/15": true,
          "text-primary-600": active,
        })}
      >
        <Icon size="sm" icon="filter" />
      </button>

      <FieldOverlay
        show={show}
        overlay={overlay}
        onShowChange={(next) => {
          if (next) {
            syncDraft();
          }

          setShow(next);
        }}
        customProps={{
          menu: {
            placement: "bottom",
            anchorEl: triggerRef,
          },
        }}
      >
        <div className="min-w-52 overflow-hidden rounded-md bg-white px-1 pb-0.5 pt-2.5 shadow-lg ring-1 ring-black/5 dark:bg-dark-800 dark:ring-white/10">
          {searchable ? (
            <div className="px-1 pb-1.5">
              <TextField
                value={query}
                hideErrorMessage
                size={controlSize}
                startIcon="search"
                aria-label={resolveMessage("Search")}
                placeholder={resolveMessage("Search")}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
              />
            </div>
          ) : null}

          {options.length > 0 ? (
            <div className="flex max-h-60 flex-col gap-0.5 overflow-y-auto overscroll-contain pb-2 bridge-soft-scrollbar">
              {multiple && optionValues.length > 0 ? (
                <div
                  role="menuitemcheckbox"
                  aria-checked={allSelected}
                  className="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-start hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => {
                    setDraft((current) => {
                      return setDataTableFilterDraftAll(
                        current,
                        optionValues,
                        !allSelected,
                      );
                    });
                  }}
                >
                  <Checkbox
                    hideErrorMessage
                    size={controlSize}
                    checked={allSelected}
                    indeterminate={allIndeterminate}
                    classes={{ root: "pointer-events-none" }}
                    endLabel={resolveMessage("Select all items")}
                  />
                </div>
              ) : null}

              <DataTableFilterOptions
                draft={draft}
                options={options}
                size={controlSize}
                multiple={multiple}
                name={`filter-${columnId}`}
                onToggle={(value, selected) => {
                  setDraft((current) => {
                    return toggleDataTableFilterDraft(
                      current,
                      value,
                      selected,
                      multiple,
                    );
                  });
                }}
              />
            </div>
          ) : null}

          <div className="flex justify-end gap-2 border-t border-dark-200 px-2 pb-1 pt-1.5 dark:border-dark-700">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setDraft([]);
                setQuery("");
              }}
            >
              {resolveMessage("Reset")}
            </Button>

            <Button
              size="sm"
              onClick={() => {
                onApply(draft, query);
                setShow(false);
              }}
            >
              {resolveMessage("OK")}
            </Button>
          </div>
        </div>
      </FieldOverlay>
    </span>
  );
}
