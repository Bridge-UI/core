// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { computed, inject, toValue, useAttrs } from "vue";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { LIST_INJECTION_KEY } from "@/Components/List/listInjectionKey";
import { LISTBOX_INJECTION_KEY } from "@/Components/Listbox/listboxInjectionKey";
import type {
  ListSectionOwnProps,
  ListSectionProps,
} from "@/Components/ListSection/listSection.types";
import { LIST_SECTION_INJECTION_KEY } from "@/Components/ListSection/listSectionInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const listSectionBridgeKeys = [
  "as",
  "inset",
  "title",
  "sticky",
  "classes",
  "customProps",
] as const satisfies readonly (keyof ListSectionOwnProps)[];

export function useListSection(props: ListSectionOwnProps) {
  const attrs = useAttrs();

  const listContext = inject(LIST_INJECTION_KEY, null);
  const listSection = inject(LIST_SECTION_INJECTION_KEY, null);
  const listboxContextRef = inject(LISTBOX_INJECTION_KEY, null);

  const listboxContext = computed(() => {
    return listboxContextRef ? toValue(listboxContextRef) : null;
  });

  const split = computed(() => {
    return splitComponentProps<ListSectionProps, typeof listSectionBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: listSectionBridgeKeys,
    });
  });

  const { merged, entry: bridgeListSection } = useBridgeUIComponent<
    ListSectionOwnProps,
    "ListSection"
  >({
    componentName: "ListSection",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeListSection,
    props: () => split.value.componentProps,
  });

  const isDense = computed(() => {
    return listContext ? toValue(listContext).dense : false;
  });

  const isHidden = computed(() => {
    return listSection ? toValue(listSection).hidden : false;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, []);
  });

  const isDivRoot = computed(() => {
    return merged.value.as === "div";
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "mt-1 list-none first:mt-0": true,
        "sticky top-0 z-10 bg-white dark:bg-dark-800":
          merged.value.sticky && !isDivRoot.value,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    );
  });

  const titleBind = computed(() => {
    return mergePartBind(
      customProps.value?.title,
      {},
      {
        role: "presentation",
        class: cn({
          "text-xs font-medium text-dark-500 dark:text-dark-400": true,
          "sticky top-0 z-10 bg-white dark:bg-dark-800":
            merged.value.sticky && isDivRoot.value,
          "px-2": isNil(listboxContextRef),
          "py-1": isNil(listboxContextRef) && isDense.value,
          "py-1.5": isNil(listboxContextRef) && !isDense.value,
          [listboxContext.value?.sizeClasses?.option ?? ""]:
            !isNil(listboxContextRef),
          "pl-14": merged.value.inset,
          [get(mergedClasses.value, "title") ?? ""]: true,
        }),
      },
    );
  });

  return {
    merged,
    rootBind,
    isHidden,
    titleBind,
  };
}
