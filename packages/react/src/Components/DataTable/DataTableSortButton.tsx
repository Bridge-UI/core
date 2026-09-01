// ** Core Imports
import {
  getDataTableSortLabel,
  type DataTableAriaSort,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Icon } from "@/Components/Icon";

/**
 * Internal sort control. Same chrome as the column filter button.
 */
export function DataTableSortButton({
  onClick,
  ariaSort,
}: {
  ariaSort: DataTableAriaSort;
  onClick: () => void;
}) {
  const resolveMessage = useResolveMessage();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={resolveMessage(getDataTableSortLabel(ariaSort))}
      className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm leading-none hover:bg-dark-500/10 dark:hover:bg-dark-500/15"
    >
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
    </button>
  );
}
