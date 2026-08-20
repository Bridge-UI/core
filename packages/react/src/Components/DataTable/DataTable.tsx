// ** Local Imports
import { Checkbox } from "@/Components/Checkbox";
import type { DataTableProps } from "@/Components/DataTable/dataTable.types";
import { useDataTable } from "@/Components/DataTable/hooks/useDataTable";
import { Icon } from "@/Components/Icon";
import { Pagination } from "@/Components/Pagination";
import { Spinner } from "@/Components/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Table";

const dataTableLibDefaults = {
  size: "md",
  full: true,
  loading: false,
  striped: false,
  variant: "plain",
  hoverable: false,
  stickyHeader: false,
} as const;

function DataTable<T>(props: DataTableProps<T>) {
  const {
    slots,
    merged,
    colSpan,
    rowViews,
    rootBind,
    emptyBind,
    showEmpty,
    tableProps,
    headerViews,
    loadingBind,
    onToggleRow,
    toolbarBind,
    onTogglePage,
    onToggleSort,
    paginationBind,
    selectAllState,
    showPagination,
    paginationVariant,
  } = useDataTable(props, dataTableLibDefaults);

  const checkboxSize = merged.size === "lg" ? "md" : "sm";

  return (
    <div {...rootBind}>
      {slots?.toolbar ? <div {...toolbarBind}>{slots.toolbar}</div> : null}

      <Table {...tableProps} aria-busy={merged.loading || undefined}>
        <TableHeader>
          <TableRow>
            {headerViews.map((header) => {
              if (header.isSelection) {
                return (
                  <TableHead align="center" key={header.id}>
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
                  </TableHead>
                );
              }

              return (
                <TableHead
                  key={header.id}
                  align={header.align}
                  aria-sort={header.sortable ? header.ariaSort : undefined}
                  style={header.width ? { width: header.width } : undefined}
                >
                  {header.sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1"
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
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {merged.loading && slots?.loading === undefined ? (
            <TableRow>
              <TableCell align="center" colSpan={colSpan}>
                <div {...loadingBind}>
                  <Spinner {...merged.customProps?.spinner} />
                </div>
              </TableCell>
            </TableRow>
          ) : null}

          {merged.loading && slots?.loading ? (
            <TableRow>
              <TableCell align="center" colSpan={colSpan}>
                <div {...loadingBind}>{slots.loading}</div>
              </TableCell>
            </TableRow>
          ) : null}

          {showEmpty ? (
            <TableRow>
              <TableCell align="center" colSpan={colSpan}>
                <div {...emptyBind}>{slots?.empty}</div>
              </TableCell>
            </TableRow>
          ) : null}

          {!merged.loading
            ? rowViews.map((row) => {
                return (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => {
                      if (cell.isSelection) {
                        return (
                          <TableCell key={cell.id} align="center">
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
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={cell.id}
                          align={cell.align}
                          style={cell.width ? { width: cell.width } : undefined}
                        >
                          {cell.content}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>

      {showPagination ? (
        <div {...paginationBind}>
          {slots?.pagination ??
            (merged.page != null && merged.pageCount != null ? (
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
