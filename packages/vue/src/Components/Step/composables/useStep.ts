// ** External Imports
import { get } from "es-toolkit/compat";
import {
  computed,
  inject,
  onBeforeUnmount,
  useAttrs,
  useId,
  useSlots,
  watchEffect,
} from "vue";

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
import { STEPPER_INJECTION_KEY } from "@/Components/Stepper/stepperInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const stepBridgeKeys = [
  "icon",
  "error",
  "label",
  "classes",
  "disabled",
  "completed",
  "customProps",
  "description",
] as const satisfies readonly (keyof StepOwnProps)[];

export function useStep(props: StepOwnProps) {
  const attrs = useAttrs();
  const slots = useSlots();
  const stepUid = useId();

  const injectedStepperContext = inject(STEPPER_INJECTION_KEY, null);

  if (!injectedStepperContext) {
    throw new Error("Step must be used within a Stepper provider");
  }

  const stepperContextRef = injectedStepperContext;

  let unregister: null | (() => void) = null;

  unregister = stepperContextRef.value.registerStep(stepUid);

  onBeforeUnmount(() => {
    unregister?.();
    unregister = null;
  });

  const split = computed(() => {
    return splitComponentProps<StepProps, typeof stepBridgeKeys>({
      bridgeKeys: stepBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeStep } = useBridgeUIComponent<
    StepOwnProps,
    "Step"
  >({
    componentName: "Step",
    props: () => split.value.componentProps,
  });

  const index = computed(() => {
    return stepperContextRef.value.getIndex(stepUid);
  });

  const disabled = computed(() => {
    return merged.value.disabled === true;
  });

  const status = computed(() => {
    return resolveStepperStepStatus({
      index: index.value,
      error: merged.value.error,
      completed: merged.value.completed,
      activeStep: stepperContextRef.value.activeStep,
    });
  });

  const clickable = computed(() => {
    return isStepperStepClickable({
      index: index.value,
      disabled: disabled.value,
      completed: merged.value.completed,
      linear: stepperContextRef.value.linear,
      activeStep: stepperContextRef.value.activeStep,
    });
  });

  watchEffect(() => {
    if (index.value < 0) {
      return;
    }

    stepperContextRef.value.registerStepMeta(index.value, {
      disabled: disabled.value,
      clickable: clickable.value,
    });
  });

  const accent = computed(() => {
    return status.value === "error"
      ? stepperContextRef.value.errorColorItem
      : stepperContextRef.value.colorItem;
  });

  const isActive = computed(() => status.value === "active");
  const isCompleted = computed(() => status.value === "completed");
  const isUpcoming = computed(() => status.value === "upcoming");
  const isError = computed(() => status.value === "error");
  const isAccented = computed(() => isActive.value || isError.value);
  const isVertical = computed(
    () => stepperContextRef.value.orientation === "vertical",
  );

  const showContent = computed(() => {
    return isVertical.value && isActive.value;
  });

  const stepId = computed(() => {
    return getStepperStepId(stepperContextRef.value.id, index.value);
  });

  const contentId = computed(() => {
    return getStepperStepContentId(stepperContextRef.value.id, index.value);
  });

  const stepNumber = computed(() => {
    return formatStepperStepNumber(Math.max(index.value, 0));
  });

  const iconSize = computed(() => {
    return (get(stepperContextRef.value.sizeItem, "icon") ??
      "md") as keyof IconSize;
  });

  const resolvedIcon = computed(() => {
    if (merged.value.icon) {
      return merged.value.icon;
    }

    if (isCompleted.value) {
      return "check" as const;
    }

    if (isError.value) {
      return "error" as const;
    }

    return undefined;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeStep,
    props: () => split.value.componentProps,
  });

  function handleClick(event: MouseEvent) {
    if (!clickable.value) {
      return;
    }

    stepperContextRef.value.selectStep(index.value);
    (
      merged.value.customProps?.trigger as
        undefined | { onClick?: (event: MouseEvent) => void }
    )?.onClick?.(event);
  }

  function handleKeyDown(event: KeyboardEvent) {
    const stepper = stepperContextRef.value;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      stepper.focusStep(stepper.getAdjacentIndex(index.value, 1));
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      stepper.focusStep(stepper.getAdjacentIndex(index.value, -1));
    }

    if (event.key === "Home") {
      event.preventDefault();
      stepper.focusStep(stepper.getAdjacentIndex(-1, 1));
    }

    if (event.key === "End") {
      event.preventDefault();
      stepper.focusStep(stepper.getAdjacentIndex(0, -1));
    }

    (
      merged.value.customProps?.trigger as
        undefined | { onKeydown?: (event: KeyboardEvent) => void }
    )?.onKeydown?.(event);
  }

  const rootBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.root,
      split.value.inheritedAttrs,
      {
        class: cn({
          [chromeProps.item]: true,
          [get(stepperContextRef.value.orientationItem, "item") ?? ""]: true,
          [get(mergedClasses.value, "root") ?? ""]: true,
        }),
      },
    );
  });

  const connectorBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.connector,
      {},
      {
        "aria-hidden": true,
        "data-part": "connector",
        class: cn({
          [chromeProps.connector]: true,
          [get(stepperContextRef.value.orientationItem, "connector") ?? ""]:
            true,
          [get(accent.value, "connector") ?? ""]: isCompleted.value,
          [get(mergedClasses.value, "connector") ?? ""]: true,
        }),
      },
    );
  });

  const triggerBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.trigger,
      {},
      {
        id: stepId.value,
        type: "button" as const,
        disabled: disabled.value || undefined,
        tabindex: clickable.value ? undefined : -1,
        "aria-invalid": isError.value ? true : undefined,
        onClick: clickable.value ? handleClick : undefined,
        onKeydown: clickable.value ? handleKeyDown : undefined,
        "aria-current": isActive.value ? ("step" as const) : undefined,
        "aria-controls": showContent.value ? contentId.value : undefined,
        class: cn({
          [chromeProps.trigger]: true,
          [get(stepperContextRef.value.orientationItem, "trigger") ?? ""]: true,
          "cursor-pointer": clickable.value && !disabled.value,
          "cursor-default": !clickable.value,
          "pointer-events-none opacity-50": disabled.value,
          [get(mergedClasses.value, "trigger") ?? ""]: true,
        }),
      },
    );
  });

  const indicatorBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.indicator,
      {},
      {
        class: cn({
          [get(stepperContextRef.value.sizeItem, "indicator") ?? ""]: true,
          [chromeProps.indicator]: true,
          [chromeProps.upcoming]: isUpcoming.value,
          [get(accent.value, "indicator") ?? ""]: isAccented.value,
          [get(accent.value, "completed") ?? ""]: isCompleted.value,
          [get(accent.value, "completedHover") ?? ""]:
            isCompleted.value && clickable.value,
          [get(mergedClasses.value, "indicator") ?? ""]: true,
        }),
      },
    );
  });

  const iconBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.icon,
      {},
      {
        size: iconSize.value,
        class: cn({
          "size-5 shrink-0": true,
          [get(mergedClasses.value, "icon") ?? ""]: true,
        }),
      },
    );
  });

  const textBind = computed(() => {
    return {
      class: cn({
        "flex min-w-0 flex-col": true,
        "ml-4": isVertical.value,
      }),
    };
  });

  const labelBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.label,
      {},
      cn({
        [get(stepperContextRef.value.sizeItem, "label") ?? ""]: true,
        [chromeProps.label]: true,
        [chromeProps.labelCompleted]: isCompleted.value,
        [get(accent.value, "label") ?? ""]: isAccented.value,
        [get(mergedClasses.value, "label") ?? ""]: true,
      }),
    );
  });

  const descriptionBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.description,
      {},
      cn({
        [get(stepperContextRef.value.sizeItem, "description") ?? ""]: true,
        [chromeProps.description]: true,
        [get(mergedClasses.value, "description") ?? ""]: true,
      }),
    );
  });

  const contentBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.content,
      {},
      {
        role: "region",
        id: contentId.value,
        "aria-labelledby": stepId.value,
        class: cn({
          [get(stepperContextRef.value.sizeItem, "content") ?? ""]: true,
          [get(stepperContextRef.value.orientationItem, "content") ?? ""]: true,
          [get(mergedClasses.value, "content") ?? ""]: true,
        }),
      },
    );
  });

  return {
    slots,
    index,
    status,
    merged,
    isError,
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
