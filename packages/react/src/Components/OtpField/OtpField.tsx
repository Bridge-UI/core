// ** Local Imports
import BaseField from "@/Components/BaseField/BaseField";
import { useOtpField } from "@/Components/OtpField/hooks/useOtpField";
import type { OtpFieldProps } from "@/Components/OtpField/otpField.types";

function OtpField(props: OtpFieldProps) {
  const api = useOtpField(props);

  const {
    digits,
    length,
    pinBind,
    pinsBind,
    baseField,
    inputBind,
    setPinRef,
    handlePinInput,
    handlePinFocus,
    handlePinPaste,
    handlePinKeyDown,
  } = api;

  return (
    <BaseField field={baseField}>
      <div {...pinsBind}>
        {Array.from({ length }, (_, index) => (
          <div key={index} {...pinBind(index)}>
            <input
              ref={(element) => setPinRef(index, element)}
              {...inputBind(index)}
              value={digits[index] ?? ""}
              onFocus={() => handlePinFocus(index)}
              onPaste={(event) => handlePinPaste(index, event)}
              onInput={(event) => handlePinInput(index, event)}
              onKeyDown={(event) => handlePinKeyDown(index, event)}
            />
          </div>
        ))}
      </div>
    </BaseField>
  );
}

export default OtpField;
