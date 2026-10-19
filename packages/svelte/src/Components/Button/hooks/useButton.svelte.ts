// ** External Imports
import { get, includes, isNil, omit } from "es-toolkit/compat";

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
  ButtonSnippets,
} from "@/Components/Button/button.types";
import { getButtonGroupContext } from "@/Components/ButtonGroup/buttonGroupContext";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import { resolveLinkAsProps, type LinkAsTag } from "@/Utils/linkAs";

const buttonBridgeKeys = [
  "as",
  "full",
  "href",
  "icon",
  "size",
  "text",
  "color",
  "linkAs",
  "classes",
  "density",
  "endIcon",
  "loading",
  "rounded",
  "variant",
  "disabled",
  "selected",
  "linkProps",
  "startIcon",
  "customProps",
] as const satisfies readonly (keyof ButtonOwnProps)[];

const buttonSnippetKeys = [
  "end",
  "start",
  "children",
] as const satisfies readonly (keyof ButtonSnippets)[];

type ButtonLibDefaults = LibDefaultsShape<
  ButtonOwnProps,
  "as" | "size" | "color" | "density" | "rounded" | "variant"
>;

type ButtonMerged<T extends LinkAsTag = "button"> = MergeLibDefaults<
  ButtonOwnProps<T>,
  ButtonLibDefaults
>;

export function useButton<T extends LinkAsTag = "button">(
  props: () => ButtonProps<T>,
  libDefaults: ButtonLibDefaults,
) {
  const groupContext = getButtonGroupContext();

  const split = $derived.by(() => {
    const { componentProps, inheritedAttrs } = splitComponentProps<
      ButtonOwnProps<T>,
      typeof buttonBridgeKeys
    >({
      bridgeKeys: buttonBridgeKeys,
      props: { ...props() } as ButtonOwnProps<T>,
    });

    return {
      componentProps,
      // Snippets render inside the button; they are not element attributes.
      inheritedAttrs: omit(inheritedAttrs, buttonSnippetKeys),
    };
  });

  const resolvedProps = $derived.by(() => {
    const componentProps = split.componentProps;
    const group = groupContext?.();

    return {
      ...componentProps,
      size: componentProps.size ?? group?.size,
      color: componentProps.color ?? group?.color,
      density: componentProps.density ?? group?.density,
      rounded: componentProps.rounded ?? group?.rounded,
      variant: componentProps.variant ?? group?.variant,
    };
  });

  const bridgeButton = useBridgeUIComponent<ButtonMerged<T>, "Button">({
    libDefaults,
    componentName: "Button",
    props: () => resolvedProps,
  });

  const customProps = $derived(bridgeButton.merged.customProps);

  const mergedClasses = useBridgeUIMergedRegistryClasses<ButtonClasses>(() => {
    return {
      entry: bridgeButton.entry,
      props: split.componentProps,
    };
  });

  const tag = $derived.by(() => {
    const explicitAs = split.componentProps.as;
    const linkAs = bridgeButton.merged.linkAs;
    const blocked = Boolean(
      bridgeButton.merged.disabled || bridgeButton.merged.loading,
    );

    if (explicitAs === "button" || explicitAs === "span") {
      return explicitAs;
    }

    const anchorByDefault =
      explicitAs === "a" ||
      (explicitAs == null &&
        (bridgeButton.merged.as === "a" ||
          Boolean(linkAs && bridgeButton.merged.href)));

    if (!anchorByDefault) {
      return bridgeButton.merged.as ?? "button";
    }

    if (blocked || linkAs == null) {
      return "a";
    }

    return linkAs;
  });

  const isAnchor = $derived.by(() => {
    return tag !== "button" && tag !== "span";
  });

  const isButton = $derived.by(() => {
    return tag === "button";
  });

  const isMini = $derived.by(() => {
    return bridgeButton.merged.density === "mini";
  });

  const isDisabled = $derived.by(() => {
    return bridgeButton.merged.disabled || bridgeButton.merged.loading;
  });

  const rootDisabled = $derived.by(() => {
    return isButton ? isDisabled : undefined;
  });

  const rootAriaBusy = $derived.by(() => {
    return bridgeButton.merged.loading ? true : undefined;
  });

  const rootAriaDisabled = $derived.by(() => {
    return isDisabled && !isButton ? true : undefined;
  });

  const rootHref = $derived.by(() => {
    if (!isAnchor || isDisabled || !bridgeButton.merged.href) {
      return undefined;
    }

    return bridgeButton.merged.href;
  });

  const rootType = $derived.by(() => {
    if (!isButton) {
      return undefined;
    }

    const type = get(split.inheritedAttrs, "type");

    if (includes(["submit", "reset", "button"], type)) {
      return type;
    }

    return "button";
  });

  const sizeClass = $derived.by(() => {
    const classes = mergeBridgeUILayeredClasses(
      densityProps,
      bridgeButton.entry?.tokens?.density,
    );

    return get(classes, [
      bridgeButton.merged.density,
      bridgeButton.merged.size,
    ]);
  });

  const variantKey = $derived.by(() => {
    if (!isNil(resolvedProps.variant)) {
      return resolvedProps.variant;
    }

    if (!isNil(groupContext)) {
      return bridgeButton.merged.variant;
    }

    return isMini ? "flat" : bridgeButton.merged.variant;
  });

  const colorClasses = $derived.by(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeButton.entry?.tokens?.variant,
    );

    return get(classes, [variantKey, bridgeButton.merged.color]);
  });

  const roundedClass = $derived.by(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeButton.entry?.tokens?.rounded,
    );

    return get(classes, bridgeButton.merged.rounded);
  });

  const iconBind = $derived.by(() => {
    return mergePartBind(
      customProps?.icon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses().icon ?? ""]: true,
      }),
    );
  });

  const rootBind = $derived.by(() => {
    const bind = mergePartBind(
      customProps?.root,
      {
        ...split.inheritedAttrs,
        ...resolveLinkAsProps(
          bridgeButton.merged.linkAs,
          bridgeButton.merged.linkProps,
          tag,
        ),
      },
      {
        "aria-pressed": isNil(bridgeButton.merged.selected)
          ? undefined
          : bridgeButton.merged.selected,
        class: cn({
          "inline-flex items-center justify-center": true,
          "cursor-pointer outline-none outline-hidden": true,
          "shrink-0": isMini,
          [sizeClass ?? ""]: true,
          [roundedClass ?? ""]: true,
          "h-auto":
            isMini &&
            !isNil(groupContext) &&
            groupContext()?.density !== "mini",
          "border border-transparent":
            !isNil(groupContext) && variantKey !== "outline",
          "w-full": !isMini && bridgeButton.merged.full,
          "w-fit": !isMini && !bridgeButton.merged.full,
          "group hover:shadow-xs": !isMini,
          [get(colorClasses, "base") ?? ""]: true,
          [get(colorClasses, "hover") ?? ""]: true,
          [get(colorClasses, "focus") ?? ""]: true,
          [get(colorClasses, "selected") ?? ""]:
            bridgeButton.merged.selected === true,
          relative: true,
          "z-10": bridgeButton.merged.selected === true,
          "transition-all ease-in-out duration-200": true,
          "focus:ring-2": true,
          "focus:ring-offset-background-white dark:focus:ring-offset-background-dark": true,
          "disabled:opacity-80 disabled:cursor-not-allowed": true,
          "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none": true,
          [mergedClasses().root ?? ""]: true,
        }),
      },
    );

    if (rootType == null) {
      return bind;
    }

    return { ...bind, type: rootType };
  });

  const endIconBind = $derived.by(() => {
    return mergePartBind(
      customProps?.endIcon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses().endIcon ?? ""]: true,
      }),
    );
  });

  const endSlotBind = $derived.by(() => {
    return mergePartBind(
      customProps?.end,
      {},
      "inline-flex shrink-0 items-center",
    );
  });

  const startIconBind = $derived.by(() => {
    return mergePartBind(
      customProps?.startIcon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses().startIcon ?? ""]: true,
      }),
    );
  });

  const startSlotBind = $derived.by(() => {
    return mergePartBind(
      customProps?.start,
      {},
      "inline-flex shrink-0 items-center",
    );
  });

  const loadingWrapBind = $derived.by(() => {
    return mergePartBind(
      {},
      {},
      "pointer-events-none absolute inset-0 flex items-center justify-center",
    );
  });

  const contentBind = $derived.by(() => {
    return mergePartBind(
      {},
      {},
      cn({
        contents: true,
        invisible: bridgeButton.merged.loading,
      }),
    );
  });

  const loadingIconBind = $derived.by(() => {
    return mergePartBind(
      customProps?.loading,
      {},
      cn({
        "shrink-0 animate-spin": true,
        [mergedClasses().loading ?? ""]: true,
      }),
    );
  });

  return {
    get tag() {
      return tag;
    },
    get merged() {
      return bridgeButton.merged;
    },
    get isMini() {
      return isMini;
    },
    get iconBind() {
      return iconBind;
    },
    get rootBind() {
      return rootBind;
    },
    get rootHref() {
      return rootHref;
    },
    get rootType() {
      return rootType;
    },
    get endIconBind() {
      return endIconBind;
    },
    get contentBind() {
      return contentBind;
    },
    get endSlotBind() {
      return endSlotBind;
    },
    get rootAriaBusy() {
      return rootAriaBusy;
    },
    get rootDisabled() {
      return rootDisabled;
    },
    get startIconBind() {
      return startIconBind;
    },
    get startSlotBind() {
      return startSlotBind;
    },
    get loadingIconBind() {
      return loadingIconBind;
    },
    get loadingWrapBind() {
      return loadingWrapBind;
    },
    get rootAriaDisabled() {
      return rootAriaDisabled;
    },
  };
}
