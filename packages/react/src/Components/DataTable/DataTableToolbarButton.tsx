// ** Local Imports
import { Button } from "@/Components/Button";
import type { DataTableCustomProps } from "@/Components/DataTable/dataTable.types";
import { Tooltip } from "@/Components/Tooltip";

/**
 * Internal icon-only toolbar control. Not part of the public API.
 */
export function DataTableToolbarButton({
  icon,
  label,
  onClick,
  buttonProps,
}: {
  buttonProps?: DataTableCustomProps["export"];
  icon: "search" | "columns" | "download";
  label: string;
  onClick?: () => void;
}) {
  return (
    <Tooltip
      content={label}
      slots={{
        trigger: (
          <Button
            size="sm"
            icon={icon}
            color="dark"
            type="button"
            density="mini"
            onClick={onClick}
            aria-label={label}
            {...buttonProps}
          />
        ),
      }}
    />
  );
}
