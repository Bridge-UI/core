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
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500/40": true,
                "inline-flex h-full min-h-0 shrink-0 items-center justify-center self-stretch px-2.5": true,
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50": true,
                "dark:hover:bg-gray-700/50 dark:hover:text-gray-300 dark:active:bg-gray-600": true,
                "cursor-pointer rounded-sm text-gray-500 transition-colors": true,
                "hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200": true,
                [classes?.toggle ?? ""]: true,
              })}
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
