// ** External Imports
import { useState } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { DataTableToolbarButton } from "@/Components/DataTable/DataTableToolbarButton";
import { TextField } from "@/Components/TextField";
import type { TextFieldProps } from "@/Components/TextField/textField.types";

/**
 * Internal toolbar search control. Not part of the public API.
 */
export function DataTableSearch({
  value,
  onChange,
  fieldProps,
}: {
  fieldProps?: Partial<Omit<TextFieldProps, "value" | "onChange">>;
  onChange: (query: string) => void;
  value: string;
}) {
  const resolveMessage = useResolveMessage();
  const [open, setOpen] = useState(value.length > 0);
  const label = resolveMessage("Search");
  const expanded = open || value.length > 0;

  if (!expanded) {
    return (
      <DataTableToolbarButton
        icon="search"
        label={label}
        onClick={() => {
          setOpen(true);
        }}
      />
    );
  }

  return (
    <TextField
      size="sm"
      value={value}
      hideErrorMessage
      startIcon="search"
      aria-label={label}
      placeholder={label}
      {...fieldProps}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      classes={{
        ...fieldProps?.classes,
        root: cn("w-48", fieldProps?.classes?.root),
      }}
    />
  );
}
