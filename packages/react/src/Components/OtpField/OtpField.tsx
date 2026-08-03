// ** Local Imports
import { useOtpField } from "@/Components/OtpField/hooks/useOtpField";
import type { OtpFieldProps } from "@/Components/OtpField/otpField.types";
import OtpFieldLabel from "@/Components/OtpField/OtpFieldLabel";
import { hasSlotOrProp, resolveSlotOrProp } from "@/Utils";

function OtpField(props: OtpFieldProps) {
  const api = useOtpField(props);

  const {
    slots,
    merged,
    digits,
    length,
    pinBind,
    rootBind,
    errorBind,
    groupBind,
    inputBind,
    setPinRef,
    controlId,
    headerBind,
    cornerBind,
    invalidated,
    handlePinInput,
    handlePinFocus,
    handlePinPaste,
    descriptionBind,
    handlePinKeyDown,
    showErrorMessageContent,
  } = api;

  const showHeader =
    hasSlotOrProp(slots, "label", merged.label) ||
    hasSlotOrProp(slots, "corner", merged.corner);

  return (
    <div
      {...rootBind}
      data-invalid={invalidated || undefined}
      aria-disabled={merged.disabled || undefined}
      aria-readonly={merged.readonly || undefined}
    >
      {showHeader && (
        <div {...headerBind}>
          <OtpFieldLabel api={api} />

          {hasSlotOrProp(slots, "corner", merged.corner) && (
            <span {...cornerBind}>
              {resolveSlotOrProp({
                slots,
                name: "corner",
                fallback: merged.corner,
              })}
            </span>
          )}
        </div>
      )}

      <div {...groupBind}>
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

      {!invalidated &&
        hasSlotOrProp(slots, "description", merged.description) && (
          <p {...descriptionBind} id={`${controlId}-description`}>
            {resolveSlotOrProp({
              slots,
              name: "description",
              fallback: merged.description,
            })}
          </p>
        )}

      {!merged.withoutErrorMessage && (
        <p
          {...errorBind}
          id={`${controlId}-error`}
          aria-hidden={showErrorMessageContent ? undefined : true}
        >
          {showErrorMessageContent &&
            resolveSlotOrProp({
              slots,
              name: "errorMessage",
              fallback: merged.errorMessage,
            })}
        </p>
      )}
    </div>
  );
}

export default OtpField;
