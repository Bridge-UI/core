// ** External Imports
import { get } from "es-toolkit/compat";
import { Eye, EyeOff } from "lucide-react";
import { Fragment } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import type { IconSize } from "@bridge-ui/core/Components/Icon";
import type { TextFieldSize } from "@bridge-ui/core/Components/TextField";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { usePasswordField } from "@/Components/PasswordField/hooks/usePasswordField";
import type { PasswordFieldProps } from "@/Components/PasswordField/passwordField.types";
import { TextField } from "@/Components/TextField";
import { useTextFieldEndAdornment } from "@/Utils";

// prettier-ignore
function resolveToggleIconSize(fieldSize?: keyof TextFieldSize) {
  return get({
    "2xs": "xs",
    "xs": "xs",
    "sm": "sm",
    "md": "md",
    "lg": "md",
    "xl": "lg",
    "2xl": "lg",
  }, fieldSize ?? "md") as keyof IconSize;
}

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

  const { isVisible, toggleVisibility } = usePasswordField({
    visible,
    onVisibilityChange,
  });

  const { endAdornmentClass } = useTextFieldEndAdornment(
    {
      color,
      error,
      rounded,
      variant,
    },
    {
      rounded: "md",
      color: "primary",
      variant: "outline",
    },
  );

  return (
    <TextField
      {...textFieldProps}
      color={color}
      error={error}
      classes={classes}
      rounded={rounded}
      variant={variant}
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
              className={cn(endAdornmentClass, "px-2.5", classes?.toggle)}
            >
              <Icon
                icon={isVisible ? EyeOff : Eye}
                size={resolveToggleIconSize(textFieldProps.size)}
              />
            </button>
          </Fragment>
        ),
      }}
    />
  );
}

export default PasswordField;
