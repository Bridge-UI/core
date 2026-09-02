// ** Local Imports
import type { DataTablePaginationProps } from "@/Components/DataTable/dataTablePagination.types";
import { useDataTablePagination } from "@/Components/DataTable/hooks/useDataTablePagination";
import { Icon } from "@/Components/Icon";

const dataTablePaginationLibDefaults = {
  size: "sm",
  rounded: "md",
  defaultPage: 1,
  disabled: false,
} as const;

function DataTablePagination(props: DataTablePaginationProps) {
  const {
    slots,
    rootBind,
    listBind,
    prevBind,
    nextBind,
    lastBind,
    firstBind,
    prevIconBind,
    nextIconBind,
    lastIconBind,
    firstIconBind,
  } = useDataTablePagination(props, dataTablePaginationLibDefaults);

  return (
    <nav {...rootBind}>
      <ul {...listBind}>
        <li className="contents">
          <button {...firstBind}>
            {slots?.first ?? <Icon icon="chevronsLeft" {...firstIconBind} />}
          </button>
        </li>

        <li className="contents">
          <button {...prevBind}>
            {slots?.prev ?? <Icon icon="chevronLeft" {...prevIconBind} />}
          </button>
        </li>

        <li className="contents">
          <button {...nextBind}>
            {slots?.next ?? <Icon icon="chevronRight" {...nextIconBind} />}
          </button>
        </li>

        <li className="contents">
          <button {...lastBind}>
            {slots?.last ?? <Icon icon="chevronsRight" {...lastIconBind} />}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default DataTablePagination;
