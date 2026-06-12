// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { computed, inject, toValue, useAttrs, useSlots } from "vue";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core";

// ** Local Imports
import { LIST_INJECTION_KEY } from "@/Components/List/listInjectionKey";
import type {
  ListSectionOwnProps,
  ListSectionProps,
} from "@/Components/ListSection/listSection.types";
import {
  mergePartBind,
  resolveSlotOrProp,
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

export function useListSection(
  props: ListSectionOwnProps,
  slots: ReturnType<typeof useSlots>,
) {
  const attrs = useAttrs();

  const listContext = inject(LIST_INJECTION_KEY, null);

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

  const label = computed(() => {
    return resolveSlotOrProp(slots, "default", merged.value.title);
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, []);
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, rootInheritedAttrs.value, {
      class: cn({
        "list-none": true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  const titleBind = computed(() => {
    return mergePartBind(
      customProps.value?.title,
      {},
      {
        role: "presentation",
        class: cn({
          "bg-white px-4 text-xs font-semibold tracking-wide text-dark-500 uppercase": true,
          "sticky top-0 z-10": merged.value.sticky,
          "py-2": !isDense.value,
          "py-1.5": isDense.value,
          "pl-14": merged.value.inset,
          [get(mergedClasses.value, "title") ?? ""]: true,
        }),
      },
    );
  });

  return {
    label,
    merged,
    rootBind,
    titleBind,
  };
}
