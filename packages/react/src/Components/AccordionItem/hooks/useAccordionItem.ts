// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useEffect, type KeyboardEvent, type MouseEvent } from "react";

// ** Core Imports
import {
  cn,
  getAccordionPanelId,
  getAccordionTriggerId,
  getAdjacentAccordionValue,
  isAccordionItemExpanded,
  splitComponentProps,
  type IconSize,
} from "@bridge-ui/core";

// ** Local Imports
import { useAccordionContext } from "@/Components/Accordion/AccordionContext";
import type {
  AccordionItemOwnProps,
  AccordionItemProps,
} from "@/Components/AccordionItem/accordionItem.types";
import {
  derived,
  hasNamedSlot,
  mergePartBind,
  resolveSlotOrProp,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const accordionItemBridgeKeys = [
  "slots",
  "title",
  "value",
  "classes",
  "disabled",
  "customProps",
] as const satisfies readonly (keyof AccordionItemOwnProps)[];

export function useAccordionItem(props: AccordionItemProps) {
  const accordion = useAccordionContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    AccordionItemProps,
    typeof accordionItemBridgeKeys
  >({
    props,
    bridgeKeys: accordionItemBridgeKeys,
  });

  const { merged, entry: bridgeAccordionItem } = useBridgeUIComponent<
    AccordionItemOwnProps,
    "AccordionItem"
  >({
    props: componentProps,
    componentName: "AccordionItem",
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

  const value = derived(() => {
    return merged.value;
  });

  const disabled = derived(() => {
    return accordion.disabled || merged.disabled === true;
  });

  const expanded = derived(() => {
    return isAccordionItemExpanded(
      accordion.expanded,
      value,
      accordion.multiple,
    );
  });

  const iconSize = derived(() => {
    return (accordion.tokenClasses.iconSize ?? "md") as keyof IconSize;
  });

  const titleContent = derived(() => {
    return resolveSlotOrProp({
      slots,
      name: "title",
      fallback: merged.title,
    });
  });

  const hasIndicatorSlot = derived(() => {
    return hasNamedSlot(slots, "indicator");
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children", "title"]);
  });

  useEffect(() => {
    return accordion.registerItem(value, disabled);
  }, [value, disabled, accordion.registerItem]);

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgeAccordionItem,
  });

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    accordion.toggleItem(value);
    customProps?.trigger?.onClick?.(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const disabledSet = new Set(accordion.disabledValues);

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();

      const next = getAdjacentAccordionValue(
        accordion.itemValues,
        value,
        1,
        disabledSet,
      );

      accordion.focusTrigger(next);
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();

      const next = getAdjacentAccordionValue(
        accordion.itemValues,
        value,
        -1,
        disabledSet,
      );

      accordion.focusTrigger(next);
    }

    if (event.key === "Home") {
      event.preventDefault();

      const first = getAdjacentAccordionValue(
        accordion.itemValues,
        accordion.itemValues[accordion.itemValues.length - 1] ?? value,
        1,
        disabledSet,
      );

      accordion.focusTrigger(first);
    }

    if (event.key === "End") {
      event.preventDefault();

      const last = getAdjacentAccordionValue(
        accordion.itemValues,
        accordion.itemValues[0] ?? value,
        -1,
        disabledSet,
      );

      accordion.focusTrigger(last);
    }

    customProps?.trigger?.onKeyDown?.(event);
  }

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      className: cn({
        [accordion.tokenClasses.itemSize ?? ""]: true,
        [accordion.tokenClasses.itemVariant ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const triggerBind = derived(() => {
    return mergePartBind(
      customProps?.trigger,
      {},
      {
        disabled,
        onClick: handleClick,
        type: "button" as const,
        onKeyDown: handleKeyDown,
        "aria-expanded": expanded,
        id: getAccordionTriggerId(accordion.id, value),
        "aria-controls": getAccordionPanelId(accordion.id, value),
        className: cn({
          "inline-flex w-full cursor-pointer items-center justify-between text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:pointer-events-none disabled:opacity-50": true,
          [accordion.tokenClasses.triggerSize ?? ""]: true,
          [accordion.tokenClasses.triggerVariant ?? ""]: true,
          [accordion.tokenClasses.colorTriggerExpanded ?? ""]: expanded,
          [get(mergedClasses, "trigger") ?? ""]: true,
        }),
      },
    );
  });

  const titleBind = derived(() => {
    return mergePartBind(
      customProps?.title,
      {},
      cn({
        "min-w-0 flex-1": true,
        [get(mergedClasses, "title") ?? ""]: true,
      }),
    );
  });

  const indicatorBind = derived(() => {
    return mergePartBind(
      customProps?.indicator,
      {},
      {
        size: iconSize,
        className: cn({
          "shrink-0 transition-transform duration-200 motion-reduce:transition-none": true,
          "rotate-180": expanded,
          [accordion.tokenClasses.colorIndicator ?? ""]: expanded,
          [get(mergedClasses, "indicator") ?? ""]: true,
        }),
      },
    );
  });

  const collapseBind = derived(() => {
    return {
      className: cn({
        "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none": true,
        "grid-rows-[1fr]": expanded,
        "grid-rows-[0fr]": !expanded,
      }),
    };
  });

  const panelInnerBind = derived(() => {
    return {
      className: "min-h-0 overflow-hidden",
    };
  });

  const panelBind = derived(() => {
    return mergePartBind(
      customProps?.panel,
      {},
      {
        role: "region",
        "aria-hidden": !expanded,
        id: getAccordionPanelId(accordion.id, value),
        "aria-labelledby": getAccordionTriggerId(accordion.id, value),
        className: cn({
          [accordion.tokenClasses.panelSize ?? ""]: true,
          [get(mergedClasses, "panel") ?? ""]: true,
        }),
      },
    );
  });

  return {
    slots,
    merged,
    children,
    expanded,
    rootBind,
    iconSize,
    titleBind,
    panelBind,
    triggerBind,
    titleContent,
    collapseBind,
    indicatorBind,
    panelInnerBind,
    hasIndicatorSlot,
  };
}
