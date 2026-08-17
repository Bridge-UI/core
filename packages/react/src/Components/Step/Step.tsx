// ** Local Imports
import { Icon } from "@/Components/Icon";
import { useStep } from "@/Components/Step/hooks/useStep";
import type { StepProps } from "@/Components/Step/step.types";
import { hasNamedSlot, hasSlotOrProp } from "@/Utils";

function Step(props: StepProps) {
  const {
    slots,
    merged,
    children,
    rootBind,
    textBind,
    iconBind,
    labelBind,
    stepNumber,
    showContent,
    contentBind,
    triggerBind,
    resolvedIcon,
    indicatorBind,
    connectorBind,
    descriptionBind,
  } = useStep(props);

  const hasDescription = hasSlotOrProp(
    slots,
    "description",
    merged.description,
  );
  const hasLabel = hasSlotOrProp(slots, "label", merged.label);

  return (
    <li {...rootBind}>
      <div {...connectorBind} />

      <button {...triggerBind}>
        <span {...indicatorBind}>
          {hasNamedSlot(slots, "icon") ? (
            slots?.icon
          ) : resolvedIcon != null ? (
            <Icon icon={resolvedIcon} {...iconBind} />
          ) : (
            stepNumber
          )}
        </span>

        {hasLabel || hasDescription ? (
          <span {...textBind}>
            {hasLabel ? (
              <span {...labelBind}>
                {hasNamedSlot(slots, "label") ? slots?.label : merged.label}
              </span>
            ) : null}

            {hasDescription ? (
              <span {...descriptionBind}>
                {hasNamedSlot(slots, "description")
                  ? slots?.description
                  : merged.description}
              </span>
            ) : null}
          </span>
        ) : null}
      </button>

      {showContent ? <div {...contentBind}>{children}</div> : null}
    </li>
  );
}

export default Step;
