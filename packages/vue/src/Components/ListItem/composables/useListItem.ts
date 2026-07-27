// ** External Imports
import { Check, type LucideIcon } from "@lucide/vue";
import { get, isNull, omit } from "es-toolkit/compat";
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  toValue,
  useAttrs,
  useSlots,
  watch,
  type Slot,
} from "vue";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type ListboxOption,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { alignProps } from "@bridge-ui/core/Components/ListItem";

// ** Local Imports
import { LIST_INJECTION_KEY } from "@/Components/List/listInjectionKey";
import { getListboxOptionId } from "@/Components/Listbox/composables/useListboxNavigation";
import { LISTBOX_INJECTION_KEY } from "@/Components/Listbox/listboxInjectionKey";
import type {
  ListItemOwnProps,
  ListItemProps,
} from "@/Components/ListItem/listItem.types";
import {
  hasNamedSlot,
  isPropPresent,
  mergePartBind,
  resolveNamedSlot,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const listItemBridgeKeys = [
  "as",
  "role",
  "align",
  "dense",
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

type ListItemLibDefaults = LibDefaultsShape<ListItemOwnProps, "role" | "align">;

type ListItemMerged = MergeLibDefaults<ListItemOwnProps, ListItemLibDefaults>;

export function useListItem(
  props: ListItemOwnProps,
  libDefaults: ListItemLibDefaults,
  slots: ReturnType<typeof useSlots>,
) {
  const attrs = useAttrs();

  const listContext = inject(LIST_INJECTION_KEY, null);
  const listboxContextRef = inject(LISTBOX_INJECTION_KEY, null);
  const hasListboxContext = listboxContextRef != null;

  const split = computed(() => {
    return splitComponentProps<ListItemProps, typeof listItemBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: listItemBridgeKeys,
    });
  });

  const { merged, entry: bridgeListItem } = useBridgeUIComponent<
    ListItemMerged,
    "ListItem"
  >({
    libDefaults,
    componentName: "ListItem",
    props: () => split.value.componentProps,
  });

  const listboxContext = computed(() => {
    return listboxContextRef ? toValue(listboxContextRef) : null;
  });

  const listboxOption = computed((): null | ListboxOption => {
    if (merged.value.value == null || !hasListboxContext) {
      return null;
    }

    return {
      value: merged.value.value,
      description: merged.value.secondary,
      disabled: Boolean(merged.value.disabled),
      label: merged.value.primary ?? String(merged.value.value),
    };
  });

  let unregister: undefined | (() => void);

  watch(
    () => {
      const option = listboxOption.value;

      if (!option) {
        return null;
      }

      return `${String(option.value)}:${option.label}:${option.disabled}:${option.description ?? ""}`;
    },
    () => {
      unregister?.();
      unregister = undefined;

      const option = listboxOption.value;

      if (!option || !listboxContextRef) {
        return;
      }

      unregister = toValue(listboxContextRef).registerOption(option);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    unregister?.();
  });

  const isListboxOption = computed(() => {
    return listboxOption.value != null;
  });

  const listboxSelected = computed(() => {
    if (!listboxOption.value || !listboxContext.value) {
      return false;
    }

    return listboxContext.value.isSelected(listboxOption.value.value);
  });

  const listboxOptionIndex = computed(() => {
    if (!listboxOption.value || !listboxContext.value) {
      return -1;
    }

    return listboxContext.value.getOptionIndex(listboxOption.value.value);
  });

  const listboxHighlighted = computed(() => {
    if (!listboxContext.value || listboxOptionIndex.value < 0) {
      return false;
    }

    return listboxContext.value.highlightedIndex === listboxOptionIndex.value;
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeListItem,
    props: () => split.value.componentProps,
  });

  const isDense = computed(() => {
    const vnodeProps = getCurrentInstance()?.vnode.props ?? {};

    if ("dense" in vnodeProps) {
      return props.dense === true;
    }

    if (props.dense === true) {
      return true;
    }

    return listContext ? toValue(listContext).dense : false;
  });

  const alignClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      alignProps,
      bridgeListItem.value?.customProps?.align,
    );

    return get(classes, merged.value.align);
  });

  const hasPrimary = computed(() => {
    return (
      hasNamedSlot(slots, "primary") ||
      hasNamedSlot(slots, "default") ||
      Boolean(merged.value.primary)
    );
  });

  const hasSecondary = computed(() => {
    return hasNamedSlot(slots, "secondary") || Boolean(merged.value.secondary);
  });

  const hasStart = computed(() => {
    return hasNamedSlot(slots, "start");
  });

  const resolvedSelectedIcon = computed((): null | LucideIcon => {
    if (isListboxOption.value) {
      if (!listboxSelected.value || !listboxContext.value?.showCheckmark) {
        return null;
      }

      return Check;
    }

    if (!merged.value.selected) {
      return null;
    }

    if (isNull(merged.value.selectedIcon)) {
      return null;
    }

    return merged.value.selectedIcon ?? Check;
  });

  const hasEnd = computed(() => {
    return hasNamedSlot(slots, "end") || resolvedSelectedIcon.value != null;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, []);
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, rootInheritedAttrs.value, {
      class: cn({
        "list-none": true,
        "border-b border-black/10 last:border-b-0": merged.value.divider,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
      id:
        isListboxOption.value &&
        listboxContext.value?.listboxId &&
        listboxOptionIndex.value >= 0
          ? getListboxOptionId(
              listboxContext.value.listboxId,
              listboxOptionIndex.value,
            )
          : undefined,
    });
  });

  const interactiveBind = computed(() => {
    const interactive = merged.value.interactive || isListboxOption.value;

    if (!interactive) {
      return null;
    }

    return mergePartBind(
      customProps.value?.interactive,
      {},
      {
        "aria-disabled": merged.value.disabled ? true : undefined,
        role: isListboxOption.value ? "option" : merged.value.role,
        tabindex: merged.value.disabled || isListboxOption.value ? -1 : 0,
        "data-selected":
          merged.value.selected || listboxSelected.value ? true : undefined,
        "aria-selected": isListboxOption.value
          ? listboxSelected.value
          : undefined,
        onMousedown: isListboxOption.value
          ? (event: MouseEvent) => {
              event.preventDefault();
            }
          : undefined,
        onClick: isListboxOption.value
          ? () => {
              if (listboxOption.value) {
                listboxContext.value?.onSelect(listboxOption.value);
              }
            }
          : undefined,
        class: cn({
          "flex w-full min-w-0 gap-x-3 text-left outline-hidden transition-colors": true,
          "cursor-pointer select-none": !merged.value.disabled,
          "px-4": !isListboxOption.value,
          [listboxContext.value?.sizeClasses?.option ?? "px-4"]:
            isListboxOption.value,
          "py-2": !isListboxOption.value && !isDense.value,
          "py-1.5": !isListboxOption.value && isDense.value,
          "hover:bg-black/5 focus-visible:bg-black/5":
            !merged.value.disabled && !isListboxOption.value,
          "bg-primary-50 text-primary-700":
            merged.value.selected && !isListboxOption.value,
          [listboxContext.value?.optionSelectedClass ?? ""]:
            isListboxOption.value && listboxSelected.value,
          [listboxContext.value?.mergedClasses.optionSelected ?? ""]:
            isListboxOption.value && listboxSelected.value,
          [listboxContext.value?.optionHighlightedClass ?? ""]:
            isListboxOption.value &&
            listboxHighlighted.value &&
            !listboxSelected.value,
          [listboxContext.value?.mergedClasses.optionHighlighted ?? ""]:
            isListboxOption.value &&
            listboxHighlighted.value &&
            !listboxSelected.value,
          "opacity-50 pointer-events-none": merged.value.disabled,
          [alignClass.value ?? ""]: true,
          [get(mergedClasses.value, "interactive") ?? ""]: true,
        }),
      },
    );
  });

  const rowClass = computed(() => {
    return cn({
      "flex w-full min-w-0 gap-x-3": true,
      "px-4": !merged.value.interactive && !isListboxOption.value,
      "py-2":
        !merged.value.interactive && !isListboxOption.value && !isDense.value,
      "py-1.5":
        !merged.value.interactive && !isListboxOption.value && isDense.value,
      [alignClass.value ?? ""]:
        !merged.value.interactive && !isListboxOption.value,
    });
  });

  const startBind = computed(() => {
    return mergePartBind(
      customProps.value?.start,
      {},
      {
        class: cn({
          "flex shrink-0": true,
          [get(mergedClasses.value, "start") ?? ""]: true,
        }),
      },
    );
  });

  const contentBind = computed(() => {
    return mergePartBind(
      customProps.value?.content,
      {},
      {
        class: cn({
          "min-w-0 flex-1": true,
          [get(mergedClasses.value, "content") ?? ""]: true,
        }),
      },
    );
  });

  const primaryBind = computed(() => {
    return mergePartBind(
      customProps.value?.primary,
      {},
      {
        class: cn({
          "block truncate text-sm font-medium": !isListboxOption.value,
          [listboxContext.value?.sizeClasses?.primary ??
          "block truncate text-sm font-medium"]: isListboxOption.value,
          [get(mergedClasses.value, "primary") ?? ""]: true,
        }),
      },
    );
  });

  const secondaryBind = computed(() => {
    return mergePartBind(
      customProps.value?.secondary,
      {},
      {
        class: cn({
          "mt-0.5 block truncate text-xs text-dark-500": !isListboxOption.value,
          [listboxContext.value?.sizeClasses?.secondary ??
          "mt-0.5 block truncate text-xs text-dark-500"]: isListboxOption.value,
          [get(mergedClasses.value, "secondary") ?? ""]: true,
        }),
      },
    );
  });

  const endBind = computed(() => {
    return mergePartBind(
      customProps.value?.end,
      {},
      {
        class: cn({
          "ml-auto flex shrink-0 items-center": true,
          [get(mergedClasses.value, "end") ?? ""]: true,
        }),
      },
    );
  });

  const selectedIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.selectedIcon,
      {},
      {
        size: "sm" as const,
        class: cn({
          "shrink-0": true,
          [listboxContext.value?.checkClass ?? ""]: isListboxOption.value,
          [get(mergedClasses.value, "selectedIcon") ?? ""]: true,
        }),
      },
    );
  });

  return {
    merged,
    hasEnd,
    endBind,
    rootBind,
    rowClass,
    hasStart,
    startBind,
    hasPrimary,
    contentBind,
    primaryBind,
    hasSecondary,
    secondaryBind,
    interactiveBind,
    selectedIconBind,
    resolvedSelectedIcon,
  };
}

export function resolveListItemPrimary(
  slots: ReturnType<typeof useSlots>,
  primary?: string,
): Slot | (() => null | string) {
  if (hasNamedSlot(slots, "primary")) {
    return resolveNamedSlot(slots, "primary")!;
  }

  if (hasNamedSlot(slots, "default")) {
    return resolveNamedSlot(slots, "default")!;
  }

  if (!isPropPresent(primary)) {
    return () => null;
  }

  const text = String(primary);

  return () => text;
}
