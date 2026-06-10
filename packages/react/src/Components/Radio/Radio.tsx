// ** Local Imports
import { FormControl } from "@/Components/FormControl";
import { useRadio } from "@/Components/Radio/hooks/useRadio";
import type { RadioProps } from "@/Components/Radio/radio.types";

function Radio(props: RadioProps) {
  const { dotBind, fieldBind, inputBind, formControl, controlBind } = useRadio(
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

        <span {...controlBind}>
          <span {...dotBind} />
        </span>
      </label>
    </FormControl>
  );
}

export default Radio;
