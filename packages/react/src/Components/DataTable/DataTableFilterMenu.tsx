// ** External Imports
import { useState } from "react";

// ** Core Imports
import {
  flattenDataTableFilterOptionValues,
  setDataTableFilterDraftAll,
  toggleDataTableFilterDraft,
  type DataTableFilterOption,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
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
  searchable,
  searchValue,
}: {
  active: boolean;
  columnId: string;
  multiple: boolean;
  onApply: (values: string[], query: string) => void;
  options: DataTableFilterOption[];
  searchable: boolean;
  searchValue: string;
  values: string[];
}) {
  const resolveMessage = useResolveMessage();
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const searchLabel = resolveMessage("Search");
  const optionValues = flattenDataTableFilterOptionValues(options);
  const allSelected =
    optionValues.length > 0 &&
    optionValues.every((value) => {
      return draft.includes(value);
    });
  const allIndeterminate =
    optionValues.some((value) => {
      return draft.includes(value);
    }) && !allSelected;

  return (
    <Menu
      show={show}
      placement="bottom-end"
      onShowChange={(next) => {
        if (next) {
          setQuery(searchValue);
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
        {searchable ? (
          <div className="px-1 pb-1.5">
            <TextField
              size="sm"
              value={query}
              hideErrorMessage
              startIcon="search"
              aria-label={searchLabel}
              placeholder={searchLabel}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </div>
        ) : null}
        {options.length > 0 ? (
          <div className="flex max-h-60 flex-col gap-0.5 overflow-y-auto pb-2">
            {multiple && optionValues.length > 0 ? (
              <div
                role="menuitemcheckbox"
                aria-checked={allSelected}
                className="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-start hover:bg-dark-500/5 dark:hover:bg-dark-500/10"
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
              options={options}
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
            variant="flat"
            onClick={() => {
              setDraft([]);
              setQuery("");
            }}
          >
            Reset
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onApply(draft, query);
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
