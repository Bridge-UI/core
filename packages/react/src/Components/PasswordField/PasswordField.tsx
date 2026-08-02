// ** External Imports
import { Fragment } from "react";

// ** Core Imports
import { cn, resolveMessage } from "@bridge-ui/core";

// ** Local Imports
import { useI18nAdapter } from "@/Adapters/I18n";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { usePasswordField } from "@/Components/PasswordField/hooks/usePasswordField";
import type { PasswordFieldProps } from "@/Components/PasswordField/passwordField.types";
import { mergePartBind, resolveFieldAdornmentIconSize } from "@/Utils";

function PasswordField(props: PasswordFieldProps) {
  const i18n = useI18nAdapter();
  const { formField, inputBind, isVisible, mergedClasses, toggleVisibility } =
    usePasswordField(props);

  const toggleProps = props.customProps?.toggle;
  const toggleIconProps = props.customProps?.toggleIcon;

  return (
    <FormField
      field={{
        ...formField,
        slots: {
          ...props.slots,
          end: (
            <Fragment>
              <button
                {...mergePartBind(
                  toggleProps,
                  {
                    type: "button",
                    disabled: props.disabled,
                    onClick: toggleVisibility,
                    "aria-label": isVisible
                      ? resolveMessage("Hide password", i18n)
                      : resolveMessage("Show password", i18n),
                  },
                  cn({
                    "bridge-end-adornment bridge-field-adornment-button inline-flex h-full items-center justify-center px-2.5": true,
                    [mergedClasses.toggle ?? ""]: true,
                  }),
                )}
              >
                <Icon
                  icon={isVisible ? "eyeOff" : "eye"}
                  size={resolveFieldAdornmentIconSize(props.size)}
                  {...toggleIconProps}
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
