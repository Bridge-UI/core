// ** External Imports
import type { ReactNode } from "react";

// ** Core Imports
import type { DataTableSortIcon } from "@bridge-ui/core/Domain";

// ** Local Imports
import { Icon } from "@/Components/Icon";

/**
 * Internal sortable header trigger. Not part of the public API.
 */
export function DataTableSortButton({
  icon,
  onClick,
  children,
}: {
  children: ReactNode;
  icon: DataTableSortIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-w-0 cursor-pointer items-center gap-1.5 p-0 leading-none"
    >
      {children}
      <span className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm leading-none hover:bg-dark-500/10 dark:hover:bg-dark-500/15">
        <Icon size="sm" icon={icon} />
      </span>
    </button>
  );
}
