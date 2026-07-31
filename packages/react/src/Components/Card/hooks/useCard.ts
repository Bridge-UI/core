// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  paddingProps,
  roundedProps,
  shadowProps,
  variantProps,
} from "@bridge-ui/core/Tokens/Card";

// ** Local Imports
import type { CardOwnProps, CardProps } from "@/Components/Card/card.types";
import {
  derived,
  hasNamedSlot,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const cardBridgeKeys = [
  "title",
  "shadow",
  "classes",
  "padding",
  "rounded",
  "variant",
  "borderless",
  "customProps",
] as const satisfies readonly (keyof CardOwnProps)[];

type CardLibDefaults = LibDefaultsShape<
  CardOwnProps,
  "shadow" | "padding" | "rounded" | "variant"
>;

type CardMerged = MergeLibDefaults<CardOwnProps, CardLibDefaults>;

export function useCard(props: CardProps, libDefaults: CardLibDefaults) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    CardProps,
    typeof cardBridgeKeys
  >({
    props: props,
    bridgeKeys: cardBridgeKeys,
  });

  const { merged, entry: bridgeCard } = useBridgeUIComponent<
    CardMerged,
    "Card"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Card",
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

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeCard,
    props: componentProps,
  });

  const hasDefaultBody = derived(() => {
    return Boolean(children);
  });

  const hasFooter = derived(() => {
    return hasNamedSlot(slots, "footer");
  });

  const variantClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeCard?.tokens?.variant,
    );

    return get(classes, merged.variant);
  }, [merged.variant, bridgeCard?.tokens?.variant]);

  const showDividers = useMemo(() => {
    if (merged.borderless) {
      return false;
    }

    return Boolean(get(variantClass, "border"));
  }, [variantClass, merged.borderless]);

  const shadowClass = useMemo(() => {
    if (merged.variant !== "elevated") {
      return undefined;
    }

    const classes = mergeBridgeUILayeredClasses(
      shadowProps,
      bridgeCard?.tokens?.shadow,
    );

    return get(classes, merged.shadow);
  }, [merged.shadow, merged.variant, bridgeCard?.tokens?.shadow]);

  const paddingClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      paddingProps,
      bridgeCard?.tokens?.padding,
    );

    return get(classes, merged.padding);
  }, [merged.padding, bridgeCard?.tokens?.padding]);

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeCard?.tokens?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeCard?.tokens?.rounded]);

  const bodyBind = derived(() => {
    return mergePartBind(
      customProps?.body,
      {},
      cn({
        grow: true,
        [get(paddingClass, "body") ?? ""]: true,
        [get(variantClass, "text") ?? ""]: true,
        [get(mergedClasses, "body") ?? ""]: true,
      }),
    );
  });

  const footerBind = derived(() => {
    return mergePartBind(
      customProps?.footer,
      {},
      cn({
        "border-t": showDividers,
        [get(paddingClass, "footer") ?? ""]: true,
        [get(variantClass, "border") ?? ""]: showDividers,
        [get(variantClass, "footer") ?? ""]: true,
        [get(roundedClass, "footer") ?? ""]: true,
        [get(mergedClasses, "footer") ?? ""]: true,
      }),
    );
  });

  const headerBind = derived(() => {
    return mergePartBind(
      customProps?.header,
      {},
      cn({
        "flex items-center justify-between": true,
        "border-b": showDividers,
        [get(paddingClass, "header") ?? ""]: true,
        [get(variantClass, "border") ?? ""]: showDividers,
        [get(roundedClass, "header") ?? ""]: true,
        [get(mergedClasses, "header") ?? ""]: true,
      }),
    );
  });

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex w-full flex-col": true,
        [shadowClass ?? ""]: true,
        [get(roundedClass, "root") ?? ""]: true,
        [get(variantClass, "root") ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    );
  });

  const titleBind = derived(() => {
    return mergePartBind(
      customProps?.title,
      {},
      cn({
        "text-base font-medium whitespace-normal": true,
        [get(variantClass, "text") ?? ""]: true,
        [get(mergedClasses, "title") ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    bodyBind,
    children,
    rootBind,
    hasFooter,
    titleBind,
    footerBind,
    headerBind,
    hasDefaultBody,
  };
}
