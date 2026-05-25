// ** External Imports
import { Eye, EyeOff } from "lucide-react";
import { Fragment } from "react";

// ** Core Imports
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
              className={cn({
                "inline-flex items-center justify-center text-gray-500 transition-colors": true,
                "disabled:pointer-events-none disabled:opacity-50": true,
                "hover:text-gray-700 dark:hover:text-gray-300": true,
                [classes?.toggle ?? ""]: true,
              })}
            >
              <Icon
                icon={isVisible ? EyeOff : Eye}
                size={textFieldProps.size ?? "md"}
              />
            </button>
          </Fragment>
        ),
      }}
    />
  );
}

export default PasswordField;
