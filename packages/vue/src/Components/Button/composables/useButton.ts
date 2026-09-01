// ** External Imports
import { get, includes, isNil } from "es-toolkit/compat";
import { computed, inject, useAttrs } from "vue";

// ** Core Imports
import {
  buttonDensityProps as densityProps,
  buttonRoundedProps as roundedProps,
  buttonVariantProps as variantProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ButtonClasses,
  ButtonOwnProps,
  ButtonProps,
} from "@/Components/Button/button.types";
import { BUTTON_GROUP_INJECTION_KEY } from "@/Components/ButtonGroup/buttonGroupInjectionKey";
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
  "selected",
  "startIcon",
  "customProps",
] as const satisfies readonly (keyof ButtonOwnProps)[];

type ButtonLibDefaults = LibDefaultsShape<
  ButtonOwnProps,
  "as" | "size" | "color" | "density" | "rounded" | "variant"
>;

type ButtonMerged = MergeLibDefaults<ButtonOwnProps, ButtonLibDefaults>;

export function useButton(
  props: ButtonOwnProps,
  libDefaults: ButtonLibDefaults,
) {
  const attrs = useAttrs();
  const groupContext = inject(BUTTON_GROUP_INJECTION_KEY, null);

  const split = computed(() => {
    return splitComponentProps<ButtonProps, typeof buttonBridgeKeys>({
      bridgeKeys: buttonBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const resolvedProps = computed(() => {
    const componentProps = split.value.componentProps;
    const group = groupContext?.value;

    return {
      ...componentProps,
      size: componentProps.size ?? group?.size,
      color: componentProps.color ?? group?.color,
      density: componentProps.density ?? group?.density,
      rounded: componentProps.rounded ?? group?.rounded,
      variant: componentProps.variant ?? group?.variant,
    };
  });

  const { merged, entry: bridgeButton } = useBridgeUIComponent<
    ButtonMerged,
    "Button"
  >({
    libDefaults,
    componentName: "Button",
    props: () => resolvedProps.value,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ButtonClasses>({
    entry: bridgeButton,
    props: () => split.value.componentProps,
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

  const rootType = computed(() => {
    if (!isButton.value) {
      return undefined;
    }

    const type = get(split.value.inheritedAttrs, "type");

    if (includes(["submit", "reset", "button"], type)) {
      return type;
    }

    return "button";
  });

  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      densityProps,
      bridgeButton.value?.tokens?.density,
    );

    return get(classes, [merged.value.density, merged.value.size]);
  });

  const variantKey = computed(() => {
    if (!isNil(resolvedProps.value.variant)) {
      return resolvedProps.value.variant;
    }

    if (!isNil(groupContext)) {
      return merged.value.variant;
    }

    return isMini.value ? "flat" : merged.value.variant;
  });

  const colorClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeButton.value?.tokens?.variant,
    );

    return get(classes, [variantKey.value, merged.value.color]);
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeButton.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const iconBind = computed(() => {
    return mergePartBind(
      customProps.value?.icon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses.value.icon ?? ""]: true,
      }),
    );
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      "aria-pressed": isNil(merged.value.selected)
        ? undefined
        : merged.value.selected,
      class: cn({
        "inline-flex items-center justify-center": true,
        "cursor-pointer outline-none outline-hidden": true,
        "shrink-0": isMini.value,
        [sizeClass.value ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        "h-full": !isNil(groupContext),
        "w-full": !isMini.value && merged.value.full,
        "w-fit": !isMini.value && !merged.value.full,
        "group hover:shadow-xs": !isMini.value,
        [get(colorClasses.value, "base") ?? ""]: true,
        [get(colorClasses.value, "hover") ?? ""]: true,
        [get(colorClasses.value, "focus") ?? ""]: true,
        [get(colorClasses.value, "selected") ?? ""]:
          merged.value.selected === true,
        "relative z-10": merged.value.selected === true,
        "transition-all ease-in-out duration-200": true,
        "focus:ring-2": true,
        "focus:ring-offset-background-white dark:focus:ring-offset-background-dark": true,
        "disabled:opacity-80 disabled:cursor-not-allowed": true,
        "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none": true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    });
  });

  const endIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.endIcon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses.value.endIcon ?? ""]: true,
      }),
    );
  });

  const endSlotBind = computed(() => {
    return mergePartBind(
      customProps.value?.end,
      {},
      "inline-flex shrink-0 items-center",
    );
  });

  const startIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.startIcon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses.value.startIcon ?? ""]: true,
      }),
    );
  });

  const startSlotBind = computed(() => {
    return mergePartBind(
      customProps.value?.start,
      {},
      "inline-flex shrink-0 items-center",
    );
  });

  const loadingIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.loading,
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
