// ** External Imports
import { useState } from "react";

// ** Core Imports
import {
  filterDataTableFilterOptions,
  flattenDataTableFilterOptionValues,
  setDataTableFilterDraftAll,
  toggleDataTableFilterDraft,
  type DataTableFilterOption,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Checkbox } from "@/Components/Checkbox";
import { DataTableFilterOptions } from "@/Components/DataTable/DataTableFilterOptions";
import { Icon } from "@/Components/Icon";
import { Menu } from "@/Components/Menu";
import { TextField } from "@/Components/TextField";

/**
 * Internal column filter menu. Not part of the public API.
 */
export function DataTableFilterMenu({
  active,
  values,
  onApply,
  options,
  columnId,
  multiple,
}: {
  active: boolean;
  columnId: string;
  multiple: boolean;
  onApply: (values: string[]) => void;
  options: DataTableFilterOption[];
  values: string[];
}) {
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const visibleOptions = filterDataTableFilterOptions(options, query);
  const visibleValues = flattenDataTableFilterOptionValues(visibleOptions);
  const allSelected =
    visibleValues.length > 0 &&
    visibleValues.every((value) => {
      return draft.includes(value);
    });
  const allIndeterminate =
    visibleValues.some((value) => {
      return draft.includes(value);
    }) && !allSelected;

  return (
    <Menu
      show={show}
      placement="bottom-end"
      onShowChange={(next) => {
        if (next) {
          setQuery("");
          setDraft([...values]);
        }

        setShow(next);
      }}
      customProps={{
        root: {
          className: "inline-flex items-center leading-none",
        },
        trigger: {
          className: "inline-flex items-center leading-none",
        },
      }}
      slots={{
        trigger: (
          <button
            type="button"
            aria-pressed={active}
            aria-label="Filter column"
            className={cn({
              "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm leading-none hover:bg-dark-500/10 dark:hover:bg-dark-500/15": true,
              "text-primary-600": active,
            })}
          >
            <Icon size="sm" icon="filter" />
          </button>
        ),
      }}
    >
      <div className="min-w-52 px-1 pb-0.5 pt-2.5">
        <div className="px-1 pb-1.5">
          <TextField
            size="sm"
            value={query}
            hideErrorMessage
            aria-label="Search in filters"
            placeholder="Search in filters"
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
          />
        </div>
        <div className="flex max-h-60 flex-col gap-0.5 overflow-y-auto">
          {multiple && visibleValues.length > 0 ? (
            <div
              role="menuitemcheckbox"
              aria-checked={allSelected}
              className="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-start hover:bg-dark-500/5 dark:hover:bg-dark-500/10"
              onClick={() => {
                setDraft((current) => {
                  return setDataTableFilterDraftAll(
                    current,
                    visibleValues,
                    !allSelected,
                  );
                });
              }}
            >
              <Checkbox
                size="sm"
                hideErrorMessage
                checked={allSelected}
                endLabel="Select all items"
                indeterminate={allIndeterminate}
                classes={{ root: "pointer-events-none" }}
              />
            </div>
          ) : null}
          <DataTableFilterOptions
            draft={draft}
            multiple={multiple}
            options={visibleOptions}
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
          {visibleOptions.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-dark-500 dark:text-dark-400">
              No matching filters
            </div>
          ) : null}
        </div>
        <div className="flex justify-end gap-2 border-t border-dark-200 px-2 pb-1 pt-1.5 dark:border-dark-700">
          <Button
            size="sm"
            variant="flat"
            onClick={() => {
              setDraft([]);
            }}
          >
            Reset
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onApply(draft);
              setShow(false);
            }}
          >
            OK
          </Button>
        </div>
      </div>
    </Menu>
  );
}
