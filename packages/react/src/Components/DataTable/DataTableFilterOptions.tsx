// ** Core Imports
import type { DataTableFilterOption } from "@bridge-ui/core/Domain";

// ** Local Imports
import { Checkbox } from "@/Components/Checkbox";
import { Radio } from "@/Components/Radio";
import { derived } from "@/Utils";

/**
 * Internal nested filter option list. Not part of the public API.
 */
export function DataTableFilterOptions({
  name,
  draft,
  options,
  multiple,
  onToggle,
  size = "sm",
}: {
  draft: string[];
  multiple: boolean;
  name: string;
  onToggle: (value: string, selected: boolean) => void;
  options: DataTableFilterOption[];
  size?: "md" | "sm";
}) {
  return (
    <>
      {options.map((option) => {
        if (option.children && option.children.length > 0) {
          return (
            <div key={option.value} className="min-w-0">
              <div className="px-2 py-1 text-xs font-medium text-dark-500 dark:text-dark-400">
                {option.label}
              </div>

              <div className="ps-2">
                <DataTableFilterOptions
                  name={name}
                  size={size}
                  draft={draft}
                  multiple={multiple}
                  onToggle={onToggle}
                  options={option.children}
                />
              </div>
            </div>
          );
        }

        const selected = derived(() => {
          if (multiple) {
            return draft.includes(option.value);
          }

          return draft[0] === option.value;
        });

        return (
          <div
            key={option.value}
            aria-checked={selected}
            role={multiple ? "menuitemcheckbox" : "menuitemradio"}
            onClick={() => {
              onToggle(option.value, !selected);
            }}
            className="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-start hover:bg-black/5 dark:hover:bg-white/10"
          >
            {multiple ? (
              <Checkbox
                size={size}
                hideErrorMessage
                checked={selected}
                endLabel={option.label}
                classes={{ root: "pointer-events-none" }}
              />
            ) : (
              <Radio
                size={size}
                name={name}
                hideErrorMessage
                checked={selected}
                value={option.value}
                endLabel={option.label}
                classes={{ root: "pointer-events-none" }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
