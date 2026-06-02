// ** Local Imports
import { Switcher } from "@/Components/Switcher";
import { useToggle } from "@/Components/Toggle/hooks/useToggle";
import type { ToggleProps } from "@/Components/Toggle/toggle.types";

function Toggle(props: ToggleProps) {
  const { switcher, fieldBind, inputBind, thumbBind, trackBind } = useToggle(
    props,
    {
      size: "md",
      rounded: "full",
      color: "primary",
    },
  );

  return (
    <Switcher field={switcher}>
      <label htmlFor={switcher.controlId} {...fieldBind}>
        <input {...inputBind} />

        <span {...trackBind} />

        <span {...thumbBind} />
      </label>
    </Switcher>
  );
}

export default Toggle;
