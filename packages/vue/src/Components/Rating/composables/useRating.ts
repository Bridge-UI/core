// ** External Imports
import { get, isString, isUndefined, omit, pick } from "es-toolkit/compat";
import {
  computed,
  ref,
  toValue,
  useAttrs,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

// ** Core Imports
import {
  clampRatingValue,
  getRatingCurrentItem,
  getRatingItemFill,
  getRatingItems,
  getRatingTabIndex,
  getRatingValueFromKey,
  normalizeRatingMax,
  resolveRatingSelection,
  type RatingValue,
} from "@bridge-ui/core/Domain";
import {
  ratingColorProps as colorProps,
  ratingRoundedProps as roundedProps,
  ratingSizeProps as sizeProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  getColorToken,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n/useI18nAdapter";
import {
  baseFieldBridgeKeys,
  useBaseField,
} from "@/Components/BaseField/composables/useBaseField";
import type {
  RatingClasses,
  RatingOwnProps,
  RatingProps,
} from "@/Components/Rating/rating.types";
import { useBridgeUI } from "@/Provider";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export const ratingBridgeKeys = [
  "max",
  "icon",
  "name",
  "color",
  "rounded",
  "defaultValue",
  ...baseFieldBridgeKeys,
] as const satisfies readonly (keyof RatingOwnProps)[];

type RatingLibDefaults = LibDefaultsShape<
  RatingOwnProps,
  "max" | "icon" | "size" | "color" | "rounded"
>;

type RatingMerged = MergeLibDefaults<RatingOwnProps, RatingLibDefaults>;

/**
 * One rating item with the binds for its button and icon.
 */
export type RatingItemState = {
  emptyIconBind: ReturnType<typeof mergePartBind>;
  fill: number;
  filledIconBind: ReturnType<typeof mergePartBind>;
  iconBind: ReturnType<typeof mergePartBind>;
  itemBind: ReturnType<typeof mergePartBind>;
  value: number;
};

function resolveBaseFieldCustomProps(
  customProps: RatingOwnProps["customProps"],
) {
  if (!customProps) {
    return undefined;
  }

  const { icon: _icon, item: _item, input: _input, ...chrome } = customProps;

  return chrome;
}

/**
 * Composes rating state, field chrome via {@link useBaseField}, and item handlers.
 */
export function useRating(
  props: MaybeRefOrGetter<RatingOwnProps>,
  model: Ref<null | number | undefined>,
  libDefaults: RatingLibDefaults = {
    max: 5,
    size: "md",
    icon: "star",
    rounded: "sm",
    color: "primary",
  },
) {
  const attrs = useAttrs();
  const bridge = useBridgeUI();
  const resolve = useResolveMessage();
  const hover = ref<null | number>(null);
  const itemRefs = ref<Array<null | HTMLButtonElement>>([]);

  const split = computed(() => {
    return splitComponentProps<RatingProps, typeof ratingBridgeKeys>({
      bridgeKeys: ratingBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged, entry: bridgeRating } = useBridgeUIComponent<
    RatingMerged,
    "Rating"
  >({
    libDefaults,
    componentName: "Rating",
    props: () => {
      return split.value.componentProps;
    },
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<RatingClasses>({
    entry: bridgeRating,
    props: () => {
      return split.value.componentProps;
    },
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const baseFieldCustomProps = computed(() => {
    return resolveBaseFieldCustomProps(merged.value.customProps);
  });

  const baseFieldProps = computed(() => {
    return {
      ...pick(split.value.componentProps, baseFieldBridgeKeys),
      customProps: baseFieldCustomProps.value,
      id: split.value.inheritedAttrs.id as string | undefined,
      class: split.value.inheritedAttrs.class as string | undefined,
      ...omit(split.value.inheritedAttrs, ["class", "id"]),
    };
  });

  const baseField = useBaseField(
    () => baseFieldProps.value,
    {
      size: "md",
      hideErrorMessage: false,
    },
    {
      componentName: "Rating",
      labelHtmlFor: (controlId) => {
        return `${controlId}-0`;
      },
    },
  );

  const { controlId, isDisabled, isReadonly, invalidated, ariaDescribedBy } =
    baseField;

  const max = computed(() => {
    return normalizeRatingMax(merged.value.max);
  });

  const isControlled = computed(() => {
    return !isUndefined(model.value);
  });

  const uncontrolledValue = ref(
    clampRatingValue(
      toValue(props).defaultValue ?? null,
      normalizeRatingMax(toValue(props).max ?? libDefaults.max),
    ),
  );

  const value = computed(() => {
    const raw = isControlled.value ? model.value : uncontrolledValue.value;

    return clampRatingValue(raw, max.value);
  });

  const isRtl = computed(() => {
    return bridge?.global.value.direction === "rtl";
  });

  const displayValue = computed(() => {
    if (isDisabled.value || isReadonly.value || hover.value == null) {
      return value.value;
    }

    return hover.value;
  });

  function commit(next: RatingValue) {
    const clamped = clampRatingValue(next, max.value);

    if (!isControlled.value) {
      uncontrolledValue.value = clamped;
    }

    model.value = clamped;
  }

  function select(item: number) {
    if (isDisabled.value || isReadonly.value) {
      return;
    }

    const next = resolveRatingSelection(value.value, item);

    if (next == null) {
      hover.value = null;
    }

    commit(next);
  }

  function preview(item: number) {
    if (isDisabled.value || isReadonly.value) {
      return;
    }

    hover.value = item;
  }

  function focusItem(next: RatingValue) {
    const target = next ?? 1;

    itemRefs.value[target - 1]?.focus();
  }

  function onItemKeyDown(event: KeyboardEvent) {
    if (isDisabled.value) {
      return;
    }

    const next = getRatingValueFromKey({
      max: max.value,
      key: event.key,
      value: value.value,
      direction: isRtl.value ? "rtl" : "ltr",
    });

    if (next === undefined) {
      return;
    }

    event.preventDefault();

    if (isReadonly.value) {
      focusItem(next);

      return;
    }

    if (next !== value.value) {
      if (next == null) {
        hover.value = null;
      }

      commit(next);
    }

    focusItem(next);
  }

  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeRating.value?.tokens?.size,
    );

    return get(classes, merged.value.size ?? "md");
  });

  const colorClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeRating.value?.tokens?.color,
    );

    return getColorToken({
      tokens: classes,
      color: merged.value.color,
      invalid: invalidated.value,
    });
  });

  const roundedClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeRating.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded ?? "sm");
  });

  const groupBind = computed(() => {
    const label = baseField.merged.value.label;
    const groupLabel = isString(label) && label.length > 0 ? label : undefined;

    return mergePartBind(
      {},
      {
        role: "radiogroup",
        "aria-label": groupLabel,
        "aria-describedby": ariaDescribedBy.value,
        "aria-disabled": isDisabled.value || undefined,
        "aria-readonly": isReadonly.value || undefined,
        "aria-invalid": invalidated.value || undefined,
        onMouseleave: () => {
          hover.value = null;
        },
        "aria-required": baseField.merged.value.required || undefined,
      },
      cn({
        "inline-flex items-center": true,
        [baseField.sizeClasses.value?.group ?? ""]: true,
      }),
    );
  });

  const inputBind = computed(() => {
    return mergePartBind(
      customProps.value?.input,
      {
        tabIndex: -1,
        type: "hidden",
        "aria-hidden": true,
        name: merged.value.name,
        value: value.value ?? "",
        disabled: isDisabled.value || undefined,
      },
      cn({
        [mergedClasses.value.input ?? ""]: true,
      }),
    );
  });

  const items = computed(() => {
    return getRatingItems(max.value).map((item) => {
      const fill = getRatingItemFill(item, displayValue.value);

      const itemBind = mergePartBind(
        customProps.value?.item,
        {
          role: "radio",
          type: "button" as const,
          onKeydown: onItemKeyDown,
          id: `${controlId.value}-${item - 1}`,
          disabled: isDisabled.value || undefined,
          tabIndex: getRatingTabIndex(item, value.value),
          onClick: () => {
            select(item);
          },
          "aria-checked": getRatingCurrentItem(value.value) === item,
          onMouseenter: () => {
            preview(item);
          },
          "aria-label": resolve("{{count}} star | {{count}} stars", item, {
            count: item,
          }),
        },
        cn({
          "inline-flex items-center justify-center p-0.5 outline-none transition focus-visible:ring-2 focus-visible:ring-offset-1": true,
          "cursor-pointer": !isDisabled.value && !isReadonly.value,
          [roundedClasses.value ?? ""]: true,
          [colorClasses.value?.focus ?? ""]: true,
          [mergedClasses.value.item ?? ""]: true,
        }),
      );

      const iconHidden = {
        "aria-hidden": true,
      } as const;

      const iconClasses = (active: boolean) => {
        return cn({
          "fill-current transition-colors": true,
          [sizeClasses.value ?? ""]: true,
          [active
            ? (colorClasses.value?.filled ?? "")
            : (colorClasses.value?.empty ?? "")]: true,
          [mergedClasses.value.icon ?? ""]: true,
        });
      };

      const iconBind = mergePartBind(
        customProps.value?.icon,
        iconHidden,
        iconClasses(fill === 1),
      );

      const emptyIconBind = mergePartBind(
        customProps.value?.icon,
        iconHidden,
        iconClasses(false),
      );

      const filledIconBind = mergePartBind(
        customProps.value?.icon,
        iconHidden,
        cn(iconClasses(true), "max-w-none"),
      );

      return {
        fill,
        iconBind,
        itemBind,
        value: item,
        emptyIconBind,
        filledIconBind,
      } satisfies RatingItemState;
    });
  });

  const icon = computed(() => {
    return merged.value.icon;
  });

  const setItemRef = (item: number, node: unknown) => {
    itemRefs.value[item - 1] = node instanceof HTMLButtonElement ? node : null;
  };

  return {
    icon,
    items,
    value,
    merged,
    inputBind,
    groupBind,
    baseField,
    setItemRef,
  };
}

export type UseRatingReturn = ReturnType<typeof useRating>;
