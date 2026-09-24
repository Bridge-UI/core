// ** External Imports
import { get, omit, pick } from "es-toolkit/compat";
import { computed, inject, useAttrs, useSlots } from "vue";

// ** Core Imports
import type { IconSize } from "@bridge-ui/core/Tokens";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { BREADCRUMB_INJECTION_KEY } from "@/Components/Breadcrumb/breadcrumbInjectionKey";
import type {
  BreadcrumbItemOwnProps,
  BreadcrumbItemProps,
} from "@/Components/BreadcrumbItem/breadcrumbItem.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import { resolveLinkAsProps, type LinkAsTag } from "@/Utils/linkAs";

const breadcrumbItemBridgeKeys = [
  "as",
  "href",
  "linkAs",
  "classes",
  "current",
  "endIcon",
  "disabled",
  "linkProps",
  "startIcon",
  "customProps",
] as const satisfies readonly (keyof BreadcrumbItemOwnProps)[];

export function useBreadcrumbItem<T extends LinkAsTag = "a">(
  props: BreadcrumbItemOwnProps<T>,
) {
  const attrs = useAttrs();
  const slots = useSlots();

  const injectedBreadcrumbContext = inject(BREADCRUMB_INJECTION_KEY, null);

  if (!injectedBreadcrumbContext) {
    throw new Error("BreadcrumbItem must be used within a Breadcrumb provider");
  }

  const breadcrumb = injectedBreadcrumbContext;

  const split = computed(() => {
    return splitComponentProps<
      BreadcrumbItemProps<T>,
      typeof breadcrumbItemBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: breadcrumbItemBridgeKeys,
    });
  });

  const { merged, entry: bridgeBreadcrumbItem } = useBridgeUIComponent<
    BreadcrumbItemOwnProps<T>,
    "BreadcrumbItem"
  >({
    componentName: "BreadcrumbItem",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const current = computed(() => {
    return merged.value.current === true;
  });

  const disabled = computed(() => {
    return merged.value.disabled === true;
  });

  const iconSize = computed(() => {
    return (breadcrumb.value.tokenClasses.iconSize ?? "md") as keyof IconSize;
  });

  const crumbAs = computed(() => {
    if (current.value || disabled.value) {
      return "span" as const;
    }

    if (merged.value.as === "button" || merged.value.as === "span") {
      return merged.value.as;
    }

    const isAnchor = merged.value.as === "a" || merged.value.href != null;

    if (!isAnchor) {
      return "span" as const;
    }

    return merged.value.linkAs ?? breadcrumb.value.linkAs ?? ("a" as const);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeBreadcrumbItem,
    props: () => split.value.componentProps,
  });

  const linkInheritedAttrs = computed(() => {
    return pick(split.value.inheritedAttrs, ["aria-label", "aria-labelledby"]);
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["aria-label", "aria-labelledby"]);
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, rootInheritedAttrs.value, {
      class: cn({
        [breadcrumb.value.tokenClasses.item ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  const separatorBind = computed(() => {
    return mergePartBind(
      {},
      {},
      {
        "aria-hidden": true,
        "data-slot": "separator",
        class: cn({
          [breadcrumb.value.tokenClasses.separator ?? ""]: true,
          [breadcrumb.value.separatorClass ?? ""]: true,
          [get(mergedClasses.value, "separator") ?? ""]: true,
        }),
      },
    );
  });

  const separatorIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.separator ?? breadcrumb.value.separatorIconProps,
      {},
      {
        size: iconSize.value,
        class: cn({
          "shrink-0": true,
        }),
      },
    );
  });

  const linkBind = computed(() => {
    const isCurrent = current.value;
    const partProps = isCurrent
      ? customProps.value?.current
      : customProps.value?.link;

    return mergePartBind(
      partProps,
      {
        ...linkInheritedAttrs.value,
        ...resolveLinkAsProps(
          merged.value.linkAs ?? breadcrumb.value.linkAs,
          merged.value.linkProps,
          crumbAs.value,
        ),
      },
      {
        "aria-disabled": disabled.value || undefined,
        "aria-current": isCurrent ? ("page" as const) : undefined,
        href: !isCurrent && !disabled.value ? merged.value.href : undefined,
        class: cn({
          [isCurrent
            ? (breadcrumb.value.tokenClasses.current ?? "")
            : (breadcrumb.value.tokenClasses.link ?? "")]: true,
          [get(mergedClasses.value, isCurrent ? "current" : "link") ?? ""]:
            true,
          "pointer-events-none opacity-50": disabled.value && !isCurrent,
        }),
      },
    );
  });

  const startIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.startIcon,
      {},
      {
        size: iconSize.value,
        class: cn({
          "shrink-0": true,
          [get(mergedClasses.value, "startIcon") ?? ""]: true,
        }),
      },
    );
  });

  const endIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.endIcon,
      {},
      {
        size: iconSize.value,
        class: cn({
          "shrink-0": true,
          [get(mergedClasses.value, "endIcon") ?? ""]: true,
        }),
      },
    );
  });

  const separatorContent = computed(() => {
    if (slots.separator) {
      return slots.separator;
    }

    return breadcrumb.value.separatorSlot;
  });

  const separatorIcon = computed(() => {
    return breadcrumb.value.separator;
  });

  return {
    slots,
    merged,
    crumbAs,
    rootBind,
    linkBind,
    iconSize,
    endIconBind,
    startIconBind,
    separatorBind,
    separatorIcon,
    separatorContent,
    separatorIconBind,
  };
}
