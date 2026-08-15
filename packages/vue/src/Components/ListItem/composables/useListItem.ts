// ** External Imports
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
} from "vue";

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
import { LIST_INJECTION_KEY } from "@/Components/List/listInjectionKey";
import { getListboxOptionId } from "@/Components/Listbox/composables/useListboxNavigation";
import { LISTBOX_INJECTION_KEY } from "@/Components/Listbox/listboxInjectionKey";
import type {
  ListItemOwnProps,
  ListItemProps,
} from "@/Components/ListItem/listItem.types";
import {
  hasNamedSlot,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const listItemBridgeKeys = [
  "as",
  "role",
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

type ListItemLibDefaults = LibDefaultsShape<ListItemOwnProps, "role">;

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

  const resolvedSelectedIcon = computed((): null | IconSource => {
    if (isListboxOption.value) {
      if (!listboxSelected.value || !listboxContext.value?.showCheckmark) {
        return null;
      }

      return "check";
    }

    if (!merged.value.selected) {
      return null;
    }

    if (isNull(merged.value.selectedIcon)) {
      return null;
    }

    return merged.value.selectedIcon ?? "check";
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
        "border-b border-black/10 last:border-b-0 dark:border-white/10":
          merged.value.divider,
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
          "flex w-full min-w-0 items-center gap-x-3 text-left text-dark-900 outline-hidden transition-colors dark:text-dark-100": true,
          "cursor-pointer select-none": !merged.value.disabled,
          "px-4": true,
          "py-2": !isDense.value,
          "py-1.5": isDense.value,
          "hover:bg-black/5 focus-visible:bg-black/5 dark:hover:bg-white/10 dark:focus-visible:bg-white/10":
            !merged.value.disabled && !isListboxOption.value,
          "bg-dark-100 font-medium text-dark-900 dark:bg-white/15 dark:text-white":
            merged.value.selected && !isListboxOption.value,
          [listboxContext.value?.optionHoverClass ?? ""]:
            isListboxOption.value &&
            !merged.value.disabled &&
            !listboxSelected.value,
          [listboxContext.value?.mergedClasses.optionHover ?? ""]:
            isListboxOption.value &&
            !merged.value.disabled &&
            !listboxSelected.value,
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
          [get(mergedClasses.value, "interactive") ?? ""]: true,
          [listboxContext.value?.sizeClasses?.option ?? ""]: true,
        }),
      },
    );
  });

  const rowClass = computed(() => {
    return cn({
      "flex w-full min-w-0 gap-x-3": true,
      "items-center text-dark-900 dark:text-dark-100":
        !merged.value.interactive,
      "px-4": !merged.value.interactive,
      "py-2": !merged.value.interactive && !isDense.value,
      "py-1.5": !merged.value.interactive && isDense.value,
    });
  });

  const startBind = computed(() => {
    return mergePartBind(
      customProps.value?.start,
      {},
      cn({
        "flex shrink-0 text-dark-600 dark:text-dark-300": true,
        [get(mergedClasses.value, "start") ?? ""]: true,
      }),
    );
  });

  const contentBind = computed(() => {
    return mergePartBind(
      customProps.value?.content,
      {},
      cn({
        "min-w-0 flex-1": true,
        [get(mergedClasses.value, "content") ?? ""]: true,
      }),
    );
  });

  const primaryBind = computed(() => {
    return mergePartBind(
      customProps.value?.primary,
      {},
      cn(
        "block truncate text-sm font-medium",
        listboxContext.value?.sizeClasses?.primary,
        get(mergedClasses.value, "primary"),
      ),
    );
  });

  const secondaryBind = computed(() => {
    return mergePartBind(
      customProps.value?.secondary,
      {},
      cn(
        "mt-0.5 block truncate text-xs text-dark-500 dark:text-dark-400",
        listboxContext.value?.sizeClasses?.secondary,
        get(mergedClasses.value, "secondary"),
      ),
    );
  });

  const endBind = computed(() => {
    return mergePartBind(
      customProps.value?.end,
      {},
      cn({
        "ml-auto flex shrink-0 items-center": true,
        [get(mergedClasses.value, "end") ?? ""]: true,
      }),
    );
  });

  const selectedIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.selectedIcon,
      {},
      {
        size: "sm" as const,
        class: cn(
          "shrink-0",
          listboxContext.value?.checkClass,
          get(mergedClasses.value, "selectedIcon"),
        ),
      },
    );
  });

  return {
    merged,
    hasEnd,
    endBind,
    rootBind,
    rowClass,
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
