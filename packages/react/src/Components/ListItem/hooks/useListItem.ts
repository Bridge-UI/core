// ** External Imports
import { get, isNull, omit } from "es-toolkit/compat";
import { useEffect, useMemo, type MouseEvent } from "react";

// ** Core Imports
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type ListboxOption,
  type MergeLibDefaults,
} from "@bridge-ui/core";

// ** Local Imports
import { useListContext } from "@/Components/List/ListContext";
import { getListboxOptionId } from "@/Components/Listbox/hooks/useListboxNavigation";
import { useListboxContext } from "@/Components/Listbox/ListboxContext";
import type {
  ListItemOwnProps,
  ListItemProps,
} from "@/Components/ListItem/listItem.types";
import type { IconSource } from "@/Icons";
import {
  derived,
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  mergePartBind,
  resolveSlotOrProp,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const listItemBridgeKeys = [
  "as",
  "role",
  "dense",
  "slots",
  "value",
  "classes",
  "divider",
  "primary",
  "disabled",
  "selected",
  "secondary",
  "customProps",
  "interactive",
  "selectedIcon",
] as const satisfies readonly (keyof ListItemOwnProps)[];

type ListItemLibDefaults = LibDefaultsShape<ListItemOwnProps, "role">;

type ListItemMerged = MergeLibDefaults<ListItemOwnProps, ListItemLibDefaults>;

export function useListItem(
  props: ListItemProps,
  libDefaults: ListItemLibDefaults,
) {
  const listContext = useListContext();
  const listboxContext = useListboxContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ListItemProps,
    typeof listItemBridgeKeys
  >({
    props,
    bridgeKeys: listItemBridgeKeys,
  });

  const { merged, entry: bridgeListItem } = useBridgeUIComponent<
    ListItemMerged,
    "ListItem"
  >({
    libDefaults,
    props: componentProps,
    componentName: "ListItem",
  });

  const hasListboxContext = listboxContext != null;

  const listboxOption = useMemo((): null | ListboxOption => {
    if (merged.value == null || !hasListboxContext) {
      return null;
    }

    const label =
      typeof merged.primary === "string"
        ? merged.primary
        : String(merged.value);
    const description =
      typeof merged.secondary === "string" ? merged.secondary : undefined;

    return {
      label,
      description,
      value: merged.value,
      disabled: Boolean(merged.disabled),
    };
  }, [
    merged.value,
    merged.primary,
    merged.disabled,
    merged.secondary,
    hasListboxContext,
  ]);

  useEffect(() => {
    if (!listboxOption) {
      return;
    }

    const register = listboxContext?.registerOption;

    if (!register) {
      return;
    }

    return register(listboxOption);
  }, [listboxOption, listboxContext?.registerOption]);

  const listboxSelected = derived(() => {
    if (!listboxOption || !listboxContext) {
      return false;
    }

    return listboxContext.isSelected(listboxOption.value);
  });

  const listboxOptionIndex = derived(() => {
    if (!listboxOption || !listboxContext) {
      return -1;
    }

    return listboxContext.getOptionIndex(listboxOption.value);
  });

  const listboxHighlighted = derived(() => {
    if (!listboxContext || listboxOptionIndex < 0) {
      return false;
    }

    return listboxContext.highlightedIndex === listboxOptionIndex;
  });

  const slots = derived(() => {
    return props.slots;
  });

  const children = derived(() => {
    return props.children;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children"]);
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgeListItem,
  });

  const isDense = derived(() => {
    return merged.dense ?? listContext?.dense ?? false;
  });

  const hasPrimary = derived(() => {
    return (
      hasSlotOrProp(slots, "primary", merged.primary) || isPropPresent(children)
    );
  });

  const hasSecondary = derived(() => {
    return hasSlotOrProp(slots, "secondary", merged.secondary);
  });

  const hasStart = derived(() => {
    return hasNamedSlot(slots, "start");
  });

  const isListboxOption = listboxOption != null;

  const resolvedSelectedIcon = useMemo((): null | IconSource => {
    if (isListboxOption) {
      if (!listboxSelected || !listboxContext?.showCheckmark) {
        return null;
      }

      return "check";
    }

    if (!merged.selected) {
      return null;
    }

    if (isNull(merged.selectedIcon)) {
      return null;
    }

    return merged.selectedIcon ?? "check";
  }, [
    isListboxOption,
    listboxSelected,
    merged.selected,
    merged.selectedIcon,
    listboxContext?.showCheckmark,
  ]);

  const hasEnd = derived(() => {
    return hasNamedSlot(slots, "end") || resolvedSelectedIcon != null;
  });

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      id:
        isListboxOption && listboxContext?.listboxId && listboxOptionIndex >= 0
          ? getListboxOptionId(listboxContext.listboxId, listboxOptionIndex)
          : undefined,
      className: cn({
        "list-none": true,
        "border-b border-black/10 last:border-b-0 dark:border-white/10":
          merged.divider,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const interactiveBind = derived(() => {
    const interactive = merged.interactive || isListboxOption;

    if (!interactive) {
      return null;
    }

    return mergePartBind(
      customProps?.interactive,
      {},
      {
        role: isListboxOption ? "option" : merged.role,
        "aria-disabled": merged.disabled ? true : undefined,
        tabIndex: merged.disabled || isListboxOption ? -1 : 0,
        "aria-selected": isListboxOption ? listboxSelected : undefined,
        "data-selected": merged.selected || listboxSelected ? true : undefined,
        onMouseDown: isListboxOption
          ? (event: MouseEvent) => {
              event.preventDefault();
            }
          : undefined,
        onClick: isListboxOption
          ? () => {
              if (listboxOption) {
                listboxContext?.onSelect(listboxOption);
              }
            }
          : undefined,
        className: cn({
          "flex w-full min-w-0 items-center gap-x-3 text-left text-dark-900 outline-hidden transition-colors dark:text-dark-100": true,
          "cursor-pointer select-none": !merged.disabled,
          "px-4": true,
          "py-2": !isDense,
          "py-1.5": isDense,
          "hover:bg-black/5 focus-visible:bg-black/5 dark:hover:bg-white/10 dark:focus-visible:bg-white/10":
            !merged.disabled && !isListboxOption,
          "bg-dark-100 font-medium text-dark-900 dark:bg-white/15 dark:text-white":
            merged.selected && !isListboxOption,
          [listboxContext?.optionSelectedClass ?? ""]:
            isListboxOption && listboxSelected,
          [listboxContext?.mergedClasses.optionSelected ?? ""]:
            isListboxOption && listboxSelected,
          [listboxContext?.optionHighlightedClass ?? ""]:
            isListboxOption && listboxHighlighted && !listboxSelected,
          [listboxContext?.mergedClasses.optionHighlighted ?? ""]:
            isListboxOption && listboxHighlighted && !listboxSelected,
          "opacity-50 pointer-events-none": merged.disabled,
          [get(mergedClasses, "interactive") ?? ""]: true,
          [listboxContext?.sizeClasses?.option ?? ""]: true,
        }),
      },
    );
  });

  const rowClassName = derived(() => {
    return cn({
      "flex w-full min-w-0 gap-x-3": true,
      "items-center text-dark-900 dark:text-dark-100": !merged.interactive,
      "px-4": !merged.interactive,
      "py-2": !merged.interactive && !isDense,
      "py-1.5": !merged.interactive && isDense,
    });
  });

  const startBind = derived(() => {
    return mergePartBind(
      customProps?.start,
      {},
      cn({
        "flex shrink-0 text-dark-600 dark:text-dark-300": true,
        [get(mergedClasses, "start") ?? ""]: true,
      }),
    );
  });

  const contentBind = derived(() => {
    return mergePartBind(
      customProps?.content,
      {},
      cn({
        "min-w-0 flex-1": true,
        [get(mergedClasses, "content") ?? ""]: true,
      }),
    );
  });

  const primaryBind = derived(() => {
    return mergePartBind(
      customProps?.primary,
      {},
      cn(
        "block truncate text-sm font-medium",
        listboxContext?.sizeClasses?.primary,
        get(mergedClasses, "primary"),
      ),
    );
  });

  const secondaryBind = derived(() => {
    return mergePartBind(
      customProps?.secondary,
      {},
      cn(
        "mt-0.5 block truncate text-xs text-dark-500 dark:text-dark-400",
        listboxContext?.sizeClasses?.secondary,
        get(mergedClasses, "secondary"),
      ),
    );
  });

  const endBind = derived(() => {
    return mergePartBind(
      customProps?.end,
      {},
      cn({
        "ml-auto flex shrink-0 items-center": true,
        [get(mergedClasses, "end") ?? ""]: true,
      }),
    );
  });

  const selectedIconBind = derived(() => {
    return mergePartBind(
      customProps?.selectedIcon,
      {},
      {
        size: "sm" as const,
        className: cn(
          "shrink-0",
          listboxContext?.checkClass,
          get(mergedClasses, "selectedIcon"),
        ),
      },
    );
  });

  const primaryContent = derived(() => {
    return resolveSlotOrProp({
      slots,
      name: "primary",
      fallback: merged.primary ?? children,
    });
  });

  const secondaryContent = derived(() => {
    return resolveSlotOrProp({
      slots,
      name: "secondary",
      fallback: merged.secondary,
    });
  });

  return {
    slots,
    merged,
    hasEnd,
    endBind,
    rootBind,
    hasStart,
    startBind,
    hasPrimary,
    contentBind,
    primaryBind,
    rowClassName,
    hasSecondary,
    secondaryBind,
    primaryContent,
    interactiveBind,
    secondaryContent,
    selectedIconBind,
    resolvedSelectedIcon,
  };
}
