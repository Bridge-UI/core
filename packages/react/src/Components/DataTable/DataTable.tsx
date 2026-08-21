// ** External Imports
import { isFunction } from "es-toolkit/compat";
import { Fragment, memo, useId, useState, type ReactNode } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DataTableCustomProps,
  DataTableItemSlotProps,
  DataTableProps,
} from "@/Components/DataTable/dataTable.types";
import { DataTableColumnsMenu } from "@/Components/DataTable/DataTableColumnsMenu";
import { DataTableFilterMenu } from "@/Components/DataTable/DataTableFilterMenu";
import { DataTableSearch } from "@/Components/DataTable/DataTableSearch";
import { DataTableSelection } from "@/Components/DataTable/DataTableSelection";
import { DataTableSortButton } from "@/Components/DataTable/DataTableSortButton";
import {
  useDataTable,
  type DataTableCellView,
  type DataTableHeaderView,
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
import { hasNamedSlot } from "@/Utils";

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
  const [tooltipReady, setTooltipReady] = useState(false);

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

  if (!tooltipReady) {
    return (
      <div
        className="block min-w-0 w-full max-w-full"
        onFocusCapture={() => {
          setTooltipReady(true);
        }}
        onPointerEnter={() => {
          setTooltipReady(true);
        }}
      >
        {truncated}
      </div>
    );
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

type DataTableHeadBind = ReturnType<
  ReturnType<typeof useDataTable>["getHeadBind"]
>;
type DataTableCellBind = ReturnType<
  ReturnType<typeof useDataTable>["getCellBind"]
>;

const DataTableHeadCell = memo(function DataTableHeadCell({
  header,
  getHeadBind,
  checkboxSize,
  getHeadAlign,
  onTogglePage,
  checkboxProps,
  selectAllState,
  selectionMultiple,
  onCommitColumnFilter,
}: {
  checkboxProps?: DataTableCustomProps["checkbox"];
  checkboxSize: "md" | "sm";
  getHeadAlign: (
    header: DataTableHeaderView,
  ) => "center" | DataTableHeaderView["align"];
  getHeadBind: (header: DataTableHeaderView) => DataTableHeadBind;
  header: DataTableHeaderView;
  onCommitColumnFilter: (
    columnId: string,
    values: string[],
    query: string,
  ) => void;
  onTogglePage: (selectAll: boolean) => void;
  selectAllState: { checked: boolean; indeterminate: boolean };
  selectionMultiple: boolean;
}) {
  if (header.isSelection) {
    return (
      <TableHead align={getHeadAlign(header)} {...getHeadBind(header)}>
        {selectionMultiple ? (
          <DataTableSelection
            kind="page"
            size={checkboxSize}
            onChange={onTogglePage}
            checkboxProps={checkboxProps}
            checked={selectAllState.checked}
            indeterminate={selectAllState.indeterminate}
          />
        ) : null}
      </TableHead>
    );
  }

  if (header.isExpand) {
    return <TableHead align={getHeadAlign(header)} {...getHeadBind(header)} />;
  }

  return (
    <TableHead align={getHeadAlign(header)} {...getHeadBind(header)}>
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
});

const DataTableBodyCell = memo(function DataTableBodyCell({
  cell,
  content,
  getCellBind,
  getCellAlign,
}: {
  cell: DataTableCellView;
  content: ReactNode;
  getCellAlign: (
    cell: DataTableCellView,
  ) => "center" | DataTableCellView["align"];
  getCellBind: (cell: DataTableCellView) => DataTableCellBind;
}) {
  return (
    <TableCell align={getCellAlign(cell)} {...getCellBind(cell)}>
      <DataTableCellContent
        cell={{
          ...cell,
          content,
        }}
      />
    </TableCell>
  );
});

const DataTableSelectionCell = memo(function DataTableSelectionCell({
  cell,
  rowId,
  selected,
  radioProps,
  getCellBind,
  onToggleRow,
  checkboxSize,
  getCellAlign,
  selectionName,
  checkboxProps,
  selectionMultiple,
}: {
  cell: DataTableCellView;
  checkboxProps?: DataTableCustomProps["checkbox"];
  checkboxSize: "md" | "sm";
  getCellAlign: (
    cell: DataTableCellView,
  ) => "center" | DataTableCellView["align"];
  getCellBind: (cell: DataTableCellView) => DataTableCellBind;
  onToggleRow: (rowId: string, selected: boolean) => void;
  radioProps?: DataTableCustomProps["radio"];
  rowId: string;
  selected: boolean;
  selectionMultiple: boolean;
  selectionName: string;
}) {
  return (
    <TableCell align={getCellAlign(cell)} {...getCellBind(cell)}>
      <DataTableSelection
        kind="row"
        value={rowId}
        checked={selected}
        size={checkboxSize}
        name={selectionName}
        radioProps={radioProps}
        multiple={selectionMultiple}
        checkboxProps={checkboxProps}
        onChange={(checked) => {
          onToggleRow(rowId, checked);
        }}
      />
    </TableCell>
  );
});

const DataTableExpandCell = memo(function DataTableExpandCell({
  cell,
  rowId,
  expanded,
  getCellBind,
  getCellAlign,
  onToggleExpand,
}: {
  cell: DataTableCellView;
  expanded: boolean;
  getCellAlign: (
    cell: DataTableCellView,
  ) => "center" | DataTableCellView["align"];
  getCellBind: (cell: DataTableCellView) => DataTableCellBind;
  onToggleExpand: (rowId: string, expanded: boolean) => void;
  rowId: string;
}) {
  return (
    <TableCell align={getCellAlign(cell)} {...getCellBind(cell)}>
      <button
        type="button"
        aria-label="Expand row"
        aria-expanded={expanded}
        onClick={() => {
          onToggleExpand(rowId, !expanded);
        }}
        className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm leading-none hover:bg-dark-500/10 dark:hover:bg-dark-500/15"
      >
        <span
          className={cn({
            "inline-flex transition-transform duration-200 motion-reduce:transition-none": true,
            "rotate-90": expanded,
          })}
        >
          <Icon size="sm" icon="chevronRight" />
        </span>
      </button>
    </TableCell>
  );
});

function DataTable<T>(props: DataTableProps<T>) {
  const {
    slots,
    merged,
    rowViews,
    rootBind,
    emptyBind,
    showEmpty,
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
  const perPageCustom = merged.customProps?.perPage;
  const checkboxSize = merged.size === "lg" ? "md" : "sm";

  return (
    <div {...rootBind}>
      {showToolbar ? (
        <div {...toolbarBind}>
          <div className="min-w-0 flex-1">{slots?.toolbar}</div>

          <div className="flex shrink-0 items-center gap-2">
            {visibilityEnabled ? (
              <div className="inline-flex items-center rounded-lg border border-dark-200 bg-white p-0.5 dark:border-dark-700 dark:bg-dark-900">
                <DataTableColumnsMenu
                  items={visibilityItems}
                  onToggle={onToggleColumnVisibility}
                />
              </div>
            ) : null}

            {slots?.toolbarActions}

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
                return (
                  <DataTableHeadCell
                    key={header.id}
                    header={header}
                    getHeadBind={getHeadBind}
                    getHeadAlign={getHeadAlign}
                    checkboxSize={checkboxSize}
                    onTogglePage={onTogglePage}
                    selectAllState={selectAllState}
                    selectionMultiple={selectionMultiple}
                    onCommitColumnFilter={onCommitColumnFilter}
                    checkboxProps={merged.customProps?.checkbox}
                  />
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
                              <DataTableSelectionCell
                                cell={cell}
                                key={cell.id}
                                rowId={row.id}
                                selected={row.selected}
                                getCellBind={getCellBind}
                                onToggleRow={onToggleRow}
                                getCellAlign={getCellAlign}
                                checkboxSize={checkboxSize}
                                selectionName={selectionName}
                                selectionMultiple={selectionMultiple}
                                radioProps={merged.customProps?.radio}
                                checkboxProps={merged.customProps?.checkbox}
                              />
                            );
                          }

                          if (cell.isExpand) {
                            return (
                              <DataTableExpandCell
                                cell={cell}
                                key={cell.id}
                                rowId={row.id}
                                expanded={row.expanded}
                                getCellBind={getCellBind}
                                getCellAlign={getCellAlign}
                                onToggleExpand={onToggleExpand}
                              />
                            );
                          }

                          return (
                            <DataTableBodyCell
                              cell={cell}
                              key={cell.id}
                              getCellBind={getCellBind}
                              getCellAlign={getCellAlign}
                              content={resolveDataTableItemContent(
                                slots?.item?.[cell.id],
                                row.original,
                                cell,
                              )}
                            />
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

      {hasNamedSlot(slots, "footer") ? (
        <div {...footerBind}>{slots?.footer}</div>
      ) : null}

      {showPagination ? (
        <div {...paginationBind}>
          {showPerPage
            ? renderDataTableSlot(
                slots?.perPage,
                perPageSlotProps,
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm whitespace-nowrap text-dark-500 dark:text-dark-400">
                    {resolveMessage("Per page:")}
                  </span>
                  <Select
                    size="sm"
                    hideErrorMessage
                    clearable={false}
                    aria-label="Per page"
                    {...perPageCustom}
                    overlay="menu"
                    value={perPageSlotProps.perPage}
                    options={perPageSlotProps.options.map((value) => {
                      return { value, label: String(value) };
                    })}
                    classes={{
                      ...perPageCustom?.classes,
                      root: cn("w-20", perPageCustom?.classes?.root),
                    }}
                    onChange={(value) => {
                      const next = Number(value);

                      if (!Number.isFinite(next) || next < 1) {
                        return;
                      }

                      perPageSlotProps.onPerPageChange(next);
                    }}
                    customProps={{
                      ...perPageCustom?.customProps,
                      listbox: {
                        showCheckmark: false,
                        ...perPageCustom?.customProps?.listbox,
                        customProps: {
                          ...perPageCustom?.customProps?.listbox?.customProps,
                          menu: {
                            matchWidth: true,
                            ...perPageCustom?.customProps?.listbox?.customProps
                              ?.menu,
                          },
                        },
                      },
                    }}
                  />
                </div>,
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

export default memo(DataTable) as typeof DataTable;
