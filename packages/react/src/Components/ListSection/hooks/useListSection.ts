// ** External Imports
import { get, omit } from "es-toolkit/compat";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core";

// ** Local Imports
import { useListContext } from "@/Components/List/ListContext";
import type {
  ListSectionOwnProps,
  ListSectionProps,
} from "@/Components/ListSection/listSection.types";
import {
  derived,
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

export function useListSection(props: ListSectionProps) {
  const listContext = useListContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ListSectionProps,
    typeof listSectionBridgeKeys
  >({
    props,
    bridgeKeys: listSectionBridgeKeys,
  });

  const { merged, entry: bridgeListSection } = useBridgeUIComponent<
    ListSectionOwnProps,
    "ListSection"
  >({
    props: componentProps,
    componentName: "ListSection",
  });

  const children = derived(() => {
    return props.children;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgeListSection,
  });

  const isDense = derived(() => {
    return listContext?.dense ?? false;
  });

  const label = derived(() => {
    return merged.title ?? children;
  });

  const isDivRoot = derived(() => {
    return merged.as === "div";
  });

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "list-none": true,
        "sticky top-0 z-10 bg-white dark:bg-dark-950":
          merged.sticky && !isDivRoot,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    );
  });

  const titleBind = derived(() => {
    return mergePartBind(
      customProps?.title,
      {},
      {
        role: "presentation",
        className: cn({
          "bg-white px-4 text-xs font-semibold tracking-wide text-dark-500 uppercase dark:bg-dark-950 dark:text-dark-400": true,
          "sticky top-0 z-10": merged.sticky && isDivRoot,
          "py-2": !isDense,
          "py-1.5": isDense,
          "pl-14": merged.inset,
          [get(mergedClasses, "title") ?? ""]: true,
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
