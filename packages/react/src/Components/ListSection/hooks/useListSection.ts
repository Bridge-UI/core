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
  "partsProps",
] as const satisfies readonly (keyof ListSectionOwnProps)[];

export function useListSection(props: ListSectionProps) {
  const listContext = useListContext();

  const { customProps, inheritedAttrs } = splitComponentProps<
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
    props: customProps,
    componentName: "ListSection",
  });

  const children = derived(() => {
    return props.children;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: customProps,
    entry: bridgeListSection,
  });

  const isDense = derived(() => {
    return listContext?.dense ?? false;
  });

  const label = derived(() => {
    return merged.title ?? children;
  });

  const rootBind = derived(() => {
    return mergePartBind(partsProps?.root, rootInheritedAttrs, {
      className: cn({
        "list-none": true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const titleBind = derived(() => {
    return mergePartBind(
      partsProps?.title,
      {},
      {
        role: "presentation",
        className: cn({
          "bg-white px-4 text-xs font-semibold tracking-wide text-dark-500 uppercase": true,
          "sticky top-0 z-10": merged.sticky,
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
