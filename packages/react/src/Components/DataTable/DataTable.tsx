// ** External Imports
import { isFunction } from "es-toolkit/compat";
import { Fragment, useId, type ReactNode } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DataTableItemSlotProps,
  DataTableProps,
} from "@/Components/DataTable/dataTable.types";
import { DataTableColumnsMenu } from "@/Components/DataTable/DataTableColumnsMenu";
import { DataTableFilterMenu } from "@/Components/DataTable/DataTableFilterMenu";
import { DataTableSearch } from "@/Components/DataTable/DataTableSearch";
import { DataTableSelection } from "@/Components/DataTable/DataTableSelection";
import { DataTableSortButton } from "@/Components/DataTable/DataTableSortButton";
import { DataTableToolbarButton } from "@/Components/DataTable/DataTableToolbarButton";
import {
  useDataTable,
  type DataTableCellView,
} from "@/Components/DataTable/hooks/useDataTable";
import { Icon } from "@/Components/Icon";
import { Pagination } from "@/Components/Pagination";
import { Progress } from "@/Components/Progress";
import { Select } from "@/Components/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Table";
import { Tooltip } from "@/Components/Tooltip";

const dataTableLibDefaults = {
  size: "md",
  full: true,
  rounded: "lg",
  loading: false,
  striped: false,
  variant: "plain",
  hoverable: false,
  stickyHeader: false,
  paginationAlign: "end",
  loadingVariant: "overlay",
  selectionMode: "multiple",
} as const;

function renderDataTableSlot<P>(
  slot: ReactNode | undefined | ((props: P) => ReactNode),
  props: P,
  fallback: ReactNode,
): ReactNode {
  if (slot === undefined) {
    return fallback;
  }

  if (isFunction(slot)) {
    return slot(props);
  }

  return slot;
}

function resolveDataTableItemContent<T>(
  slot: undefined | ((props: DataTableItemSlotProps<T>) => ReactNode),
  row: T,
  cell: DataTableCellView,
): ReactNode {
  if (slot) {
    return slot({ row, id: cell.id, value: cell.value });
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
      customProps={{
        trigger: { className: "block min-w-0 w-full max-w-full" },
      }}
    />
  );
}

function DataTableLoadingSpin() {
  return (
    <span
      role="status"
      aria-label="Loading"
      className="relative inline-block size-5 animate-spin motion-reduce:animate-none"
    >
      <span className="absolute inset-s-0 top-0 size-2 rounded-full bg-primary-500 opacity-30 dark:bg-primary-400" />
      <span className="absolute inset-e-0 top-0 size-2 rounded-full bg-primary-500 opacity-50 dark:bg-primary-400" />
      <span className="absolute inset-e-0 bottom-0 size-2 rounded-full bg-primary-500 dark:bg-primary-400" />
      <span className="absolute inset-s-0 bottom-0 size-2 rounded-full bg-primary-500 opacity-70 dark:bg-primary-400" />
    </span>
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
    showExport,
    showFooter,
    tableProps,
    footerBind,
    loadingBar,
    showSearch,
    getHeadBind,
    headerViews,
    loadingBind,
    onToggleRow,
    toolbarBind,
    getCellBind,
    columnCount,
    showPerPage,
    showToolbar,
    getHeadAlign,
    getCellAlign,
    onTogglePage,
    summaryCells,
    onExportClick,
    expandEnabled,
    loadingBarBind,
    paginationBind,
    selectAllState,
    showPagination,
    onChangeSearch,
    onToggleExpand,
    visibilityItems,
    perPageSlotProps,
    resolvedPageCount,
    selectionMultiple,
    visibilityEnabled,
    paginationSlotProps,
    onCommitColumnFilter,
    onToggleColumnVisibility,
  } = useDataTable(props, dataTableLibDefaults);

  const selectionName = useId();
  const resolveMessage = useResolveMessage();
  const checkboxSize = merged.size === "lg" ? "md" : "sm";

  return (
    <div {...rootBind}>
      {showToolbar ? (
        <div {...toolbarBind}>
          <div className="min-w-0 flex-1">{slots?.toolbar}</div>
          <div className="flex shrink-0 items-center">
            {visibilityEnabled ? (
              <DataTableColumnsMenu
                items={visibilityItems}
                onToggle={onToggleColumnVisibility}
              />
            ) : null}
            {visibilityEnabled && (showExport || showSearch) ? (
              <span
                aria-hidden
                className="mx-1 h-5 w-px bg-dark-200 dark:bg-dark-700"
              />
            ) : null}
            {showExport
              ? (slots?.export ?? (
                  <DataTableToolbarButton
                    icon="download"
                    onClick={onExportClick}
                    label={resolveMessage("Export")}
                    buttonProps={merged.customProps?.export}
                  />
                ))
              : null}
            {showExport && showSearch ? (
              <span
                aria-hidden
                className="mx-1 h-5 w-px bg-dark-200 dark:bg-dark-700"
              />
            ) : null}
            {showSearch
              ? (slots?.search ?? (
                  <DataTableSearch
                    onChange={onChangeSearch}
                    value={merged.search ?? ""}
                    fieldProps={merged.customProps?.search}
                  />
                ))
              : null}
          </div>
        </div>
      ) : null}

      <div className="relative">
        <Table {...tableProps}>
          <TableHeader {...merged.customProps?.header}>
            <TableRow {...merged.customProps?.row}>
              {headerViews.map((header) => {
                if (header.isSelection) {
                  return (
                    <TableHead
                      key={header.id}
                      align={getHeadAlign(header)}
                      {...getHeadBind(header)}
                    >
                      {selectionMultiple ? (
                        <DataTableSelection
                          kind="page"
                          size={checkboxSize}
                          onChange={onTogglePage}
                          checked={selectAllState.checked}
                          indeterminate={selectAllState.indeterminate}
                          checkboxProps={merged.customProps?.checkbox}
                        />
                      ) : null}
                    </TableHead>
                  );
                }

                if (header.isExpand) {
                  return (
                    <TableHead
                      key={header.id}
                      align={getHeadAlign(header)}
                      {...getHeadBind(header)}
                    />
                  );
                }

                return (
                  <TableHead
                    key={header.id}
                    align={getHeadAlign(header)}
                    {...getHeadBind(header)}
                  >
                    <div className="flex w-full min-w-0 items-center gap-1.5 overflow-hidden leading-none">
                      {header.sortable ? (
                        <DataTableSortButton ariaSort={header.ariaSort}>
                          {header.header}
                        </DataTableSortButton>
                      ) : (
                        header.header
                      )}

                      {header.filterable ? (
                        <DataTableFilterMenu
                          columnId={header.id}
                          active={header.filterActive}
                          values={header.filterValues}
                          options={header.filterOptions}
                          searchable={header.searchable}
                          multiple={header.filterMultiple}
                          searchValue={header.searchQuery}
                          onApply={(values, query) => {
                            onCommitColumnFilter(header.id, values, query);
                          }}
                        />
                      ) : null}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
            {merged.loading && loadingBar ? (
              <TableRow classes={{ root: "h-0" }}>
                <TableCell
                  colSpan={columnCount}
                  classes={{
                    root: "relative h-0 border-0 p-0 after:hidden",
                  }}
                >
                  <div {...loadingBarBind}>
                    {slots?.loading ?? (
                      <Progress
                        size="xs"
                        rounded="none"
                        {...merged.customProps?.progress}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : null}
          </TableHeader>

          <TableBody {...merged.customProps?.body}>
            {showEmpty ? (
              <TableRow>
                <TableCell align="center" colSpan={columnCount}>
                  <div {...emptyBind}>
                    {slots?.empty ?? (
                      <>
                        <span className="relative mb-1 block h-10 w-12 rounded-md border-2 border-dark-300 dark:border-dark-600">
                          <span className="absolute -top-1.5 left-2 right-2 h-2 rounded-sm border-2 border-dark-300 bg-white dark:border-dark-600 dark:bg-dark-900" />
                        </span>
                        {resolveMessage("No data")}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : null}

            {!showEmpty
              ? rowViews.map((row) => {
                  return (
                    <Fragment key={row.id}>
                      <TableRow {...merged.customProps?.row}>
                        {row.cells.map((cell) => {
                          if (cell.isSelection) {
                            return (
                              <TableCell
                                key={cell.id}
                                align={getCellAlign(cell)}
                                {...getCellBind(cell)}
                              >
                                <DataTableSelection
                                  kind="row"
                                  value={row.id}
                                  size={checkboxSize}
                                  name={selectionName}
                                  checked={row.selected}
                                  multiple={selectionMultiple}
                                  radioProps={merged.customProps?.radio}
                                  checkboxProps={merged.customProps?.checkbox}
                                  onChange={(checked) => {
                                    onToggleRow(row.id, checked);
                                  }}
                                />
                              </TableCell>
                            );
                          }

                          if (cell.isExpand) {
                            return (
                              <TableCell
                                key={cell.id}
                                align={getCellAlign(cell)}
                                {...getCellBind(cell)}
                              >
                                <button
                                  type="button"
                                  aria-label="Expand row"
                                  aria-expanded={row.expanded}
                                  onClick={() => {
                                    onToggleExpand(row.id, !row.expanded);
                                  }}
                                  className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm leading-none hover:bg-dark-500/10 dark:hover:bg-dark-500/15"
                                >
                                  <span
                                    className={cn({
                                      "inline-flex transition-transform duration-200 motion-reduce:transition-none": true,
                                      "rotate-90": row.expanded,
                                    })}
                                  >
                                    <Icon size="sm" icon="chevronRight" />
                                  </span>
                                </button>
                              </TableCell>
                            );
                          }

                          return (
                            <TableCell
                              key={cell.id}
                              align={getCellAlign(cell)}
                              {...getCellBind(cell)}
                            >
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
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      {expandEnabled ? (
                        <TableRow>
                          <TableCell
                            colSpan={columnCount}
                            classes={{
                              root: cn({
                                "p-0": true,
                                "border-0": !row.expanded,
                              }),
                            }}
                          >
                            <div
                              aria-hidden={!row.expanded}
                              className={cn({
                                "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none": true,
                                "grid-rows-[1fr]": row.expanded,
                                "grid-rows-[0fr]": !row.expanded,
                              })}
                            >
                              <div className="min-h-0 overflow-hidden">
                                <div className="p-3">
                                  {slots?.expanded?.(row.original)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </Fragment>
                  );
                })
              : null}
          </TableBody>

          {summaryCells ? (
            <TableFooter>
              <TableRow {...merged.customProps?.row}>
                {summaryCells.map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      align={getCellAlign(cell)}
                      {...getCellBind(cell)}
                    >
                      {cell.content}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableFooter>
          ) : null}
        </Table>
        {merged.loading ? (
          <div {...loadingBind} aria-hidden={loadingBar || undefined}>
            {!loadingBar ? (slots?.loading ?? <DataTableLoadingSpin />) : null}
          </div>
        ) : null}
      </div>

      {showFooter ? <div {...footerBind}>{slots?.footer}</div> : null}

      {showPagination ? (
        <div {...paginationBind}>
          {showPerPage
            ? renderDataTableSlot(
                slots?.perPage,
                perPageSlotProps,
                <Select
                  size="sm"
                  clearable={false}
                  aria-label="Rows per page"
                  {...merged.customProps?.perPage}
                  value={perPageSlotProps.perPage}
                  options={perPageSlotProps.options.map((value) => {
                    return { value, label: String(value) };
                  })}
                  onChange={(value) => {
                    const next = Number(value);

                    if (!Number.isFinite(next) || next < 1) {
                      return;
                    }

                    perPageSlotProps.onPerPageChange(next);
                  }}
                />,
              )
            : null}

          {renderDataTableSlot(
            slots?.pagination,
            paginationSlotProps,
            resolvedPageCount !== undefined ? (
              <Pagination
                page={paginationSlotProps.page}
                count={paginationSlotProps.count}
                variant={paginationSlotProps.variant}
                {...merged.customProps?.pagination}
                onChange={paginationSlotProps.onPageChange}
              />
            ) : null,
          )}
        </div>
      ) : null}
    </div>
  );
}

export default DataTable;
