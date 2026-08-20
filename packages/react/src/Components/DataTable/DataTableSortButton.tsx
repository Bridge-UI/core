// ** External Imports
import type { ReactNode } from "react";

// ** Core Imports
import {
  getDataTableSortTooltip,
  type DataTableAriaSort,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Icon } from "@/Components/Icon";
import { Tooltip } from "@/Components/Tooltip";

/**
 * Internal sortable header chrome. Click-to-sort lives on the `th`.
 */
export function DataTableSortButton({
  ariaSort,
  children,
}: {
  ariaSort: DataTableAriaSort;
  children: ReactNode;
}) {
  const resolveMessage = useResolveMessage();
  const tooltip = resolveMessage(getDataTableSortTooltip(ariaSort));

  const trigger = (
    <span className="inline-flex min-w-0 flex-1 items-center gap-1.5 leading-none">
      <span className="min-w-0 truncate leading-none">{children}</span>
      <span className="inline-flex h-6 w-5 shrink-0 flex-col items-center justify-center leading-none">
        <Icon
          size="lg"
          icon="chevronUp"
          className={cn({
            "-mb-1": true,
            "text-dark-800 dark:text-dark-100": ariaSort === "ascending",
            "text-dark-300 dark:text-dark-600": ariaSort !== "ascending",
          })}
        />
        <Icon
          size="lg"
          icon="chevronDown"
          className={cn({
            "text-dark-800 dark:text-dark-100": ariaSort === "descending",
            "text-dark-300 dark:text-dark-600": ariaSort !== "descending",
          })}
        />
      </span>
    </span>
  );

  return (
    <Tooltip
      content={tooltip}
      slots={{ trigger }}
      customProps={{
        root: { className: "min-w-0 max-w-none flex-1" },
        trigger: { className: "min-w-0 max-w-none flex-1" },
      }}
    />
  );
}
