// ** External Imports
import { Fragment } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { usePasswordField } from "@/Components/PasswordField/hooks/usePasswordField";
import type { PasswordFieldProps } from "@/Components/PasswordField/passwordField.types";
import { mergePartBind, resolveFieldAdornmentIconSize } from "@/Utils";

function PasswordField(props: PasswordFieldProps) {
  const resolveMessage = useResolveMessage();

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
                      ? resolveMessage("Hide password")
                      : resolveMessage("Show password"),
                  },
                  cn({
                    "bridge-end-adornment bridge-field-adornment-button inline-flex h-auto! min-h-0 self-stretch overflow-hidden items-center justify-center px-2.5": true,
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
