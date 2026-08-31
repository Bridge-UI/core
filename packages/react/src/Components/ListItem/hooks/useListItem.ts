// ** External Imports
import { get, isNull, omit } from "es-toolkit/compat";
import { useEffect, useMemo, type MouseEvent } from "react";

// ** Core Imports
import type { ListboxOption } from "@bridge-ui/core/Domain";
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
  "tooltip",
  "disabled",
  "selected",
  "secondary",
  "customProps",
  "interactive",
  "selectedIcon",
  "tooltipPlacement",
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

  const isIconOnly = derived(() => {
    return listContext?.iconOnly ?? false;
  });

  const hasPrimary = derived(() => {
    return (
      hasSlotOrProp(slots, "primary", merged.primary) || isPropPresent(children)
    );
  });

  const hasSecondaryLabel = derived(() => {
    return hasSlotOrProp(slots, "secondary", merged.secondary);
  });

  const hasSecondary = derived(() => {
    if (isIconOnly) {
      return false;
    }

    return hasSecondaryLabel;
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
    if (isIconOnly) {
      return false;
    }

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

  const accessibleName = derived(() => {
    if (!isIconOnly) {
      return undefined;
    }

    if (typeof merged.primary === "string") {
      return merged.primary;
    }

    return undefined;
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
        "aria-label": accessibleName,
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
          "flex min-w-0 items-center text-left text-dark-900 outline-hidden transition-[width,height,padding] duration-200 ease-linear dark:text-dark-100": true,
          "overflow-hidden": true,
          "w-full gap-x-2 px-2": !isIconOnly,
          "size-8": isIconOnly && hasSecondaryLabel,
          "h-8 w-full px-2": isIconOnly && !hasSecondaryLabel,
          "rounded-lg": true,
          "cursor-pointer select-none": !merged.disabled,
          "min-h-12 py-2": hasSecondaryLabel && !isDense && !isIconOnly,
          "min-h-8": !hasSecondaryLabel && !isDense && !isIconOnly,
          "min-h-7": isDense && !isIconOnly,
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
          [listboxContext?.sizeClasses?.option ?? ""]: true,
        }),
      },
    );
  });

  const rowClassName = derived(() => {
    return cn({
      "flex min-w-0 items-center": true,
      "w-full gap-x-2": !isIconOnly,
      "text-dark-900 dark:text-dark-100": !merged.interactive,
      "px-2": !merged.interactive && !isIconOnly,
      "size-8 overflow-hidden":
        !merged.interactive && isIconOnly && hasSecondaryLabel,
      "h-8 overflow-hidden":
        !merged.interactive && isIconOnly && !hasSecondaryLabel,
      "min-h-12 py-2":
        !merged.interactive && hasSecondaryLabel && !isDense && !isIconOnly,
      "min-h-8":
        !merged.interactive && !hasSecondaryLabel && !isDense && !isIconOnly,
      "min-h-7": !merged.interactive && isDense && !isIconOnly,
    });
  });

  const startBind = derived(() => {
    return mergePartBind(
      customProps?.start,
      {},
      cn({
        "flex shrink-0 items-center justify-center text-dark-600 dark:text-dark-300": true,
        [get(mergedClasses, "start") ?? ""]: true,
      }),
    );
  });

  const contentBind = derived(() => {
    return mergePartBind(
      customProps?.content,
      {},
      cn({
        "min-w-0 flex-1": !isIconOnly,
        hidden: isIconOnly,
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

  const tooltipContent = derived(() => {
    if (typeof merged.tooltip !== "string" || merged.tooltip.length === 0) {
      return undefined;
    }

    return merged.tooltip;
  });

  const tooltipPlacement = derived(() => {
    return merged.tooltipPlacement ?? ("top" as const);
  });

  return {
    slots,
    merged,
    hasEnd,
    endBind,
    rootBind,
    startBind,
    hasPrimary,
    isIconOnly,
    contentBind,
    primaryBind,
    rowClassName,
    hasSecondary,
    secondaryBind,
    primaryContent,
    tooltipContent,
    interactiveBind,
    secondaryContent,
    selectedIconBind,
    tooltipPlacement,
    resolvedSelectedIcon,
  };
}
