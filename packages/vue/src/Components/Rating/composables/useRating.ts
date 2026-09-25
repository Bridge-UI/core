// ** External Imports
import { get, pick } from "es-toolkit/compat";
import { computed, ref, toValue, type MaybeRefOrGetter, type Ref } from "vue";

// ** Core Imports
import {
  clampRatingValue,
  getRatingItems,
  getRatingTabIndex,
  getRatingValueFromKey,
  isRatingItemFilled,
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
  formControlBridgeKeys,
  useFormControl,
} from "@/Components/FormControl";
import type {
  RatingClasses,
  RatingOwnProps,
} from "@/Components/Rating/rating.types";
import { useBridgeUI } from "@/Provider";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const ratingBridgeKeys = [
  "max",
  "icon",
  "name",
  "size",
  "color",
  "classes",
  "rounded",
  "customProps",
  "defaultValue",
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
  iconBind: ReturnType<typeof mergePartBind>;
  itemBind: ReturnType<typeof mergePartBind>;
  value: number;
};

export function useRating(
  props: MaybeRefOrGetter<RatingOwnProps>,
  libDefaults: RatingLibDefaults,
  modelValue: Ref<null | number>,
) {
  const bridge = useBridgeUI();

  const resolve = useResolveMessage();

  const formControl = useFormControl(
    () => {
      return pick(toValue(props), formControlBridgeKeys);
    },
    {
      error: false,
      hideErrorMessage: false,
      size: libDefaults.size ?? "md",
    },
    {
      componentName: "Rating",
    },
  );

  const split = computed(() => {
    return splitComponentProps<RatingOwnProps, typeof ratingBridgeKeys>({
      props: toValue(props),
      bridgeKeys: ratingBridgeKeys,
    });
  });

  const { merged, entry: bridgeRating } = useBridgeUIComponent<
    RatingMerged,
    "Rating"
  >({
    libDefaults,
    componentName: "Rating",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<RatingClasses>({
    entry: bridgeRating,
    props: () => split.value.componentProps,
  });

  const hover = ref<null | number>(null);

  const itemRefs = ref<Array<null | HTMLButtonElement>>([]);

  const max = computed(() => {
    return normalizeRatingMax(merged.value.max);
  });

  const value = computed(() => {
    return clampRatingValue(modelValue.value, max.value);
  });

  const isRtl = computed(() => {
    return bridge?.global.value.direction === "rtl";
  });

  const displayValue = computed(() => {
    if (
      formControl.isDisabled.value ||
      formControl.isReadonly.value ||
      hover.value == null
    ) {
      return value.value;
    }

    return hover.value;
  });

  const colorClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeRating.value?.tokens?.color,
    );

    return getColorToken({
      tokens: classes,
      color: merged.value.color,
      invalid: formControl.invalidated.value,
    });
  });

  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeRating.value?.tokens?.size,
    );

    return get(classes, merged.value.size ?? "md");
  });

  const roundedClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeRating.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded ?? "sm");
  });

  const groupLabel = computed(() => {
    const labels = [
      formControl.merged.value.startLabel,
      formControl.merged.value.endLabel,
    ].filter((part): part is string => {
      return typeof part === "string" && part.length > 0;
    });

    return labels.length > 0 ? labels.join(" ") : undefined;
  });

  function commit(next: RatingValue) {
    modelValue.value = clampRatingValue(next, max.value);
  }

  function select(item: number) {
    if (formControl.isDisabled.value || formControl.isReadonly.value) {
      return;
    }

    const next = resolveRatingSelection(value.value, item);

    if (next == null) {
      hover.value = null;
    }

    commit(next);
  }

  function preview(item: number) {
    if (formControl.isDisabled.value || formControl.isReadonly.value) {
      return;
    }

    hover.value = item;
  }

  function focusItem(next: RatingValue) {
    const target = next ?? 1;

    itemRefs.value[target - 1]?.focus();
  }

  function onItemKeyDown(event: KeyboardEvent) {
    if (formControl.isDisabled.value) {
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

    if (formControl.isReadonly.value) {
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

  function setItemRef(item: number, node: unknown) {
    itemRefs.value[item - 1] = node instanceof HTMLButtonElement ? node : null;
  }

  const groupBind = computed(() => {
    return mergePartBind(
      customProps.value?.group,
      {
        role: "radiogroup",
        "aria-label": groupLabel.value,
        "aria-disabled": formControl.isDisabled.value || undefined,
        "aria-readonly": formControl.isReadonly.value || undefined,
        "aria-invalid": formControl.invalidated.value || undefined,
        onMouseleave: () => {
          hover.value = null;
        },
        "aria-required": formControl.merged.value.required || undefined,
        "aria-describedby": formControl.controlBind.value["aria-describedby"],
      },
      cn({
        "inline-flex items-center": true,
        [mergedClasses.value.group ?? ""]: true,
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
        disabled: formControl.isDisabled.value || undefined,
      },
      cn({
        [mergedClasses.value.input ?? ""]: true,
      }),
    );
  });

  const items = computed(() => {
    return getRatingItems(max.value).map((item) => {
      const filled = isRatingItemFilled(item, displayValue.value);
      const tabbable = getRatingTabIndex(item, value.value) === 0;

      const itemBind = mergePartBind(
        customProps.value?.item,
        {
          role: "radio",
          type: "button" as const,
          onKeydown: onItemKeyDown,
          "aria-checked": value.value === item,
          tabIndex: getRatingTabIndex(item, value.value),
          disabled: formControl.isDisabled.value || undefined,
          onClick: () => {
            select(item);
          },
          id: tabbable ? formControl.controlId.value : undefined,
          onMouseenter: () => {
            preview(item);
          },
          "aria-label": resolve("{{count}} star | {{count}} stars", item, {
            count: item,
          }),
        },
        cn({
          "inline-flex items-center justify-center p-0.5 outline-none transition focus-visible:ring-2 focus-visible:ring-offset-1": true,
          "cursor-pointer":
            !formControl.isDisabled.value && !formControl.isReadonly.value,
          [roundedClasses.value ?? ""]: true,
          [colorClasses.value?.focus ?? ""]: true,
          [mergedClasses.value.item ?? ""]: true,
        }),
      );

      const iconBind = mergePartBind(
        customProps.value?.icon,
        {
          "aria-hidden": true,
        },
        cn({
          "fill-current transition-colors": true,
          [sizeClasses.value ?? ""]: true,
          [filled
            ? (colorClasses.value?.filled ?? "")
            : (colorClasses.value?.empty ?? "")]: true,
          [mergedClasses.value.icon ?? ""]: true,
        }),
      );

      return {
        iconBind,
        itemBind,
        value: item,
      } satisfies RatingItemState;
    });
  });

  const icon = computed(() => {
    return merged.value.icon;
  });

  return {
    icon,
    items,
    value,
    inputBind,
    groupBind,
    setItemRef,
    formControl,
  };
}
