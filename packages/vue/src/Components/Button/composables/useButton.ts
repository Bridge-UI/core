// ** External Imports
import { get, isNil } from "es-toolkit/compat";
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
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<ButtonProps, typeof buttonBridgeKeys>({
      bridgeKeys: buttonBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeButton } = useBridgeUIComponent<
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

  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      densityProps,
      bridgeButton.value?.customProps?.density,
    );

    return get(classes, [merged.value.density, merged.value.size]);
  });

  const variantKey = computed(() => {
    if (!isNil(split.value.customProps.variant)) {
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

  const iconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.icon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses.value.icon ?? ""]: true,
      }),
    );
  });

  const rootBind = computed(() => {
    return mergePartBind(
      partsProps.value?.root,
      split.value.inheritedAttrs,
      cn({
        "inline-flex items-center justify-center": true,
        "cursor-pointer outline-none outline-hidden": true,
        "shrink-0": isMini.value,
        [sizeClass.value ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        "w-full": !isMini.value && merged.value.full,
        "w-fit": !isMini.value && !merged.value.full,
        "group hover:shadow-xs": !isMini.value,
        [get(colorClasses.value, "base") ?? ""]: true,
        [get(colorClasses.value, "hover") ?? ""]: true,
        [get(colorClasses.value, "focus") ?? ""]: true,
        "transition-all ease-in-out duration-200": true,
        "focus:ring-2": true,
        "focus:ring-offset-background-white dark:focus:ring-offset-background-dark": true,
        "disabled:opacity-80 disabled:cursor-not-allowed": true,
        "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none": true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const endIconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.endIcon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses.value.endIcon ?? ""]: true,
      }),
    );
  });

  const endSlotBind = computed(() => {
    return mergePartBind(
      partsProps.value?.end,
      {},
      "inline-flex shrink-0 items-center",
    );
  });

  const startIconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.startIcon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses.value.startIcon ?? ""]: true,
      }),
    );
  });

  const startSlotBind = computed(() => {
    return mergePartBind(
      partsProps.value?.start,
      {},
      "inline-flex shrink-0 items-center",
    );
  });

  const loadingIconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.loading,
      {},
      cn({
        "shrink-0 animate-spin": true,
        [mergedClasses.value.loading ?? ""]: true,
      }),
    );
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
