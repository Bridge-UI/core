// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { TextField } from "@/Components/TextField";
import type { TextFieldProps } from "@/Components/TextField/textField.types";

/**
 * Internal toolbar search field. Not part of the public API.
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
  const label = resolveMessage("Search");

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
        root: cn("w-52", fieldProps?.classes?.root),
      }}
    />
  );
}
