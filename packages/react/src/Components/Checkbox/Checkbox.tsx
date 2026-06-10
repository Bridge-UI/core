// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import type { CheckboxProps } from "@/Components/Checkbox/checkbox.types";
import { useCheckbox } from "@/Components/Checkbox/hooks/useCheckbox";
import { FormControl } from "@/Components/FormControl";

function Checkbox(props: CheckboxProps) {
  const {
    checked,
    iconBind,
    CheckIcon,
    fieldBind,
    inputBind,
    formControl,
    controlBind,
  } = useCheckbox(props, {
    size: "md",
    rounded: "sm",
    color: "primary",
  });

  return (
    <FormControl field={formControl}>
      <label htmlFor={formControl.controlId} {...fieldBind}>
        <input {...inputBind} />

        <span {...controlBind}>
          {checked && !props.indeterminate && (
            <CheckIcon
              strokeWidth={3}
              className={cn("h-[65%] w-[65%]", iconBind.className)}
            />
          )}

          {props.indeterminate && (
            <span className="block h-0.5 w-[55%] rounded-full bg-white" />
          )}
        </span>
      </label>
    </FormControl>
  );
}

export default Checkbox;
