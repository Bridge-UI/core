// ** External Imports
import { Fragment } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";
import { useNumberField } from "@/Components/NumberField/hooks/useNumberField";
import type { NumberFieldProps } from "@/Components/NumberField/numberField.types";
import { mergePartBind, useHoldRepeat } from "@/Utils";

function NumberField(props: NumberFieldProps) {
  const resolveMessage = useResolveMessage();

  const {
    isSplit,
    decrement,
    formField,
    increment,
    inputBind,
    decrementIcon,
    incrementIcon,
    mergedClasses,
    incrementFirst,
    stepperIconSize,
    controlVariantItem,
  } = useNumberField(props);

  const incrementHold = useHoldRepeat(increment, {
    disabled: props.disabled,
  });

  const decrementHold = useHoldRepeat(decrement, {
    disabled: props.disabled,
  });

  const incrementProps = props.customProps?.increment;
  const decrementProps = props.customProps?.decrement;
  const incrementIconProps = props.customProps?.incrementIcon;
  const decrementIconProps = props.customProps?.decrementIcon;

  const incrementButton = (
    <button
      {...mergePartBind(
        incrementProps,
        {
          type: "button",
          disabled: props.disabled,
          "aria-label": resolveMessage("Increment value"),
          ...incrementHold.handlers,
        },
        cn({
          [controlVariantItem.button]: true,
          [mergedClasses.increment ?? ""]: true,
        }),
      )}
    >
      <Icon
        icon={incrementIcon}
        size={stepperIconSize}
        {...incrementIconProps}
      />
    </button>
  );

  const decrementButton = (
    <button
      {...mergePartBind(
        decrementProps,
        {
          type: "button",
          disabled: props.disabled,
          "aria-label": resolveMessage("Decrement value"),
          ...decrementHold.handlers,
        },
        cn({
          [controlVariantItem.button]: true,
          [mergedClasses.decrement ?? ""]: true,
        }),
      )}
    >
      <Icon
        icon={decrementIcon}
        size={stepperIconSize}
        {...decrementIconProps}
      />
    </button>
  );

  return (
    <FormField
      field={{
        ...formField,
        slots: {
          ...props.slots,
          ...(isSplit
            ? {
                start: (
                  <Fragment>
                    <div className={controlVariantItem.startGroup}>
                      {decrementButton}
                    </div>
                  </Fragment>
                ),
              }
            : {}),
          end: (
            <Fragment>
              <div className={controlVariantItem.endGroup}>
                {incrementFirst ? incrementButton : null}
                {isSplit ? null : decrementButton}
                {incrementFirst ? null : incrementButton}
              </div>
            </Fragment>
          ),
        },
      }}
    >
      <input {...inputBind} />
    </FormField>
  );
}

export default NumberField;
