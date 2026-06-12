// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  computed,
  getCurrentInstance,
  inject,
  toValue,
  useAttrs,
  useSlots,
  type Slot,
} from "vue";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { alignProps } from "@bridge-ui/core/Components/ListItem";

// ** Local Imports
import { LIST_INJECTION_KEY } from "@/Components/List/listInjectionKey";
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
  "primary",
  "classes",
  "divider",
  "disabled",
  "selected",
  "secondary",
  "customProps",
  "interactive",
] as const satisfies readonly (keyof ListItemOwnProps)[];

type ListItemLibDefaults = LibDefaultsShape<ListItemOwnProps, "align" | "role">;

type ListItemMerged = MergeLibDefaults<ListItemOwnProps, ListItemLibDefaults>;

export function useListItem(
  props: ListItemOwnProps,
  libDefaults: ListItemLibDefaults,
  slots: ReturnType<typeof useSlots>,
) {
  const attrs = useAttrs();

  const listContext = inject(LIST_INJECTION_KEY, null);

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

  const hasEnd = computed(() => {
    return hasNamedSlot(slots, "end");
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
    });
  });

  const interactiveBind = computed(() => {
    if (!merged.value.interactive) {
      return null;
    }

    return mergePartBind(
      customProps.value?.interactive,
      {},
      {
        role: merged.value.role,
        tabindex: merged.value.disabled ? -1 : 0,
        "aria-disabled": merged.value.disabled ? true : undefined,
        "data-selected": merged.value.selected ? true : undefined,
        class: cn({
          "flex w-full min-w-0 gap-x-3 text-left outline-hidden transition-colors": true,
          "cursor-pointer select-none": !merged.value.disabled,
          "px-4": true,
          "py-2": !isDense.value,
          "py-1.5": isDense.value,
          "hover:bg-black/5 focus-visible:bg-black/5": !merged.value.disabled,
          "bg-primary-50 text-primary-700": merged.value.selected,
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
      "px-4": !merged.value.interactive,
      "py-2": !merged.value.interactive && !isDense.value,
      "py-1.5": !merged.value.interactive && isDense.value,
      [alignClass.value ?? ""]: !merged.value.interactive,
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
          "block truncate text-sm font-medium": true,
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
          "mt-0.5 block truncate text-xs text-dark-500": true,
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
  };
}

export function resolveListItemPrimary(
  slots: ReturnType<typeof useSlots>,
  primary?: string,
): Slot | (() => string | null) {
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
