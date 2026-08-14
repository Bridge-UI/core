// ** Local Imports
import { Icon } from "@/Components/Icon";
import { usePagination } from "@/Components/Pagination/hooks/usePagination";
import type { PaginationProps } from "@/Components/Pagination/pagination.types";

const paginationLibDefaults = {
  size: "md",
  defaultPage: 1,
  variant: "text",
  disabled: false,
  siblingCount: 1,
  mode: "numbered",
  color: "primary",
  boundaryCount: 1,
  hideNextButton: false,
  hidePrevButton: false,
} as const;

function Pagination(props: PaginationProps) {
  const {
    slots,
    entries,
    showPrev,
    showNext,
    rootBind,
    listBind,
    prevBind,
    nextBind,
    getItemBind,
    prevIconBind,
    nextIconBind,
    getEllipsisBind,
  } = usePagination(props, paginationLibDefaults);

  return (
    <nav {...rootBind}>
      <ul {...listBind}>
        {showPrev ? (
          <li className="contents">
            <button {...prevBind}>
              {slots?.prev ?? <Icon icon="chevronLeft" {...prevIconBind} />}
            </button>
          </li>
        ) : null}

        {entries.map((entry, index) => {
          if (entry.type === "ellipsis") {
            return (
              <li key={`ellipsis-${index}`} {...getEllipsisBind(index)}>
                {slots?.ellipsis ?? "…"}
              </li>
            );
          }

          return (
            <li key={entry.page} className="contents">
              <button {...getItemBind(entry.page)}>{entry.page}</button>
            </li>
          );
        })}

        {showNext ? (
          <li className="contents">
            <button {...nextBind}>
              {slots?.next ?? <Icon icon="chevronRight" {...nextIconBind} />}
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

export default Pagination;
