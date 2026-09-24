// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, provide, useAttrs, useSlots } from "vue";

// ** Core Imports
import { collapseBreadcrumbItems } from "@bridge-ui/core/Domain";
import { breadcrumbSizeProps as sizeProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  BreadcrumbOwnProps,
  BreadcrumbProps,
} from "@/Components/Breadcrumb/breadcrumb.types";
import {
  BREADCRUMB_INJECTION_KEY,
  type BreadcrumbContextValue,
} from "@/Components/Breadcrumb/breadcrumbInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import type { LinkAsTag } from "@/Utils/linkAs";

const breadcrumbBridgeKeys = [
  "size",
  "items",
  "linkAs",
  "classes",
  "maxItems",
  "separator",
  "customProps",
] as const satisfies readonly (keyof BreadcrumbOwnProps)[];

type BreadcrumbLibDefaults = LibDefaultsShape<
  BreadcrumbOwnProps,
  "size" | "separator"
>;

type BreadcrumbMerged<T extends LinkAsTag = "a"> = MergeLibDefaults<
  BreadcrumbOwnProps<T>,
  BreadcrumbLibDefaults
>;

export function useBreadcrumb<T extends LinkAsTag = "a">(
  props: BreadcrumbOwnProps<T>,
  libDefaults: BreadcrumbLibDefaults,
) {
  const attrs = useAttrs();
  const slots = useSlots();

  const split = computed(() => {
    return splitComponentProps<BreadcrumbProps<T>, typeof breadcrumbBridgeKeys>(
      {
        props: { ...attrs, ...props },
        bridgeKeys: breadcrumbBridgeKeys,
      },
    );
  });

  const { merged, entry: bridgeBreadcrumb } = useBridgeUIComponent<
    BreadcrumbMerged<T>,
    "Breadcrumb"
  >({
    libDefaults,
    componentName: "Breadcrumb",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const collapsedItems = computed(() => {
    return collapseBreadcrumbItems(
      merged.value.items ?? [],
      merged.value.maxItems,
    );
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeBreadcrumb,
    props: () => split.value.componentProps,
  });

  const sizeClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeBreadcrumb.value?.tokens?.size,
    );
  });

  const sizeItem = computed(() => {
    return get(sizeClasses.value, merged.value.size);
  });

  const contextValue = computed((): BreadcrumbContextValue => {
    return {
      linkAs: merged.value.linkAs,
      separator: merged.value.separator,
      separatorIconProps: customProps.value?.separator,
      separatorClass: get(mergedClasses.value, "separator"),
      separatorSlot: slots.separator ? () => slots.separator?.() : undefined,
      tokenClasses: {
        item: get(sizeItem.value, "item"),
        link: get(sizeItem.value, "link"),
        iconSize: get(sizeItem.value, "icon"),
        current: get(sizeItem.value, "current"),
        separator: get(sizeItem.value, "separator"),
      },
    };
  });

  provide(BREADCRUMB_INJECTION_KEY, contextValue);

  const rootBind = computed(() => {
    const inherited = split.value.inheritedAttrs;

    return mergePartBind(customProps.value?.root, inherited, {
      "aria-label":
        (inherited as { "aria-label"?: string })["aria-label"] ?? "Breadcrumb",
      class: cn({
        [get(sizeItem.value, "root") ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  const listBind = computed(() => {
    return mergePartBind(
      customProps.value?.list,
      {},
      {
        role: "list",
        class: cn({
          [get(sizeItem.value, "list") ?? ""]: true,
          [get(mergedClasses.value, "list") ?? ""]: true,
          "[&>li:first-child_[data-slot=separator]]:hidden": true,
        }),
      },
    );
  });

  const hasDefaultSlot = computed(() => {
    return Boolean(slots.default?.().length);
  });

  return {
    merged,
    rootBind,
    listBind,
    contextValue,
    collapsedItems,
    hasDefaultSlot,
  };
}
