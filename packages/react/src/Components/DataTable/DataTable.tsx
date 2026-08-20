// ** External Imports
import { Fragment, useId, useState, type ReactNode } from "react";

// ** Core Imports
import {
  toggleDataTableFilterDraft,
  type DataTableFilterOption,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Checkbox } from "@/Components/Checkbox";
import type {
  DataTableItemSlotProps,
  DataTableProps,
} from "@/Components/DataTable/dataTable.types";
import {
  useDataTable,
  type DataTableCellView,
} from "@/Components/DataTable/hooks/useDataTable";
import { Icon } from "@/Components/Icon";
import { Menu } from "@/Components/Menu";
import { Pagination } from "@/Components/Pagination";
import { Radio } from "@/Components/Radio";
import { Spinner } from "@/Components/Spinner";
import { Tooltip } from "@/Components/Tooltip";

const dataTableLibDefaults = {
  size: "md",
  full: true,
  loading: false,
  striped: false,
  variant: "plain",
  hoverable: false,
  stickyHeader: false,
  selectionMode: "multiple",
} as const;

function DataTableFilterOptions({
  draft,
  options,
  multiple,
  onToggle,
}: {
  draft: string[];
  multiple: boolean;
  onToggle: (value: string, selected: boolean) => void;
  options: DataTableFilterOption[];
}) {
  return (
    <>
      {options.map((option) => {
        if (option.children && option.children.length > 0) {
          return (
            <div key={option.value} className="min-w-0">
              <div className="px-3 py-1 text-xs font-medium">
                {option.label}
              </div>
              <div className="ps-2">
                <DataTableFilterOptions
                  draft={draft}
                  multiple={multiple}
                  onToggle={onToggle}
                  options={option.children}
                />
              </div>
            </div>
          );
        }

        if (multiple) {
          return (
            <Checkbox
              size="sm"
              key={option.value}
              endLabel={option.label}
              checked={draft.includes(option.value)}
              onChange={(event) => {
                onToggle(option.value, event.currentTarget.checked);
              }}
            />
          );
        }

        return (
          <Radio
            size="sm"
            key={option.value}
            endLabel={option.label}
            checked={draft.includes(option.value)}
            onChange={(event) => {
              onToggle(option.value, event.currentTarget.checked);
            }}
          />
        );
      })}
    </>
  );
}

function resolveDataTableItemContent<T>(
  slot: undefined | ((props: DataTableItemSlotProps<T>) => ReactNode),
  row: T,
  cell: DataTableCellView,
): ReactNode {
  if (slot) {
    return slot({ row, value: cell.value });
  }

  return cell.content;
}

function DataTableCellContent({
  cell,
}: {
  cell: { content: ReactNode; ellipsis: boolean; tooltip?: string };
}) {
  if (!cell.ellipsis) {
    return cell.content;
  }

  const truncated = (
    <div className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
      {cell.content}
    </div>
  );

  if (!cell.tooltip) {
    return truncated;
  }

  return (
    <Tooltip
      content={cell.tooltip}
      slots={{ trigger: truncated }}
      customProps={{ trigger: { className: "block min-w-0 max-w-full" } }}
    />
  );
}

function DataTable<T>(props: DataTableProps<T>) {
  const {
    slots,
    merged,
    rowViews,
    rootBind,
    emptyBind,
    showEmpty,
    tableBind,
    getHeadBind,
    headerViews,
    loadingBind,
    onToggleRow,
    toolbarBind,
    bodyRowBind,
    getCellBind,
    spanRowBind,
    wrapperBind,
    serverPaged,
    showToolbar,
    onTogglePage,
    onToggleSort,
    spanCellBind,
    summaryCells,
    bodyGroupBind,
    headerRowBind,
    paginationBind,
    selectAllState,
    showPagination,
    onToggleExpand,
    headerGroupBind,
    visibilityItems,
    footerGroupBind,
    paginationVariant,
    selectionMultiple,
    visibilityEnabled,
    onCommitColumnFilter,
    onToggleColumnVisibility,
  } = useDataTable(props, dataTableLibDefaults);

  const selectionName = useId();
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [filterDraft, setFilterDraft] = useState<string[]>([]);
  const [filterMenuId, setFilterMenuId] = useState<null | string>(null);
  const checkboxSize = merged.size === "lg" ? "md" : "sm";

  return (
    <div {...rootBind}>
      {showToolbar ? (
        <div {...toolbarBind}>
          <div className="min-w-0 flex-1">{slots?.toolbar}</div>
          {visibilityEnabled ? (
            <Menu
              placement="bottom-end"
              show={columnsMenuOpen}
              onShowChange={setColumnsMenuOpen}
              slots={{
                trigger: (
                  <Button size="sm" variant="flat">
                    Columns
                  </Button>
                ),
              }}
            >
              <div className="min-w-44 p-1">
                {visibilityItems.map((item) => {
                  return (
                    <Checkbox
                      size="sm"
                      key={item.id}
                      endLabel={item.label}
                      checked={!item.hidden}
                      disabled={!item.hideable}
                      onChange={(event) => {
                        onToggleColumnVisibility(
                          item.id,
                          !event.currentTarget.checked,
                        );
                      }}
                    />
                  );
                })}
              </div>
            </Menu>
          ) : null}
        </div>
      ) : null}

      <div {...wrapperBind}>
        <div {...tableBind}>
          <div {...headerGroupBind}>
            <div {...headerRowBind}>
              {headerViews.map((header) => {
                if (header.isSelection) {
                  return (
                    <div key={header.id} {...getHeadBind(header)}>
                      {selectionMultiple ? (
                        <Checkbox
                          size={checkboxSize}
                          aria-label="Select all rows"
                          checked={selectAllState.checked}
                          indeterminate={selectAllState.indeterminate}
                          {...merged.customProps?.checkbox}
                          onChange={(event) => {
                            onTogglePage(event.currentTarget.checked);
                          }}
                        />
                      ) : null}
                    </div>
                  );
                }

                if (header.isExpand) {
                  return <div key={header.id} {...getHeadBind(header)} />;
                }

                return (
                  <div key={header.id} {...getHeadBind(header)}>
                    <div className="flex min-w-0 items-center gap-1">
                      {header.sortable ? (
                        <button
                          type="button"
                          className="inline-flex min-w-0 items-center gap-1"
                          onClick={() => {
                            onToggleSort(header.id);
                          }}
                        >
                          {header.header}
                          <Icon size="sm" icon={header.sortIcon} />
                        </button>
                      ) : (
                        header.header
                      )}

                      {header.filterable ? (
                        <Menu
                          placement="bottom-end"
                          show={filterMenuId === header.id}
                          onShowChange={(show) => {
                            if (show) {
                              setFilterMenuId(header.id);
                              setFilterDraft(header.filterValues);

                              return;
                            }

                            if (filterMenuId === header.id) {
                              setFilterMenuId(null);
                            }
                          }}
                          slots={{
                            trigger: (
                              <button
                                type="button"
                                aria-label="Filter column"
                                aria-pressed={header.filterActive}
                                className={
                                  header.filterActive
                                    ? "inline-flex shrink-0 text-primary-600"
                                    : "inline-flex shrink-0"
                                }
                              >
                                <Icon size="sm" icon="filter" />
                              </button>
                            ),
                          }}
                        >
                          <div className="min-w-44 p-1">
                            <div className="max-h-60 overflow-y-auto">
                              <DataTableFilterOptions
                                draft={filterDraft}
                                options={header.filterOptions}
                                multiple={header.filterMultiple}
                                onToggle={(value, selected) => {
                                  setFilterDraft((current) => {
                                    return toggleDataTableFilterDraft(
                                      current,
                                      value,
                                      selected,
                                      header.filterMultiple,
                                    );
                                  });
                                }}
                              />
                            </div>
                            <div className="flex justify-end gap-2 border-t px-2 py-2">
                              <Button
                                size="sm"
                                variant="flat"
                                onClick={() => {
                                  setFilterDraft([]);
                                }}
                              >
                                Reset
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  onCommitColumnFilter(header.id, filterDraft);
                                  setFilterMenuId(null);
                                }}
                              >
                                OK
                              </Button>
                            </div>
                          </div>
                        </Menu>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div {...bodyGroupBind}>
            {merged.loading && slots?.loading === undefined ? (
              <div {...spanRowBind}>
                <div {...spanCellBind}>
                  <div {...loadingBind}>
                    <Spinner {...merged.customProps?.spinner} />
                  </div>
                </div>
              </div>
            ) : null}

            {merged.loading && slots?.loading ? (
              <div {...spanRowBind}>
                <div {...spanCellBind}>
                  <div {...loadingBind}>{slots.loading}</div>
                </div>
              </div>
            ) : null}

            {showEmpty ? (
              <div {...spanRowBind}>
                <div {...spanCellBind}>
                  <div {...emptyBind}>{slots?.empty}</div>
                </div>
              </div>
            ) : null}

            {!merged.loading
              ? rowViews.map((row) => {
                  return (
                    <Fragment key={row.id}>
                      <div {...bodyRowBind}>
                        {row.cells.map((cell) => {
                          if (cell.isSelection) {
                            return (
                              <div key={cell.id} {...getCellBind(cell)}>
                                {selectionMultiple ? (
                                  <Checkbox
                                    size={checkboxSize}
                                    checked={row.selected}
                                    aria-label="Select row"
                                    {...merged.customProps?.checkbox}
                                    onChange={(event) => {
                                      onToggleRow(
                                        row.id,
                                        event.currentTarget.checked,
                                      );
                                    }}
                                  />
                                ) : (
                                  <Radio
                                    size={checkboxSize}
                                    name={selectionName}
                                    checked={row.selected}
                                    aria-label="Select row"
                                    {...merged.customProps?.radio}
                                    onChange={() => {
                                      onToggleRow(row.id, true);
                                    }}
                                  />
                                )}
                              </div>
                            );
                          }

                          if (cell.isExpand) {
                            return (
                              <div key={cell.id} {...getCellBind(cell)}>
                                <button
                                  type="button"
                                  aria-label="Expand row"
                                  className="inline-flex"
                                  aria-expanded={row.expanded}
                                  onClick={() => {
                                    onToggleExpand(row.id, !row.expanded);
                                  }}
                                >
                                  <Icon
                                    size="sm"
                                    icon={
                                      row.expanded
                                        ? "chevronDown"
                                        : "chevronRight"
                                    }
                                  />
                                </button>
                              </div>
                            );
                          }

                          return (
                            <div key={cell.id} {...getCellBind(cell)}>
                              <DataTableCellContent
                                cell={{
                                  ...cell,
                                  content: resolveDataTableItemContent(
                                    slots?.item?.[cell.id],
                                    row.original,
                                    cell,
                                  ),
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      {row.expanded ? (
                        <div {...spanRowBind}>
                          <div {...spanCellBind}>
                            {slots?.expanded?.(row.original)}
                          </div>
                        </div>
                      ) : null}
                    </Fragment>
                  );
                })
              : null}
          </div>

          {summaryCells ? (
            <div {...footerGroupBind}>
              <div {...headerRowBind}>
                {summaryCells.map((cell) => {
                  return (
                    <div key={cell.id} {...getCellBind(cell)}>
                      {cell.content}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {showPagination ? (
        <div {...paginationBind}>
          {slots?.pagination ??
            (serverPaged ? (
              <Pagination
                page={merged.page}
                count={merged.pageCount}
                variant={paginationVariant}
                {...merged.customProps?.pagination}
                onChange={merged.onPageChange}
              />
            ) : null)}
        </div>
      ) : null}
    </div>
  );
}

export default DataTable;
