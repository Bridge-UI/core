// ** Local Imports
import { useRadio } from "@/Components/Radio/hooks/useRadio";
import type { RadioProps } from "@/Components/Radio/radio.types";
import { Switcher } from "@/Components/Switcher";

function Radio(props: RadioProps) {
  const { dotBind, switcher, fieldBind, inputBind, controlBind } = useRadio(
    props,
    {
      size: "sm",
      rounded: "full",
      color: "primary",
    },
  );

  return (
    <Switcher field={switcher}>
      <label htmlFor={switcher.controlId} {...fieldBind}>
        <input {...inputBind} />

        <span {...controlBind}>
          <span {...dotBind} />
        </span>
      </label>
    </Switcher>
  );
}

export default Radio;
