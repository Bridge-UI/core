// ** Local Imports
import { useRadio } from "@/Components/Radio/hooks/useRadio";
import type { RadioProps } from "@/Components/Radio/radio.types";
import { Switcher } from "@/Components/Switcher";

function Radio(props: RadioProps) {
  const { dotBind, switcher, fieldBind, inputBind, controlBind } = useRadio(
    props,
    {
      size: "sm",
      color: "primary",
    },
  );

  return (
    <Switcher field={switcher}>
      <span {...fieldBind}>
        <input {...inputBind} />

        <span {...controlBind}>
          <span {...dotBind} />
        </span>
      </span>
    </Switcher>
  );
}

export default Radio;
