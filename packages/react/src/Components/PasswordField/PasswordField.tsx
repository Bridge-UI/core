import { Eye, EyeOff } from "lucide-react";
import { Fragment } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { usePasswordField } from "@/Components/PasswordField/hooks/usePasswordField";
import type { PasswordFieldProps } from "@/Components/PasswordField/passwordField.types";
import { resolveFieldAdornmentIconSize } from "@/Utils";

function PasswordField(props: PasswordFieldProps) {
  const { formField, inputBind, isVisible, mergedClasses, toggleVisibility } =
    usePasswordField(props);

  return (
    <FormField
      field={{
        ...formField,
        slots: {
          ...props.slots,
          end: (
            <Fragment>
              <button
                type="button"
                disabled={props.disabled}
                onClick={toggleVisibility}
                aria-label={isVisible ? "Hide password" : "Show password"}
                className={cn({
                  "bridge-end-adornment bridge-field-adornment-button inline-flex h-full items-center justify-center px-2.5": true,
                  [mergedClasses.toggle ?? ""]: true,
                })}
              >
                <Icon
                  icon={isVisible ? EyeOff : Eye}
                  size={resolveFieldAdornmentIconSize(props.size)}
                />
              </button>
            </Fragment>
          ),
        },
      }}
    >
      <input {...inputBind} />
    </FormField>
  );
}

export default PasswordField;
