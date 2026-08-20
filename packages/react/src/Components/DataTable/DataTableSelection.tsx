// ** Local Imports
import { Checkbox } from "@/Components/Checkbox";
import type { CheckboxProps } from "@/Components/Checkbox/checkbox.types";
import type { DataTableCustomProps } from "@/Components/DataTable/dataTable.types";
import { Radio } from "@/Components/Radio";

/**
 * Internal row / page selection control. Not part of the public API.
 */
export function DataTableSelection({
  kind,
  name,
  size,
  value,
  checked,
  multiple,
  onChange,
  radioProps,
  checkboxProps,
  indeterminate,
}: {
  checkboxProps?: DataTableCustomProps["checkbox"];
  checked: boolean;
  indeterminate?: boolean;
  kind: "row" | "page";
  multiple?: boolean;
  name?: string;
  onChange: (checked: boolean) => void;
  radioProps?: DataTableCustomProps["radio"];
  size: CheckboxProps["size"];
  value?: string;
}) {
  const ariaLabel = kind === "page" ? "Select all rows" : "Select row";

  if (kind === "page" || multiple) {
    return (
      <Checkbox
        size={size}
        hideErrorMessage
        checked={checked}
        aria-label={ariaLabel}
        indeterminate={indeterminate}
        {...checkboxProps}
        onChange={(event) => {
          onChange(event.currentTarget.checked);
        }}
      />
    );
  }

  return (
    <Radio
      size={size}
      name={name}
      value={value}
      hideErrorMessage
      checked={checked}
      aria-label={ariaLabel}
      {...radioProps}
      onChange={() => {
        onChange(true);
      }}
    />
  );
}
