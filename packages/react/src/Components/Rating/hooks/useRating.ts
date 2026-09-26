// ** External Imports
import { get, isString, omit, pick } from "es-toolkit/compat";
import type { KeyboardEvent, MouseEvent } from "react";
import { useMemo, useRef, useState } from "react";

// ** Core Imports
import {
  clampRatingValue,
  getRatingCurrentItem,
  getRatingItemFill,
  getRatingItems,
  getRatingTabIndex,
  getRatingValueFromKey,
  getRatingValueFromPointer,
  normalizeRatingMax,
  normalizeRatingStep,
  resolveRatingSelection,
  type RatingValue,
} from "@bridge-ui/core/Domain";
import {
  ratingColorProps as colorProps,
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
} from "@/Components/BaseField/hooks/useBaseField";
import type {
  RatingClasses,
  RatingOwnProps,
  RatingProps,
} from "@/Components/Rating/rating.types";
import { useBridgeUI } from "@/Provider";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export const ratingBridgeKeys = [
  "max",
  "icon",
  "name",
  "step",
  "color",
  "value",
  "onChange",
  "defaultValue",
  ...baseFieldBridgeKeys,
] as const satisfies readonly (keyof RatingProps)[];

type RatingLibDefaults = LibDefaultsShape<
  RatingOwnProps,
  "max" | "icon" | "size" | "step" | "color"
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
  props: RatingProps,
  libDefaults: RatingLibDefaults = {
    max: 5,
    step: 1,
    size: "md",
    icon: "star",
    color: "primary",
  },
) {
  const bridge = useBridgeUI();
  const resolve = useResolveMessage();
  const [hover, setHover] = useState<null | number>(null);
  const itemRefs = useRef<Array<null | HTMLButtonElement>>([]);

  const { componentProps, inheritedAttrs } = splitComponentProps<
    RatingProps,
    typeof ratingBridgeKeys
  >({
    props,
    bridgeKeys: ratingBridgeKeys,
  });

  const { merged, entry: bridgeRating } = useBridgeUIComponent<
    RatingMerged,
    "Rating"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Rating",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<RatingClasses>({
    entry: bridgeRating,
    props: componentProps,
  });

  const baseFieldCustomProps = useMemo(() => {
    return resolveBaseFieldCustomProps(merged.customProps);
  }, [merged.customProps]);

  const baseField = useBaseField(
    {
      ...pick(componentProps, baseFieldBridgeKeys),
      slots: props.slots,
      customProps: baseFieldCustomProps,
      id: inheritedAttrs.id as string | undefined,
      className: inheritedAttrs.className as string | undefined,
      ...omit(inheritedAttrs, ["className", "id", "slots"]),
    },
    {
      size: "md",
      error: false,
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

  const max = derived(() => {
    return normalizeRatingMax(merged.max);
  });

  const step = derived(() => {
    return normalizeRatingStep(merged.step);
  });

  const isControlled = derived(() => {
    return props.value !== undefined;
  });

  const [uncontrolledValue, setUncontrolledValue] = useState<RatingValue>(
    () => {
      return clampRatingValue(
        props.defaultValue ?? null,
        normalizeRatingMax(props.max ?? libDefaults.max),
      );
    },
  );

  const value = derived(() => {
    const raw = isControlled ? props.value : uncontrolledValue;

    return clampRatingValue(raw, max);
  });

  const isRtl = derived(() => {
    return bridge?.global.direction === "rtl";
  });

  const displayValue = derived(() => {
    if (isDisabled || isReadonly || hover == null) {
      return value;
    }

    return hover;
  });

  function commit(next: RatingValue) {
    const clamped = clampRatingValue(next, max);

    if (!isControlled) {
      setUncontrolledValue(clamped);
    }

    props.onChange?.(clamped);
  }

  function valueAtPointer(item: number, event?: MouseEvent<HTMLButtonElement>) {
    const node = event?.currentTarget;

    if (!node) {
      return item;
    }

    const rect = node.getBoundingClientRect();

    if (!(rect.width > 0)) {
      return item;
    }

    const ratio = (event.clientX - rect.left) / rect.width;

    return getRatingValueFromPointer({
      item,
      step,
      ratio: isRtl ? 1 - ratio : ratio,
    });
  }

  function select(item: number) {
    if (isDisabled || isReadonly) {
      return;
    }

    const next = resolveRatingSelection(value, item);

    if (next == null) {
      setHover(null);
    }

    commit(next);
  }

  function preview(item: number) {
    if (isDisabled || isReadonly) {
      return;
    }

    setHover(item);
  }

  function focusItem(next: RatingValue) {
    const target = getRatingCurrentItem(next) ?? 1;

    itemRefs.current[target - 1]?.focus();
  }

  function onItemKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (isDisabled) {
      return;
    }

    const next = getRatingValueFromKey({
      max,
      step,
      value,
      key: event.key,
      direction: isRtl ? "rtl" : "ltr",
    });

    if (next === undefined) {
      return;
    }

    event.preventDefault();

    if (isReadonly) {
      focusItem(next);

      return;
    }

    if (next !== value) {
      if (next == null) {
        setHover(null);
      }

      commit(next);
    }

    focusItem(next);
  }

  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeRating?.tokens?.size,
    );

    return get(classes, merged.size ?? "md");
  }, [merged.size, bridgeRating?.tokens?.size]);

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeRating?.tokens?.color,
    );

    return getColorToken({
      tokens: classes,
      color: merged.color,
      invalid: invalidated,
    });
  }, [invalidated, merged.color, bridgeRating?.tokens?.color]);

  const groupBind = derived(() => {
    const label = baseField.merged.label;
    const groupLabel = isString(label) && label.length > 0 ? label : undefined;

    return mergePartBind(
      {},
      {
        role: "radiogroup",
        "aria-label": groupLabel,
        "aria-describedby": ariaDescribedBy,
        "aria-disabled": isDisabled || undefined,
        "aria-readonly": isReadonly || undefined,
        "aria-invalid": invalidated || undefined,
        "aria-required": baseField.merged.required || undefined,
        onMouseLeave: () => {
          setHover(null);
        },
      },
      cn({
        "inline-flex items-center gap-0.5": true,
      }),
    );
  });

  const inputBind = derived(() => {
    return mergePartBind(
      customProps?.input,
      {
        tabIndex: -1,
        type: "hidden",
        name: merged.name,
        value: value ?? "",
        "aria-hidden": true,
        disabled: isDisabled || undefined,
      },
      cn({
        [mergedClasses.input ?? ""]: true,
      }),
    );
  });

  const items = derived(() => {
    return getRatingItems(max).map((item) => {
      const fill = getRatingItemFill(item, displayValue);

      const itemBind = mergePartBind(
        customProps?.item,
        {
          role: "radio",
          type: "button" as const,
          onKeyDown: onItemKeyDown,
          id: `${controlId}-${item - 1}`,
          disabled: isDisabled || undefined,
          tabIndex: getRatingTabIndex(item, value),
          "aria-checked": getRatingCurrentItem(value) === item,
          "aria-label": resolve("{{count}} star | {{count}} stars", item, {
            count: item,
          }),
          onClick: (event: MouseEvent<HTMLButtonElement>) => {
            select(valueAtPointer(item, event));
          },
          onMouseMove: (event: MouseEvent<HTMLButtonElement>) => {
            preview(valueAtPointer(item, event));
          },
          onMouseEnter: (event: MouseEvent<HTMLButtonElement>) => {
            preview(valueAtPointer(item, event));
          },
        },
        cn({
          "inline-flex items-center justify-center p-0.5 outline-none transition focus-visible:ring-2 focus-visible:ring-offset-1": true,
          "cursor-pointer": !isDisabled && !isReadonly,
          [colorClasses?.focus ?? ""]: true,
          [mergedClasses.item ?? ""]: true,
        }),
      );

      const iconHidden = {
        "aria-hidden": true,
      } as const;

      const iconClasses = (active: boolean) => {
        return cn({
          "fill-current transition-colors": true,
          [sizeClasses ?? ""]: true,
          [active ? (colorClasses?.filled ?? "") : (colorClasses?.empty ?? "")]:
            true,
          [mergedClasses.icon ?? ""]: true,
        });
      };

      const iconBind = mergePartBind(
        customProps?.icon,
        iconHidden,
        iconClasses(fill === 1),
      );

      const emptyIconBind = mergePartBind(
        customProps?.icon,
        iconHidden,
        iconClasses(false),
      );

      const filledIconBind = mergePartBind(
        customProps?.icon,
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

  const setItemRef = (item: number, node: null | HTMLButtonElement) => {
    itemRefs.current[item - 1] = node;
  };

  return {
    items,
    value,
    merged,
    inputBind,
    groupBind,
    baseField,
    setItemRef,
    icon: merged.icon,
  };
}

export type UseRatingReturn = ReturnType<typeof useRating>;
