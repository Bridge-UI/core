// ** External Imports
import { get, isNil, isNull, omit } from "es-toolkit/compat";
import { useEffect, useMemo, type MouseEvent } from "react";

// ** Core Imports
import {
  listboxOptionFromComposedItem,
  type ListboxOption,
} from "@bridge-ui/core/Domain";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import { useListContext } from "@/Components/List/ListContext";
import { getListboxOptionId } from "@/Components/Listbox/hooks/useListboxNavigation";
import { useListboxContext } from "@/Components/Listbox/ListboxContext";
import type {
  ListItemOwnProps,
  ListItemProps,
} from "@/Components/ListItem/listItem.types";
import {
  derived,
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  mergePartBind,
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

  const hasListboxContext = !isNil(listboxContext);

  const listboxOption = useMemo((): null | ListboxOption => {
    if (!hasListboxContext) {
      return null;
    }

    return listboxOptionFromComposedItem({
      value: merged.value,
      primary: merged.primary,
      disabled: merged.disabled,
      secondary: merged.secondary,
    });
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

  const isListboxOption = !isNil(listboxOption);
  const isInteractiveRow = Boolean(merged.interactive || isListboxOption);

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
    if (!isInteractiveRow) {
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
          "flex w-full min-w-0 items-center gap-x-2 rounded-md text-left leading-none text-dark-900 outline-hidden transition-colors dark:text-dark-100": true,
          "text-sm": !isListboxOption,
          "cursor-pointer select-none": !merged.disabled,
          "px-2": !isListboxOption,
          "py-1.5": !isListboxOption && !isDense,
          "py-1": !isListboxOption && isDense,
          "hover:bg-black/5 focus-visible:bg-black/5 dark:hover:bg-white/10 dark:focus-visible:bg-white/10":
            !merged.disabled && !isListboxOption,
          "bg-dark-100 font-medium text-dark-900 dark:bg-white/15 dark:text-white":
            merged.selected && !isListboxOption,
          [listboxContext?.optionHoverClass ?? ""]:
            isListboxOption && !merged.disabled && !listboxSelected,
          [listboxContext?.mergedClasses.optionHover ?? ""]:
            isListboxOption && !merged.disabled && !listboxSelected,
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
          [listboxContext?.sizeClasses?.option ?? ""]: isListboxOption,
        }),
      },
    );
  });

  const rowClassName = derived(() => {
    return cn({
      "flex w-full min-w-0 items-center gap-x-2": true,
      "rounded-md text-dark-900 dark:text-dark-100": !isInteractiveRow,
      "px-2": !isInteractiveRow,
      "py-1.5": !isInteractiveRow && !isDense,
      "py-1": !isInteractiveRow && isDense,
    });
  });

  const startBind = derived(() => {
    return mergePartBind(
      customProps?.start,
      {},
      cn({
        "flex shrink-0 items-center text-dark-600 dark:text-dark-300": true,
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
      cn({
        "block truncate leading-none": true,
        [listboxContext?.sizeClasses?.primary ?? ""]: isListboxOption,
        "text-sm font-medium": !isListboxOption,
        [get(mergedClasses, "primary") ?? ""]: true,
      }),
    );
  });

  const secondaryBind = derived(() => {
    return mergePartBind(
      customProps?.secondary,
      {},
      cn({
        "block truncate text-dark-500 dark:text-dark-400": true,
        [listboxContext?.sizeClasses?.secondary ?? ""]: isListboxOption,
        "mt-0.5 text-xs": !isListboxOption,
        [get(mergedClasses, "secondary") ?? ""]: true,
      }),
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
        ...(isListboxOption ? {} : { size: "sm" as const }),
        className: cn({
          "block shrink-0": true,
          [listboxContext?.checkClass ?? ""]: isListboxOption,
          [get(mergedClasses, "selectedIcon") ?? ""]: true,
        }),
      },
    );
  });

  const primaryContent = derived(() => {
    if (hasNamedSlot(slots, "primary")) {
      return slots?.primary;
    }

    const fallback = merged.primary ?? children;

    if (isPropPresent(fallback)) {
      return fallback;
    }

    return null;
  });

  const secondaryContent = derived(() => {
    if (hasNamedSlot(slots, "secondary")) {
      return slots?.secondary;
    }

    if (isPropPresent(merged.secondary)) {
      return merged.secondary;
    }

    return null;
  });

  return {
    slots,
    merged,
    hasEnd,
    endBind,
    rootBind,
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
