// ** External Imports
import { Eye, EyeOff } from "lucide-react";
import { Fragment } from "react";

// ** Core Imports
import {
  fieldToggleButtonClasses,
  resolveAdornmentIconSize,
} from "@/Components/TextField/fieldAdornment";
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { usePasswordField } from "@/Components/PasswordField/hooks/usePasswordField";
import type { PasswordFieldProps } from "@/Components/PasswordField/passwordField.types";
import { TextField } from "@/Components/TextField";

function PasswordField(props: PasswordFieldProps) {
  // prettier-ignore
  const { slots, classes, visible, onVisibilityChange, ...textFieldProps } = props;

  const { isVisible, toggleVisibility } = usePasswordField({
    visible,
    onVisibilityChange,
  });

  return (
    <TextField
      {...textFieldProps}
      classes={classes}
      withErrorIcon={false}
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
              className={cn(fieldToggleButtonClasses, classes?.toggle)}
            >
              <Icon
                icon={isVisible ? EyeOff : Eye}
                size={resolveAdornmentIconSize(textFieldProps.size)}
              />
            </button>
          </Fragment>
        ),
      }}
    />
  );
}

export default PasswordField;
