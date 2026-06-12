// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs, useSlots } from "vue";

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
} from "@bridge-ui/core/Components/Card";

// ** Local Imports
import type { CardOwnProps, CardProps } from "@/Components/Card/card.types";
import {
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

export function useCard(props: CardOwnProps, libDefaults: CardLibDefaults) {
  const attrs = useAttrs();
  const slots = useSlots();

  const split = computed(() => {
    return splitComponentProps<CardProps, typeof cardBridgeKeys>({
      bridgeKeys: cardBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeCard } = useBridgeUIComponent<
    CardMerged,
    "Card"
  >({
    libDefaults,
    componentName: "Card",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeCard,
    props: () => split.value.componentProps,
  });

  const hasDefaultBody = computed(() => {
    const content = slots.default?.();

    return Boolean(content && content.length > 0);
  });

  const hasFooter = computed(() => {
    return hasNamedSlot(slots, "footer");
  });

  const variantClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeCard.value?.customProps?.variant,
    );

    return get(classes, merged.value.variant);
  });

  const showDividers = computed(() => {
    if (merged.value.borderless) {
      return false;
    }

    return Boolean(get(variantClass.value, "border"));
  });

  const shadowClass = computed(() => {
    if (merged.value.variant !== "elevated") {
      return undefined;
    }

    const classes = mergeBridgeUILayeredClasses(
      shadowProps,
      bridgeCard.value?.customProps?.shadow,
    );

    return get(classes, merged.value.shadow);
  });

  const paddingClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      paddingProps,
      bridgeCard.value?.customProps?.padding,
    );

    return get(classes, merged.value.padding);
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeCard.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const bodyBind = computed(() => {
    return mergePartBind(
      customProps.value?.body,
      {},
      cn({
        grow: true,
        [get(paddingClass.value, "body") ?? ""]: true,
        [get(variantClass.value, "text") ?? ""]: true,
        [get(mergedClasses.value, "body") ?? ""]: true,
      }),
    );
  });

  const footerBind = computed(() => {
    return mergePartBind(
      customProps.value?.footer,
      {},
      cn({
        "border-t": showDividers.value,
        [get(paddingClass.value, "footer") ?? ""]: true,
        [get(variantClass.value, "border") ?? ""]: showDividers.value,
        [get(variantClass.value, "footer") ?? ""]: true,
        [get(roundedClass.value, "footer") ?? ""]: true,
        [get(mergedClasses.value, "footer") ?? ""]: true,
      }),
    );
  });

  const headerBind = computed(() => {
    return mergePartBind(
      customProps.value?.header,
      {},
      cn({
        "flex items-center justify-between": true,
        "border-b": showDividers.value,
        [get(paddingClass.value, "header") ?? ""]: true,
        [get(variantClass.value, "border") ?? ""]: showDividers.value,
        [get(roundedClass.value, "header") ?? ""]: true,
        [get(mergedClasses.value, "header") ?? ""]: true,
      }),
    );
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      split.value.inheritedAttrs,
      cn({
        "flex w-full flex-col": true,
        [shadowClass.value ?? ""]: true,
        [get(roundedClass.value, "root") ?? ""]: true,
        [get(variantClass.value, "root") ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    );
  });

  const titleBind = computed(() => {
    return mergePartBind(
      customProps.value?.title,
      {},
      cn({
        "text-base font-medium whitespace-normal": true,
        [get(variantClass.value, "text") ?? ""]: true,
        [get(mergedClasses.value, "title") ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    bodyBind,
    rootBind,
    hasFooter,
    titleBind,
    footerBind,
    headerBind,
    hasDefaultBody,
  };
}
