// ** External Imports
import { get, omit } from "es-toolkit/compat";
import type { KeyboardEvent } from "react";
import { useMemo, useRef, useState } from "react";

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
import { useFormControl } from "@/Components/FormControl/hooks/useFormControl";
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

const ratingBridgeKeys = [
  "max",
  "icon",
  "name",
  "size",
  "color",
  "value",
  "classes",
  "rounded",
  "onChange",
  "customProps",
  "defaultValue",
] as const satisfies readonly (keyof RatingProps)[];

const ratingInheritedOmitKeys = [
  "max",
  "icon",
  "name",
  "color",
  "value",
  "classes",
  "rounded",
  "onChange",
  "customProps",
  "defaultValue",
] as const;

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

export function useRating(props: RatingProps, libDefaults: RatingLibDefaults) {
  const bridge = useBridgeUI();

  const resolve = useResolveMessage();

  const formControl = useFormControl(
    omit(props, [
      "max",
      "icon",
      "name",
      "color",
      "value",
      "rounded",
      "onChange",
      "defaultValue",
    ]),
    {
      error: false,
      hideErrorMessage: false,
      size: libDefaults.size ?? "md",
    },
    {
      componentName: "Rating",
    },
  );

  const { componentProps } = splitComponentProps<
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

  const itemRefs = useRef<Array<null | HTMLButtonElement>>([]);

  const [hover, setHover] = useState<null | number>(null);

  const [uncontrolledValue, setUncontrolledValue] = useState<RatingValue>(
    () => {
      return clampRatingValue(
        props.defaultValue ?? null,
        normalizeRatingMax(props.max ?? libDefaults.max),
      );
    },
  );

  const isControlled = props.value !== undefined;

  const max = derived(() => {
    return normalizeRatingMax(merged.max);
  });

  const value = derived(() => {
    const raw = isControlled ? props.value : uncontrolledValue;

    return clampRatingValue(raw, max);
  });

  const isRtl = derived(() => {
    return bridge?.global.direction === "rtl";
  });

  const displayValue = derived(() => {
    if (formControl.isDisabled || formControl.isReadonly || hover == null) {
      return value;
    }

    return hover;
  });

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeRating?.tokens?.color,
    );

    return getColorToken({
      tokens: classes,
      color: merged.color,
      invalid: formControl.invalidated,
    });
  }, [formControl.invalidated, merged.color, bridgeRating?.tokens?.color]);

  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeRating?.tokens?.size,
    );

    return get(classes, merged.size ?? "md");
  }, [merged.size, bridgeRating?.tokens?.size]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeRating?.tokens?.rounded,
    );

    return get(classes, merged.rounded ?? "sm");
  }, [merged.rounded, bridgeRating?.tokens?.rounded]);

  const groupLabel = derived(() => {
    const labels = [formControl.merged.startLabel, formControl.merged.endLabel]
      .filter((part): part is string => {
        return typeof part === "string" && part.length > 0;
      });

    return labels.length > 0 ? labels.join(" ") : undefined;
  });

  function commit(next: RatingValue) {
    const clamped = clampRatingValue(next, max);

    if (!isControlled) {
      setUncontrolledValue(clamped);
    }

    props.onChange?.(clamped);
  }

  function select(item: number) {
    if (formControl.isDisabled || formControl.isReadonly) {
      return;
    }

    const next = resolveRatingSelection(value, item);

    if (next == null) {
      setHover(null);
    }

    commit(next);
  }

  function preview(item: number) {
    if (formControl.isDisabled || formControl.isReadonly) {
      return;
    }

    setHover(item);
  }

  function focusItem(next: RatingValue) {
    const target = next ?? 1;

    itemRefs.current[target - 1]?.focus();
  }

  function onItemKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (formControl.isDisabled) {
      return;
    }

    const next = getRatingValueFromKey({
      max,
      value,
      key: event.key,
      direction: isRtl ? "rtl" : "ltr",
    });

    if (next === undefined) {
      return;
    }

    event.preventDefault();

    if (formControl.isReadonly) {
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

  const setItemRef = (item: number, node: null | HTMLButtonElement) => {
    itemRefs.current[item - 1] = node;
  };

  const groupInherited = derived(() => {
    return omit(formControl.inputInheritedAttrs, [
      ...ratingInheritedOmitKeys,
      "id",
    ]);
  });

  const groupBind = derived(() => {
    return mergePartBind(
      customProps?.group,
      {
        ...groupInherited,
        role: "radiogroup",
        "aria-label": groupLabel,
        "aria-describedby": formControl.ariaDescribedBy,
        "aria-disabled": formControl.isDisabled || undefined,
        "aria-readonly": formControl.isReadonly || undefined,
        "aria-invalid": formControl.invalidated || undefined,
        onMouseLeave: () => {
          setHover(null);
        },
        "aria-required": formControl.merged.required || undefined,
      },
      cn({
        "inline-flex items-center": true,
        [mergedClasses.group ?? ""]: true,
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
        disabled: formControl.isDisabled || undefined,
      },
      cn({
        [mergedClasses.input ?? ""]: true,
      }),
    );
  });

  const items = derived(() => {
    return getRatingItems(max).map((item) => {
      const filled = isRatingItemFilled(item, displayValue);
      const tabbable = getRatingTabIndex(item, value) === 0;

      const itemBind = mergePartBind(
        customProps?.item,
        {
          role: "radio",
          type: "button" as const,
          onKeyDown: onItemKeyDown,
          "aria-checked": value === item,
          tabIndex: getRatingTabIndex(item, value),
          disabled: formControl.isDisabled || undefined,
          id: tabbable ? formControl.controlId : undefined,
          onClick: () => {
            select(item);
          },
          onMouseEnter: () => {
            preview(item);
          },
          "aria-label": resolve("{{count}} star | {{count}} stars", item, {
            count: item,
          }),
        },
        cn({
          "inline-flex items-center justify-center p-0.5 outline-none transition focus-visible:ring-2 focus-visible:ring-offset-1": true,
          "cursor-pointer": !formControl.isDisabled && !formControl.isReadonly,
          [roundedClasses ?? ""]: true,
          [colorClasses?.focus ?? ""]: true,
          [mergedClasses.item ?? ""]: true,
        }),
      );

      const iconBind = mergePartBind(
        customProps?.icon,
        {
          "aria-hidden": true,
        },
        cn({
          "fill-current transition-colors": true,
          [sizeClasses ?? ""]: true,
          [filled
            ? (colorClasses?.filled ?? "")
            : (colorClasses?.empty ?? "")]: true,
          [mergedClasses.icon ?? ""]: true,
        }),
      );

      return {
        iconBind,
        itemBind,
        value: item,
      } satisfies RatingItemState;
    });
  });

  return {
    items,
    value,
    inputBind,
    groupBind,
    setItemRef,
    formControl,
    icon: merged.icon,
  };
}
