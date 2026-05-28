// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  densityProps,
  roundedProps,
  variantProps,
} from "@bridge-ui/core/Components/Button";

// ** Local Imports
import type {
  ButtonClasses,
  ButtonOwnProps,
  ButtonProps,
} from "@/Components/Button/button.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const buttonBridgeKeys = [
  "as",
  "full",
  "href",
  "icon",
  "size",
  "text",
  "color",
  "classes",
  "density",
  "endIcon",
  "loading",
  "rounded",
  "variant",
  "disabled",
  "startIcon",
  "partsProps",
] as const satisfies readonly (keyof ButtonOwnProps)[];

type ButtonLibDefaults = LibDefaultsShape<
  ButtonOwnProps,
  "as" | "color" | "density" | "rounded" | "size" | "variant"
>;

type ButtonMerged = MergeLibDefaults<ButtonOwnProps, ButtonLibDefaults>;

export function useButton(
  props: ButtonOwnProps,
  libDefaults: ButtonLibDefaults,
) {
  // Setup
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<ButtonProps, typeof buttonBridgeKeys>({
      bridgeKeys: buttonBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { entry: bridgeButton, merged } = useBridgeUIComponent<
    ButtonMerged,
    "Button"
  >({
    libDefaults,
    componentName: "Button",
    props: () => split.value.customProps,
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ButtonClasses>({
    entry: bridgeButton,
    props: () => split.value.customProps,
  });

  // Elements
  const tag = computed(() => {
    return merged.value.as ?? "button";
  });

  const isAnchor = computed(() => {
    return tag.value === "a";
  });

  const isButton = computed(() => {
    return tag.value === "button";
  });

  const isMini = computed(() => {
    return merged.value.density === "mini";
  });

  const isDisabled = computed(() => {
    return merged.value.disabled || merged.value.loading;
  });

  const rootType = computed(() => {
    return isButton.value ? ("button" as const) : undefined;
  });

  const rootDisabled = computed(() => {
    return isButton.value ? isDisabled.value : undefined;
  });

  const rootAriaBusy = computed(() => {
    return merged.value.loading ? true : undefined;
  });

  const rootAriaDisabled = computed(() => {
    return isDisabled.value && !isButton.value ? true : undefined;
  });

  const rootHref = computed(() => {
    if (!isAnchor.value || isDisabled.value || !merged.value.href) {
      return undefined;
    }

    return merged.value.href;
  });

  // Classes
  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      densityProps,
      bridgeButton.value?.customProps?.density,
    );

    return get(classes, [merged.value.density, merged.value.size]);
  });

  const variantKey = computed(() => {
    if (split.value.customProps.variant !== undefined) {
      return split.value.customProps.variant;
    }

    return isMini.value ? "flat" : merged.value.variant;
  });

  const colorClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeButton.value?.customProps?.variant,
    );

    return get(classes, [variantKey.value, merged.value.color]);
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeButton.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  // Binds
  // prettier-ignore
  const iconBind = computed(() => {
    return mergePartBind(partsProps.value?.icon, {}, cn({
      // Theme classes
      "shrink-0": true,
      // Custom classes
      [mergedClasses.value.icon ?? ""]: true,
    }));
  });

  // prettier-ignore
  const rootBind = computed(() => {
    return mergePartBind(partsProps.value?.root, split.value.inheritedAttrs, cn({
      // Theme classes
      'aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none': true,
      "cursor-pointer outline-none outline-hidden inline-flex items-center justify-center": true,
      "focus:ring-offset-background-white dark:focus:ring-offset-background-dark": true,
      "transition-all ease-in-out duration-200 focus:ring-2": true,
      "disabled:opacity-80 disabled:cursor-not-allowed": true,
      [get(colorClasses.value, 'focus') ?? ""]: true,
      [get(colorClasses.value, 'hover') ?? ""]: true,
      [get(colorClasses.value, 'base') ?? ""]: true,
      "w-full": !isMini.value && merged.value.full,
      "w-fit": !isMini.value && !merged.value.full,
      "group hover:shadow-xs": !isMini.value,
      [roundedClass.value ?? ""]: true,
      [sizeClass.value ?? ""]: true,
      "shrink-0": isMini.value,
      // Custom classes
      [mergedClasses.value.root ?? ""]: true
    }));
  });

  // prettier-ignore
  const endIconBind = computed(() => {
    return mergePartBind(partsProps.value?.endIcon, {}, cn({
      // Theme classes
      "shrink-0": true,
      // Custom classes
      [mergedClasses.value.endIcon ?? ""]: true,
    }));
  });

  // prettier-ignore
  const endSlotBind = computed(() => {
    return mergePartBind(partsProps.value?.end, {}, "inline-flex shrink-0 items-center");
  });

  // prettier-ignore
  const startIconBind = computed(() => {
    return mergePartBind(partsProps.value?.startIcon, {}, cn({
      // Theme classes
      "shrink-0": true,
      // Custom classes
      [mergedClasses.value.startIcon ?? ""]: true,
    }));
  });

  // prettier-ignore
  const startSlotBind = computed(() => {
    return mergePartBind(partsProps.value?.start, {}, "inline-flex shrink-0 items-center");
  });

  // prettier-ignore
  const loadingIconBind = computed(() => {
    return mergePartBind(partsProps.value?.loading, {}, cn({
      // Theme classes
      "shrink-0 animate-spin": true,
      // Custom classes
      [mergedClasses.value.loading ?? ""]: true,
    }));
  });

  return {
    tag,
    merged,
    isMini,
    iconBind,
    rootBind,
    rootHref,
    rootType,
    endIconBind,
    endSlotBind,
    rootAriaBusy,
    rootDisabled,
    startIconBind,
    startSlotBind,
    loadingIconBind,
    rootAriaDisabled,
  };
}
