// ** External Imports
import { get } from "es-toolkit/compat";
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  useAttrs,
  useSlots,
  watch,
} from "vue";

// ** Core Imports
import {
  getAccordionPanelId,
  getAccordionTriggerId,
  getAdjacentAccordionValue,
  isAccordionItemExpanded,
} from "@bridge-ui/core/Domain";
import type { IconSize } from "@bridge-ui/core/Tokens";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { ACCORDION_INJECTION_KEY } from "@/Components/Accordion/accordionInjectionKey";
import type {
  AccordionItemOwnProps,
  AccordionItemProps,
} from "@/Components/AccordionItem/accordionItem.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const accordionItemBridgeKeys = [
  "title",
  "value",
  "classes",
  "disabled",
  "customProps",
] as const satisfies readonly (keyof AccordionItemOwnProps)[];

export function useAccordionItem(props: AccordionItemOwnProps) {
  const attrs = useAttrs();
  const slots = useSlots();

  const injectedAccordionContext = inject(ACCORDION_INJECTION_KEY, null);

  if (!injectedAccordionContext) {
    throw new Error("AccordionItem must be used within an Accordion provider");
  }

  const accordionContextRef = injectedAccordionContext;

  const split = computed(() => {
    return splitComponentProps<
      AccordionItemProps,
      typeof accordionItemBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: accordionItemBridgeKeys,
    });
  });

  const { merged, entry: bridgeAccordionItem } = useBridgeUIComponent<
    AccordionItemOwnProps,
    "AccordionItem"
  >({
    componentName: "AccordionItem",
    props: () => split.value.componentProps,
  });

  const value = computed(() => {
    return merged.value.value;
  });

  const disabled = computed(() => {
    return accordionContextRef.value.disabled || merged.value.disabled === true;
  });

  const expanded = computed(() => {
    return isAccordionItemExpanded(
      accordionContextRef.value.expanded,
      value.value,
      accordionContextRef.value.multiple,
    );
  });

  const iconSize = computed(() => {
    return (accordionContextRef.value.tokenClasses.iconSize ??
      "md") as keyof IconSize;
  });

  let unregister: null | (() => void) = null;

  function syncRegistration() {
    unregister?.();
    unregister = accordionContextRef.value.registerItem(
      value.value,
      disabled.value,
    );
  }

  onMounted(syncRegistration);

  watch([value, disabled], syncRegistration);

  onBeforeUnmount(() => {
    unregister?.();
    unregister = null;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeAccordionItem,
    props: () => split.value.componentProps,
  });

  function handleClick(event: MouseEvent) {
    if (disabled.value) {
      return;
    }

    accordionContextRef.value.toggleItem(value.value);
    (
      merged.value.customProps?.trigger as
        undefined | { onClick?: (event: MouseEvent) => void }
    )?.onClick?.(event);
  }

  function handleKeyDown(event: KeyboardEvent) {
    const accordion = accordionContextRef.value;
    const disabledSet = new Set(accordion.disabledValues);

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();

      const next = getAdjacentAccordionValue(
        accordion.itemValues,
        value.value,
        1,
        disabledSet,
      );

      accordion.focusTrigger(next);
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();

      const next = getAdjacentAccordionValue(
        accordion.itemValues,
        value.value,
        -1,
        disabledSet,
      );

      accordion.focusTrigger(next);
    }

    if (event.key === "Home") {
      event.preventDefault();

      const first = getAdjacentAccordionValue(
        accordion.itemValues,
        accordion.itemValues[accordion.itemValues.length - 1] ?? value.value,
        1,
        disabledSet,
      );

      accordion.focusTrigger(first);
    }

    if (event.key === "End") {
      event.preventDefault();

      const last = getAdjacentAccordionValue(
        accordion.itemValues,
        accordion.itemValues[0] ?? value.value,
        -1,
        disabledSet,
      );

      accordion.focusTrigger(last);
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
          [accordionContextRef.value.tokenClasses.itemSize ?? ""]: true,
          [accordionContextRef.value.tokenClasses.itemVariant ?? ""]: true,
          [get(mergedClasses.value, "root") ?? ""]: true,
        }),
      },
    );
  });

  const triggerBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.trigger,
      {},
      {
        onClick: handleClick,
        type: "button" as const,
        disabled: disabled.value,
        onKeydown: handleKeyDown,
        "aria-expanded": expanded.value,
        id: getAccordionTriggerId(accordionContextRef.value.id, value.value),
        "aria-controls": getAccordionPanelId(
          accordionContextRef.value.id,
          value.value,
        ),
        class: cn({
          "inline-flex w-full cursor-pointer items-center justify-between text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:pointer-events-none disabled:opacity-50": true,
          [accordionContextRef.value.tokenClasses.triggerSize ?? ""]: true,
          [accordionContextRef.value.tokenClasses.triggerVariant ?? ""]: true,
          [accordionContextRef.value.tokenClasses.colorTriggerExpanded ?? ""]:
            expanded.value,
          [get(mergedClasses.value, "trigger") ?? ""]: true,
        }),
      },
    );
  });

  const titleBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.title,
      {},
      cn({
        "min-w-0 flex-1": true,
        [get(mergedClasses.value, "title") ?? ""]: true,
      }),
    );
  });

  const indicatorBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.indicator,
      {},
      {
        size: iconSize.value,
        class: cn({
          "shrink-0 transition-transform duration-200 motion-reduce:transition-none": true,
          "rotate-180": expanded.value,
          [accordionContextRef.value.tokenClasses.colorIndicator ?? ""]:
            expanded.value,
          [get(mergedClasses.value, "indicator") ?? ""]: true,
        }),
      },
    );
  });

  const collapseBind = computed(() => {
    return {
      class: cn({
        "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none": true,
        "grid-rows-[1fr]": expanded.value,
        "grid-rows-[0fr]": !expanded.value,
      }),
    };
  });

  const panelInnerBind = computed(() => {
    return {
      class: "min-h-0 overflow-hidden",
    };
  });

  const panelBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.panel,
      {},
      {
        role: "region",
        "aria-hidden": !expanded.value,
        id: getAccordionPanelId(accordionContextRef.value.id, value.value),
        "aria-labelledby": getAccordionTriggerId(
          accordionContextRef.value.id,
          value.value,
        ),
        class: cn({
          [accordionContextRef.value.tokenClasses.panelSize ?? ""]: true,
          [accordionContextRef.value.tokenClasses.panelVariant ?? ""]: true,
          [get(mergedClasses.value, "panel") ?? ""]: true,
        }),
      },
    );
  });

  return {
    slots,
    merged,
    expanded,
    rootBind,
    iconSize,
    titleBind,
    panelBind,
    triggerBind,
    collapseBind,
    indicatorBind,
    panelInnerBind,
  };
}
