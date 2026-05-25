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
  colorProps,
  sizeProps,
  underlineProps,
} from "@bridge-ui/core/Components/Link";

// ** Local Imports
import type {
  LinkClasses,
  LinkOwnProps,
  LinkProps,
} from "@/Components/Link/link.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const linkBridgeKeys = [
  "href",
  "size",
  "color",
  "classes",
  "disabled",
  "external",
  "leftIcon",
  "rightIcon",
  "underline",
  "partsProps",
] as const satisfies readonly (keyof LinkOwnProps)[];

type LinkLibDefaults = LibDefaultsShape<
  LinkOwnProps,
  "color" | "size" | "underline"
>;

type LinkMerged = MergeLibDefaults<LinkOwnProps, LinkLibDefaults>;

export function useLink(props: LinkOwnProps, libDefaults: LinkLibDefaults) {
  // Setup
  const attrs = useAttrs();
  const slots = useSlots();

  const split = computed(() => {
    return splitComponentProps<LinkProps, typeof linkBridgeKeys>({
      bridgeKeys: linkBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { entry: bridgeLink, merged } = useBridgeUIComponent<
    LinkMerged,
    "Link"
  >({
    libDefaults,
    componentName: "Link",
    props: () => split.value.customProps,
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<LinkClasses>({
    entry: bridgeLink,
    props: () => split.value.customProps,
  });

  // Elements
  const isDisabled = computed(() => {
    return Boolean(merged.value.disabled);
  });

  const rootAriaDisabled = computed(() => {
    return isDisabled.value ? true : undefined;
  });

  const rootHref = computed(() => {
    return isDisabled.value ? undefined : merged.value.href;
  });

  const rootTarget = computed(() => {
    if (merged.value.external && !isDisabled.value) {
      return "_blank";
    }

    return undefined;
  });

  const rootRel = computed(() => {
    if (merged.value.external && !isDisabled.value) {
      return "noopener noreferrer";
    }

    return undefined;
  });

  // Classes
  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeLink.value?.customProps?.size,
    );

    return get(classes, merged.value.size);
  });

  const underlineClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      underlineProps,
      bridgeLink.value?.customProps?.underline,
    );

    return get(classes, merged.value.underline);
  });

  const colorClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeLink.value?.customProps?.color,
    );

    return get(classes, merged.value.color);
  });

  // Binds
  const leftIconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.leftIcon,
      {},
      cn({
        // Theme classes
        "shrink-0": true,
        // Custom classes
        [mergedClasses.value.leftIcon ?? ""]: true,
      }),
    );
  });

  const rightIconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.rightIcon,
      {},
      cn({
        // Theme classes
        "shrink-0": true,
        // Custom classes
        [mergedClasses.value.rightIcon ?? ""]: true,
      }),
    );
  });

  const rootBind = computed(() => {
    return mergePartBind(
      partsProps.value?.root,
      split.value.inheritedAttrs,
      cn({
        // Theme classes
        "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none": true,
        "inline-flex items-center gap-x-1 font-medium transition-colors duration-200": true,
        [get(colorClass.value, "hover") ?? ""]: true,
        [get(colorClass.value, "base") ?? ""]: true,
        [underlineClass.value ?? ""]: true,
        [sizeClass.value ?? ""]: true,
        // Custom classes
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    rootRel,
    rootBind,
    rootHref,
    rootTarget,
    leftIconBind,
    rightIconBind,
    rootAriaDisabled,
  };
}
