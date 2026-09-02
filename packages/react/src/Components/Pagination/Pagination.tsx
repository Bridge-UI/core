// ** Local Imports
import { Icon } from "@/Components/Icon";
import { usePagination } from "@/Components/Pagination/hooks/usePagination";
import type { PaginationProps } from "@/Components/Pagination/pagination.types";

const paginationLibDefaults = {
  size: "md",
  rounded: "md",
  color: "dark",
  defaultPage: 1,
  disabled: false,
  siblingCount: 1,
  variant: "ghost",
  mode: "numbered",
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
    prevLabel,
    nextLabel,
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
              {slots?.prev ?? (
                <>
                  <Icon icon="chevronLeft" {...prevIconBind} />
                  {prevLabel}
                </>
              )}
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
            <li className="contents" key={`page-${index}`}>
              <button {...getItemBind(entry.page)}>{entry.page}</button>
            </li>
          );
        })}

        {showNext ? (
          <li className="contents">
            <button {...nextBind}>
              {slots?.next ?? (
                <>
                  {nextLabel}
                  <Icon icon="chevronRight" {...nextIconBind} />
                </>
              )}
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

export default Pagination;
