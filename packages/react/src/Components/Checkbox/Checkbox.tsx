// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import type { CheckboxProps } from "@/Components/Checkbox/checkbox.types";
import { useCheckbox } from "@/Components/Checkbox/hooks/useCheckbox";
import { Switcher } from "@/Components/Switcher";

function Checkbox(props: CheckboxProps) {
  const {
    switcher,
    checked,
    inputBind,
    iconBind,
    controlBind,
    fieldBind,
    CheckIcon,
  } = useCheckbox(props, {
    size: "sm",
    color: "primary",
    rounded: "sm",
  });

  return (
    <Switcher field={switcher}>
      <span {...fieldBind}>
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
      </span>
    </Switcher>
  );
}

export default Checkbox;
