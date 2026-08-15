// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useCallback, useId, useMemo, useState } from "react";

// ** Core Imports
import {
  getAccordionTriggerId,
  normalizeAccordionValue,
  toggleAccordionItem,
  type AccordionValue,
} from "@bridge-ui/core/Domain";
import {
  accordionColorProps as colorProps,
  accordionSizeProps as sizeProps,
  accordionVariantProps as variantProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type { AccordionContextValue } from "@/Components/Accordion/AccordionContext";
import type {
  AccordionOwnProps,
  AccordionProps,
} from "@/Components/Accordion/accordion.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const accordionBridgeKeys = [
  "size",
  "color",
  "value",
  "classes",
  "variant",
  "disabled",
  "multiple",
  "onChange",
  "customProps",
  "defaultValue",
] as const satisfies readonly (keyof AccordionOwnProps)[];

type AccordionLibDefaults = LibDefaultsShape<
  AccordionOwnProps,
  "size" | "color" | "variant" | "disabled" | "multiple"
>;

type AccordionMerged = MergeLibDefaults<
  AccordionOwnProps,
  AccordionLibDefaults
>;

export function useAccordion(
  props: AccordionProps,
  libDefaults: AccordionLibDefaults,
) {
  const reactId = useId();
  const accordionId = `bridge-accordion${reactId.replace(/:/g, "")}`;

  const [itemValues, setItemValues] = useState<string[]>([]);
  const [disabledValues, setDisabledValues] = useState<string[]>([]);

  const { componentProps, inheritedAttrs } = splitComponentProps<
    AccordionProps,
    typeof accordionBridgeKeys
  >({
    props,
    bridgeKeys: accordionBridgeKeys,
  });

  const { merged, entry: bridgeAccordion } = useBridgeUIComponent<
    AccordionMerged,
    "Accordion"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Accordion",
  });

  const multiple = derived(() => {
    return merged.multiple === true;
  });

  const isControlled = derived(() => {
    return props.value !== undefined;
  });

  const [uncontrolled, setUncontrolled] = useState<AccordionValue>(() =>
    normalizeAccordionValue(props.defaultValue, props.multiple === true),
  );

  const expanded = derived(() => {
    return normalizeAccordionValue(
      isControlled ? props.value : uncontrolled,
      multiple,
    );
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children", "onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgeAccordion,
  });

  const sizeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeAccordion?.tokens?.size,
    );
  }, [bridgeAccordion?.tokens?.size]);

  const variantClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeAccordion?.tokens?.variant,
    );
  }, [bridgeAccordion?.tokens?.variant]);

  const colorClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeAccordion?.tokens?.color,
    );
  }, [bridgeAccordion?.tokens?.color]);

  const sizeItem = derived(() => {
    return get(sizeClasses, merged.size);
  });

  const variantItem = derived(() => {
    return get(variantClasses, merged.variant);
  });

  const colorItem = derived(() => {
    return get(colorClasses, merged.color);
  });

  const toggleItem = useCallback(
    (value: string) => {
      if (merged.disabled || disabledValues.includes(value)) {
        return;
      }

      const next = toggleAccordionItem(expanded, value, multiple);

      if (!isControlled) {
        setUncontrolled(next);
      }

      merged.onChange?.(next);
    },
    [merged, expanded, multiple, isControlled, disabledValues],
  );

  const registerItem = useCallback((value: string, disabled = false) => {
    setItemValues((previous) => {
      if (previous.includes(value)) {
        return previous;
      }

      return [...previous, value];
    });

    setDisabledValues((previous) => {
      if (disabled) {
        return previous.includes(value) ? previous : [...previous, value];
      }

      return previous.filter((item) => item !== value);
    });

    return () => {
      setItemValues((previous) => previous.filter((item) => item !== value));
      setDisabledValues((previous) =>
        previous.filter((item) => item !== value),
      );
    };
  }, []);

  const focusTrigger = useCallback(
    (value: string) => {
      document
        .getElementById(getAccordionTriggerId(accordionId, value))
        ?.focus();
    },
    [accordionId],
  );

  const contextValue = useMemo((): AccordionContextValue => {
    return {
      expanded,
      multiple,
      toggleItem,
      itemValues,
      registerItem,
      focusTrigger,
      disabledValues,
      id: accordionId,
      disabled: merged.disabled === true,
      tokenClasses: {
        rootSize: get(sizeItem, "root"),
        itemSize: get(sizeItem, "item"),
        iconSize: get(sizeItem, "icon"),
        panelSize: get(sizeItem, "panel"),
        triggerSize: get(sizeItem, "trigger"),
        rootVariant: get(variantItem, "root"),
        itemVariant: get(variantItem, "item"),
        triggerVariant: get(variantItem, "trigger"),
        colorIndicator: get(colorItem, "indicator"),
        colorTriggerExpanded: get(colorItem, "triggerExpanded"),
      },
    };
  }, [
    accordionId,
    colorItem,
    disabledValues,
    expanded,
    focusTrigger,
    itemValues,
    merged.disabled,
    multiple,
    registerItem,
    sizeItem,
    toggleItem,
    variantItem,
  ]);

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      className: cn({
        [get(sizeItem, "root") ?? ""]: true,
        [get(variantItem, "root") ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    children,
    rootBind,
    contextValue,
  };
}
