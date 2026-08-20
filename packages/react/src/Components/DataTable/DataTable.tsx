// ** External Imports
import { Fragment, useId, type ReactNode } from "react";

// ** Local Imports
import type {
  DataTableItemSlotProps,
  DataTableProps,
} from "@/Components/DataTable/dataTable.types";
import { DataTableColumnsMenu } from "@/Components/DataTable/DataTableColumnsMenu";
import { DataTableFilterMenu } from "@/Components/DataTable/DataTableFilterMenu";
import { DataTableSelection } from "@/Components/DataTable/DataTableSelection";
import { DataTableSortButton } from "@/Components/DataTable/DataTableSortButton";
import {
  useDataTable,
  type DataTableCellView,
} from "@/Components/DataTable/hooks/useDataTable";
import { Icon } from "@/Components/Icon";
import { Pagination } from "@/Components/Pagination";
import { Spinner } from "@/Components/Spinner";
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
  loading: false,
  striped: false,
  variant: "plain",
  hoverable: false,
  stickyHeader: false,
  paginationAlign: "end",
  selectionMode: "multiple",
} as const;

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

function DataTable<T>(props: DataTableProps<T>) {
  const {
    slots,
    merged,
    rowViews,
    rootBind,
    emptyBind,
    showEmpty,
    tableProps,
    getHeadBind,
    headerViews,
    loadingBind,
    onToggleRow,
    toolbarBind,
    getCellBind,
    columnCount,
    serverPaged,
    showToolbar,
    getHeadAlign,
    getCellAlign,
    onTogglePage,
    onToggleSort,
    summaryCells,
    paginationBind,
    selectAllState,
    showPagination,
    onToggleExpand,
    visibilityItems,
    paginationVariant,
    selectionMultiple,
    visibilityEnabled,
    onCommitColumnFilter,
    onToggleColumnVisibility,
  } = useDataTable(props, dataTableLibDefaults);

  const selectionName = useId();
  const checkboxSize = merged.size === "lg" ? "md" : "sm";

  return (
    <div {...rootBind}>
      {showToolbar ? (
        <div {...toolbarBind}>
          <div className="min-w-0 flex-1">{slots?.toolbar}</div>
          {visibilityEnabled ? (
            <DataTableColumnsMenu
              items={visibilityItems}
              onToggle={onToggleColumnVisibility}
            />
          ) : null}
        </div>
      ) : null}

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
                  <div className="flex min-w-0 items-center gap-1.5 overflow-hidden leading-none">
                    {header.sortable ? (
                      <DataTableSortButton
                        icon={header.sortIcon}
                        onClick={() => {
                          onToggleSort(header.id);
                        }}
                      >
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
                        multiple={header.filterMultiple}
                        onApply={(values) => {
                          onCommitColumnFilter(header.id, values);
                        }}
                      />
                    ) : null}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody {...merged.customProps?.body}>
          {merged.loading && slots?.loading === undefined ? (
            <TableRow>
              <TableCell align="center" colSpan={columnCount}>
                <div {...loadingBind}>
                  <Spinner {...merged.customProps?.spinner} />
                </div>
              </TableCell>
            </TableRow>
          ) : null}

          {merged.loading && slots?.loading ? (
            <TableRow>
              <TableCell align="center" colSpan={columnCount}>
                <div {...loadingBind}>{slots.loading}</div>
              </TableCell>
            </TableRow>
          ) : null}

          {showEmpty ? (
            <TableRow>
              <TableCell align="center" colSpan={columnCount}>
                <div {...emptyBind}>{slots?.empty}</div>
              </TableCell>
            </TableRow>
          ) : null}

          {!merged.loading
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
                                <Icon
                                  size="sm"
                                  icon={
                                    row.expanded
                                      ? "chevronDown"
                                      : "chevronRight"
                                  }
                                />
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
                    {row.expanded ? (
                      <TableRow>
                        <TableCell colSpan={columnCount}>
                          {slots?.expanded?.(row.original)}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })
            : null}
        </TableBody>

        {summaryCells ? (
          <TableFooter {...merged.customProps?.footer}>
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
