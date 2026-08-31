// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { computed, inject, provide, useAttrs } from "vue";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ListOwnProps, ListProps } from "@/Components/List/list.types";
import { LIST_INJECTION_KEY } from "@/Components/List/listInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const listBridgeKeys = [
  "as",
  "dense",
  "nested",
  "classes",
  "iconOnly",
  "customProps",
] as const satisfies readonly (keyof ListOwnProps)[];

export function useList(props: ListOwnProps) {
  const attrs = useAttrs();
  const parentList = inject(LIST_INJECTION_KEY, null);

  const split = computed(() => {
    return splitComponentProps<ListProps, typeof listBridgeKeys>({
      bridgeKeys: listBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeList } = useBridgeUIComponent<
    ListOwnProps,
    "List"
  >({
    componentName: "List",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeList,
    props: () => split.value.componentProps,
  });

  const contextValue = computed(() => {
    return {
      dense: merged.value.dense === true,
      iconOnly:
        merged.value.iconOnly === true || parentList?.value.iconOnly === true,
    };
  });

  provide(LIST_INJECTION_KEY, contextValue);

  const hideNestedSubmenu = computed(() => {
    return merged.value.nested === true && contextValue.value.iconOnly;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, []);
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, rootInheritedAttrs.value, {
      hidden: hideNestedSubmenu.value ? true : undefined,
      class: cn({
        "m-0 flex list-none flex-col gap-1 text-dark-900 dark:text-dark-100": true,
        "px-2 py-2": !merged.value.nested,
        "ml-3.5 translate-x-px border-l border-dark-200 py-0.5 pl-2.5 dark:border-dark-700":
          merged.value.nested,
        hidden: hideNestedSubmenu.value,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    rootBind,
  };
}
