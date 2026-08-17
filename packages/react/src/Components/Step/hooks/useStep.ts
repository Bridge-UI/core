// ** External Imports
import { get, omit } from "es-toolkit/compat";
import type { KeyboardEvent, MouseEvent } from "react";

// ** Core Imports
import {
  formatStepperStepNumber,
  getStepperStepContentId,
  getStepperStepId,
  isStepperStepClickable,
  resolveStepperStepStatus,
} from "@bridge-ui/core/Domain";
import {
  stepperChromeProps as chromeProps,
  type IconSize,
} from "@bridge-ui/core/Tokens";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { StepOwnProps, StepProps } from "@/Components/Step/step.types";
import { useStepperContext } from "@/Components/Stepper/StepperContext";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const stepBridgeKeys = [
  "icon",
  "error",
  "label",
  "slots",
  "classes",
  "disabled",
  "completed",
  "customProps",
  "description",
] as const satisfies readonly (keyof StepOwnProps)[];

export function useStep(props: StepProps) {
  const stepper = useStepperContext();
  const index = stepper.takeIndex();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    StepProps,
    typeof stepBridgeKeys
  >({
    props,
    bridgeKeys: stepBridgeKeys,
  });

  const { merged, entry: bridgeStep } = useBridgeUIComponent<
    StepOwnProps,
    "Step"
  >({
    props: componentProps,
    componentName: "Step",
  });

  const slots = derived(() => {
    return props.slots;
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const disabled = derived(() => {
    return merged.disabled === true;
  });

  const status = derived(() => {
    return resolveStepperStepStatus({
      index,
      error: merged.error,
      completed: merged.completed,
      activeStep: stepper.activeStep,
    });
  });

  const clickable = derived(() => {
    return isStepperStepClickable({
      index,
      disabled,
      linear: stepper.linear,
      completed: merged.completed,
      activeStep: stepper.activeStep,
    });
  });

  stepper.registerStepMeta(index, { disabled, clickable });

  const accent = derived(() => {
    return status === "error" ? stepper.errorColorItem : stepper.colorItem;
  });

  const isActive = status === "active";
  const isCompleted = status === "completed";
  const isUpcoming = status === "upcoming";
  const isError = status === "error";
  const isAccented = isActive || isError;
  const isVertical = stepper.orientation === "vertical";

  const showContent = derived(() => {
    return isVertical && isActive && children != null && children !== false;
  });

  const stepId = getStepperStepId(stepper.id, index);
  const contentId = getStepperStepContentId(stepper.id, index);
  const stepNumber = formatStepperStepNumber(index);

  const iconSize = derived(() => {
    return (get(stepper.sizeItem, "icon") ?? "md") as keyof IconSize;
  });

  const resolvedIcon = derived(() => {
    if (merged.icon) {
      return merged.icon;
    }

    if (isCompleted) {
      return "check" as const;
    }

    if (isError) {
      return "error" as const;
    }

    return undefined;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [
      "icon",
      "slots",
      "label",
      "children",
      "description",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeStep,
    props: componentProps,
  });

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (!clickable) {
      return;
    }

    stepper.selectStep(index);
    customProps?.trigger?.onClick?.(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      stepper.focusStep(stepper.getAdjacentIndex(index, 1));
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      stepper.focusStep(stepper.getAdjacentIndex(index, -1));
    }

    if (event.key === "Home") {
      event.preventDefault();
      stepper.focusStep(stepper.getAdjacentIndex(-1, 1));
    }

    if (event.key === "End") {
      event.preventDefault();
      stepper.focusStep(stepper.getAdjacentIndex(0, -1));
    }

    customProps?.trigger?.onKeyDown?.(event);
  }

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      className: cn({
        [chromeProps.item]: true,
        [get(stepper.orientationItem, "item") ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const connectorBind = derived(() => {
    return mergePartBind(
      customProps?.connector,
      {},
      {
        "aria-hidden": true,
        "data-part": "connector",
        className: cn({
          [chromeProps.connector]: true,
          [get(stepper.orientationItem, "connector") ?? ""]: true,
          [get(accent, "connector") ?? ""]: isCompleted,
          [get(mergedClasses, "connector") ?? ""]: true,
        }),
      },
    );
  });

  const triggerBind = derived(() => {
    return mergePartBind(
      customProps?.trigger,
      {},
      {
        id: stepId,
        type: "button" as const,
        disabled: disabled || undefined,
        tabIndex: clickable ? undefined : -1,
        "aria-invalid": isError ? true : undefined,
        onClick: clickable ? handleClick : undefined,
        onKeyDown: clickable ? handleKeyDown : undefined,
        "aria-controls": showContent ? contentId : undefined,
        "aria-current": isActive ? ("step" as const) : undefined,
        className: cn({
          [chromeProps.trigger]: true,
          [get(stepper.orientationItem, "trigger") ?? ""]: true,
          "cursor-pointer": clickable && !disabled,
          "cursor-default": !clickable,
          "pointer-events-none opacity-50": disabled,
          [get(mergedClasses, "trigger") ?? ""]: true,
        }),
      },
    );
  });

  const indicatorBind = derived(() => {
    return mergePartBind(
      customProps?.indicator,
      {},
      {
        className: cn({
          [get(stepper.sizeItem, "indicator") ?? ""]: true,
          [chromeProps.indicator]: true,
          [chromeProps.upcoming]: isUpcoming,
          [get(accent, "indicator") ?? ""]: isAccented,
          [get(accent, "completed") ?? ""]: isCompleted,
          [get(accent, "completedHover") ?? ""]: isCompleted && clickable,
          [get(mergedClasses, "indicator") ?? ""]: true,
        }),
      },
    );
  });

  const iconBind = derived(() => {
    return mergePartBind(
      customProps?.icon,
      {},
      {
        size: iconSize,
        className: cn({
          "size-5 shrink-0": true,
          [get(mergedClasses, "icon") ?? ""]: true,
        }),
      },
    );
  });

  const textBind = derived(() => {
    return {
      className: cn({
        "flex min-w-0 flex-col": true,
        "ml-4": isVertical,
      }),
    };
  });

  const labelBind = derived(() => {
    return mergePartBind(
      customProps?.label,
      {},
      cn({
        [get(stepper.sizeItem, "label") ?? ""]: true,
        [chromeProps.label]: true,
        [chromeProps.labelCompleted]: isCompleted,
        [get(accent, "label") ?? ""]: isAccented,
        [get(mergedClasses, "label") ?? ""]: true,
      }),
    );
  });

  const descriptionBind = derived(() => {
    return mergePartBind(
      customProps?.description,
      {},
      cn({
        [get(stepper.sizeItem, "description") ?? ""]: true,
        [chromeProps.description]: true,
        [get(mergedClasses, "description") ?? ""]: true,
      }),
    );
  });

  const contentBind = derived(() => {
    return mergePartBind(
      customProps?.content,
      {},
      {
        id: contentId,
        role: "region",
        "aria-labelledby": stepId,
        className: cn({
          [get(stepper.sizeItem, "content") ?? ""]: true,
          [get(stepper.orientationItem, "content") ?? ""]: true,
          [get(mergedClasses, "content") ?? ""]: true,
        }),
      },
    );
  });

  return {
    index,
    slots,
    status,
    merged,
    isError,
    children,
    iconSize,
    rootBind,
    textBind,
    iconBind,
    clickable,
    labelBind,
    stepNumber,
    isVertical,
    showContent,
    isCompleted,
    contentBind,
    triggerBind,
    resolvedIcon,
    indicatorBind,
    connectorBind,
    descriptionBind,
  };
}
