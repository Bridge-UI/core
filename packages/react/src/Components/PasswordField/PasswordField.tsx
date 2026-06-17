import { Eye, EyeOff } from "lucide-react";
import { Fragment } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { usePasswordField } from "@/Components/PasswordField/hooks/usePasswordField";
import { usePasswordFieldClasses } from "@/Components/PasswordField/hooks/usePasswordFieldClasses";
import type { PasswordFieldProps } from "@/Components/PasswordField/passwordField.types";
import { TextField } from "@/Components/TextField";
import { resolveFieldAdornmentIconSize } from "@/Utils";

function PasswordField(props: PasswordFieldProps) {
  const {
    color,
    error,
    slots,
    classes,
    rounded,
    variant,
    visible,
    onVisibilityChange,
    ...textFieldProps
  } = props;

  const mergedClasses = usePasswordFieldClasses({ classes });

  const { isVisible, toggleVisibility } = usePasswordField({
    visible,
    onVisibilityChange,
  });

  return (
    <TextField
      {...textFieldProps}
      color={color}
      error={error}
      rounded={rounded}
      variant={variant}
      withErrorIcon={false}
      classes={mergedClasses}
      type={isVisible ? "text" : "password"}
      slots={{
        ...slots,
        end: (
          <Fragment>
            <button
              type="button"
              onClick={toggleVisibility}
              disabled={textFieldProps.disabled}
              aria-label={isVisible ? "Hide password" : "Show password"}
              className={cn({
                "bridge-end-adornment bridge-field-adornment-button inline-flex h-full items-center justify-center px-2.5": true,
                [mergedClasses.toggle ?? ""]: true,
              })}
            >
              <Icon
                icon={isVisible ? EyeOff : Eye}
                size={resolveFieldAdornmentIconSize(textFieldProps.size)}
              />
            </button>
          </Fragment>
        ),
      }}
    />
  );
}

export default PasswordField;
