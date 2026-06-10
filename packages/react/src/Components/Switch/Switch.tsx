// ** Local Imports
import { FormControl } from "@/Components/FormControl";
import { useSwitch } from "@/Components/Switch/hooks/useSwitch";
import type { SwitchProps } from "@/Components/Switch/switch.types";

function Switch(props: SwitchProps) {
  const { fieldBind, inputBind, thumbBind, trackBind, formControl } = useSwitch(
    props,
    {
      size: "md",
      rounded: "full",
      color: "primary",
    },
  );

  return (
    <FormControl field={formControl}>
      <label htmlFor={formControl.controlId} {...fieldBind}>
        <input {...inputBind} />

        <span {...trackBind} />

        <span {...thumbBind} />
      </label>
    </FormControl>
  );
}

export default Switch;
