// ** Local Imports
import { Checkbox } from "@/Components/Checkbox";
import type { DataTableProps } from "@/Components/DataTable/dataTable.types";
import { useDataTable } from "@/Components/DataTable/hooks/useDataTable";
import { Icon } from "@/Components/Icon";
import { Pagination } from "@/Components/Pagination";
import { Spinner } from "@/Components/Spinner";

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
    onTogglePage,
    onToggleSort,
    spanCellBind,
    bodyGroupBind,
    headerRowBind,
    paginationBind,
    selectAllState,
    showPagination,
    headerGroupBind,
    paginationVariant,
  } = useDataTable(props, dataTableLibDefaults);

  const checkboxSize = merged.size === "lg" ? "md" : "sm";

  return (
    <div {...rootBind}>
      {slots?.toolbar ? <div {...toolbarBind}>{slots.toolbar}</div> : null}

      <div {...wrapperBind}>
        <div {...tableBind}>
          <div {...headerGroupBind}>
            <div {...headerRowBind}>
              {headerViews.map((header) => {
                if (header.isSelection) {
                  return (
                    <div key={header.id} {...getHeadBind(header)}>
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
                    </div>
                  );
                }

                return (
                  <div key={header.id} {...getHeadBind(header)}>
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
                    <div key={row.id} {...bodyRowBind}>
                      {row.cells.map((cell) => {
                        if (cell.isSelection) {
                          return (
                            <div key={cell.id} {...getCellBind(cell)}>
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
                            </div>
                          );
                        }

                        return (
                          <div key={cell.id} {...getCellBind(cell)}>
                            {cell.content}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              : null}
          </div>
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
