// ** External Imports
import type { ClassValue } from "clsx";
import clsx from "clsx";
import {
  compact,
  get,
  isNil,
  isString,
  omit,
  pick,
  reduce,
} from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import { twMerge } from "tailwind-merge";

// ** Local Imports
import type {
  BridgeUIComponentsConfig,
  BridgeUIFormDefaults,
} from "@/Config/types";
import type { ClassPropKey, MergePartBind } from "@/Utils/types";

/**
 * Form controls whose `rounded` is shape-driven (pill / circle).
 * They receive `formDefaults.size` but keep lib/registry `rounded`.
 */
export const BRIDGE_UI_FORM_SHAPE_ROUNDED_NAMES = [
  "Radio",
  "Switch",
] as const satisfies ReadonlyArray<
  (typeof BRIDGE_UI_FORM_COMPONENT_NAMES)[number]
>;

/**
 * Props that must not be deep-merged (`toMerged` / `es-toolkit`).
 * React nodes, DOM nodes, and refs can be plain objects with cycles
 * (e.g. fiber `_owner`) and would throw RangeError on merge.
 */
const BRIDGE_UI_NON_MERGEABLE_PROP_KEYS = [
  "slots",
  "anchorEl",
  "children",
  "teleportTo",
] as const;

/**
 * Registry keys that receive `global.formDefaults` (`size` / `rounded`).
 */
export const BRIDGE_UI_FORM_COMPONENT_NAMES = [
  "Radio",
  "Select",
  "Slider",
  "Switch",
  "Checkbox",
  "OtpField",
  "Textarea",
  "DateField",
  "TextField",
  "TimeField",
  "NumberField",
  "Autocomplete",
  "DateTimeField",
  "PasswordField",
  "DateRangeField",
  "TimeRangeField",
  "DateTimeRangeField",
] as const satisfies ReadonlyArray<keyof BridgeUIComponentsConfig>;

/**
 * Picks density defaults from `formDefaults` when `componentName` is a form control.
 * Radio / Switch omit `rounded` so pill/circle shapes stay intact.
 */
export function resolveBridgeUIFormDefaults<
  K extends keyof BridgeUIComponentsConfig,
>({
  formDefaults,
  componentName,
}: {
  componentName?: K;
  formDefaults?: BridgeUIFormDefaults;
}): undefined | BridgeUIFormDefaults {
  if (isNil(formDefaults) || isNil(componentName)) {
    return undefined;
  }

  if (
    !(BRIDGE_UI_FORM_COMPONENT_NAMES as ReadonlyArray<string>).includes(
      componentName,
    )
  ) {
    return undefined;
  }

  if (
    (BRIDGE_UI_FORM_SHAPE_ROUNDED_NAMES as ReadonlyArray<string>).includes(
      componentName,
    )
  ) {
    return pick(formDefaults, ["size"]);
  }

  return pick(formDefaults, ["size", "rounded"]);
}

/**
 * Converts a string or object to a record of strings.
 */
function toBridgeProps<K extends ClassPropKey>(
  classKey: K,
  value: object | string | undefined,
): Record<string, unknown> {
  if (isString(value)) {
    return { [classKey]: value };
  }

  return (value ?? {}) as Record<string, unknown>;
}

/**
 * Resizes an autosize `<textarea>` to fit its content (`scrollHeight`).
 */
export function adjustAutosizeTextareaHeight(
  element: HTMLTextAreaElement,
): void {
  element.style.height = "auto";
  element.style.lineHeight = "";
  element.style.height = `${element.scrollHeight}px`;
}

/**
 * Merges class values into a single string of class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Merges `partProps`, `inheritedAttrs`, and `bridgeProps` (package).
 * Later layers override; `class` / `className` merged via `cn`.
 */
export function createMergePartBind<const K extends ClassPropKey>(classKey: K) {
  return function mergePartBind<
    Bridge extends object,
    Part extends object | undefined = undefined,
    Inherited extends object | undefined = undefined,
  >(
    partProps: Part,
    inheritedAttrs: Inherited,
    bridgeProps: Bridge | string,
  ): MergePartBind<Bridge, K, Part, Inherited> {
    const bridge = toBridgeProps(classKey, bridgeProps);

    const bridgeClass = get(bridge, classKey) as string | undefined;

    const partClass = get(partProps, classKey) as string | undefined;

    const inheritedClass = get(inheritedAttrs, classKey) as string | undefined;

    return {
      ...bridge,
      ...(inheritedAttrs ?? {}),
      ...(partProps ?? {}),
      [classKey]: cn(bridgeClass, inheritedClass, partClass),
    } as MergePartBind<Bridge, K, Part, Inherited>;
  };
}

/**
 * Merges class maps from the Bridge registry and the instance (later layers
 * override earlier ones). Typical use: `registry.classes` then `props.classes`.
 */
export function mergeBridgeUILayeredClasses<C extends object>(
  ...layers: Array<undefined | Partial<C>>
): Partial<C> {
  return reduce(
    layers,
    (acc, layer) => {
      if (isNil(layer)) {
        return acc;
      }

      return toMerged(acc, layer);
    },
    {} as Partial<C>,
  );
}

/**
 * Package defaults for {@link createMergeNestedComponentProps}.
 * Top-level attrs (e.g. `class` / `className`) merge via `mergePartBind`.
 */
export type NestedComponentDefaults<
  P extends {
    classes?: object;
    customProps?: object;
  },
> = Partial<Omit<P, "classes" | "customProps">> & {
  /**
   * Vue root class string (merged via `mergePartBind`).
   */
  class?: string;

  classes?: Partial<NonNullable<P["classes"]>>;

  /**
   * React root class string (merged via `mergePartBind`).
   */
  className?: string;
  customProps?: {
    [K in keyof NonNullable<P["customProps"]>]?: object;
  };
};

/**
 * `mergePartBind` callable used by {@link createMergeNestedComponentProps}.
 */
export type MergePartBindLike = (
  partProps: object | undefined,
  inheritedAttrs: object | undefined,
  bridgeProps: object | string,
) => object;

/**
 * Creates a helper that merges consumer nested-component props with package
 * defaults. `classes` keys use `cn`; `customProps` parts and top-level attrs
 * use `mergePartBind` (consumer wins).
 */
export function createMergeNestedComponentProps(
  mergePartBind: MergePartBindLike,
) {
  return function mergeNestedComponentProps<
    P extends {
      classes?: object;
      customProps?: object;
    },
  >(
    userProps: undefined | Partial<P>,
    defaults: NestedComponentDefaults<P> = {},
  ): Partial<P> {
    const {
      classes: defaultClasses,
      customProps: defaultCustom,
      ...defaultAttrs
    } = defaults;

    const {
      classes: userClasses,
      customProps: userCustom,
      ...userAttrs
    } = (userProps ?? {}) as Partial<P> & {
      classes?: Record<string, string | undefined>;
      customProps?: Record<string, object | undefined>;
    };

    const hasDefaultAttrs = Object.keys(defaultAttrs).length > 0;

    const result = (
      hasDefaultAttrs
        ? mergePartBind(userAttrs, {}, defaultAttrs as object)
        : { ...userAttrs }
    ) as Partial<P>;

    if (!isNil(defaultClasses)) {
      const classesRecord = (userClasses ?? {}) as Record<
        string,
        string | undefined
      >;

      const mergedClasses = { ...classesRecord } as NonNullable<P["classes"]>;

      for (const [key, value] of Object.entries(defaultClasses)) {
        (mergedClasses as Record<string, string | undefined>)[key] = cn(
          value as string | undefined,
          classesRecord[key],
        );
      }

      result.classes = mergedClasses;
    } else if (!isNil(userClasses)) {
      result.classes = userClasses as P["classes"];
    }

    if (!isNil(defaultCustom)) {
      const customRecord = (userCustom ?? {}) as Record<
        string,
        object | undefined
      >;

      const mergedCustom = { ...customRecord } as NonNullable<P["customProps"]>;

      for (const [key, value] of Object.entries(defaultCustom)) {
        (mergedCustom as Record<string, object>)[key] = mergePartBind(
          customRecord[key],
          {},
          value as object,
        );
      }

      result.customProps = mergedCustom;
    } else if (!isNil(userCustom)) {
      result.customProps = userCustom as P["customProps"];
    }

    return result;
  };
}

/**
 * Merges props with Bridge UI defaults and registry defaults.
 *
 * Order (later wins): `libDefaults` → `formDefaults` (form components only) →
 * registry `defaultProps` → instance `props`.
 */
export function mergePropsWithBridgeUIDefaults<
  P extends object,
  K extends keyof BridgeUIComponentsConfig = keyof BridgeUIComponentsConfig,
>({
  props,
  components,
  libDefaults,
  formDefaults,
  componentName,
}: {
  componentName?: K;
  components: null | undefined | BridgeUIComponentsConfig;
  formDefaults?: BridgeUIFormDefaults;
  libDefaults?: Partial<P>;
  props: P;
}): P {
  const fromRegistry = componentName
    ? (get(components, [componentName, "defaultProps"]) as
        undefined | Partial<P>)
    : undefined;

  const fromFormDefaults = resolveBridgeUIFormDefaults({
    formDefaults,
    componentName,
  }) as undefined | Partial<P>;

  const omitNonMergeable = (value: undefined | Partial<P>) => {
    return omit(value ?? {}, [
      ...BRIDGE_UI_NON_MERGEABLE_PROP_KEYS,
    ]) as Partial<P>;
  };

  const merged = mergeBridgeUILayeredClasses<P>(
    omitNonMergeable(libDefaults),
    omitNonMergeable(fromFormDefaults),
    omitNonMergeable(fromRegistry),
    omitNonMergeable(props),
  );

  return {
    ...merged,
    ...pick(libDefaults ?? {}, [...BRIDGE_UI_NON_MERGEABLE_PROP_KEYS]),
    ...pick(fromFormDefaults ?? {}, [...BRIDGE_UI_NON_MERGEABLE_PROP_KEYS]),
    ...pick(fromRegistry ?? {}, [...BRIDGE_UI_NON_MERGEABLE_PROP_KEYS]),
    ...pick(props, [...BRIDGE_UI_NON_MERGEABLE_PROP_KEYS]),
  } as P;
}

/**
 * Splits `props` into Bridge keys (`componentProps`) and the rest (`inheritedAttrs`).
 */
export function splitComponentProps<
  P extends object,
  const BridgeKeys extends ReadonlyArray<keyof P>,
>({
  props,
  bridgeKeys,
}: {
  bridgeKeys: BridgeKeys;
  props: P;
}): {
  componentProps: Pick<P, BridgeKeys[number]>;
  inheritedAttrs: Omit<P, BridgeKeys[number]>;
} {
  const list = compact(bridgeKeys);

  return {
    componentProps: pick(props, list),
    inheritedAttrs: omit(props, list),
  };
}

export {
  getAccordionPanelId,
  getAccordionTriggerId,
  getAdjacentAccordionValue,
  isAccordionItemExpanded,
  normalizeAccordionValue,
  toggleAccordionItem,
} from "@/Utils/accordion";
export type { AccordionValue } from "@/Utils/accordion";
export {
  breakpointObserverOptionsKey,
  buildBreakpointSnapshot,
  createBreakpointObserver,
  cssLengthToPx,
  DEFAULT_BREAKPOINTS,
  discoverBreakpointKeys,
  resetBreakpointCachesForTests,
  resolveBreakpoints,
} from "@/Utils/breakpoint";
export type {
  BreakpointObserver,
  BreakpointObserverOptions,
  BreakpointSnapshot,
} from "@/Utils/breakpoint";
export {
  applyDateSelection,
  DEFAULT_START_OF_WEEK,
  isDateDisabled,
  isDateInRangePreview,
  isDateRangeEndpoint,
  isDateRangeValue,
  isDateSelected,
  isMonthDisabled,
  isYearDisabled,
  resolveCalendarDayInteractionState,
  resolveDatePickerMode,
  resolveStartOfWeek,
  sortDateRangeValue,
} from "@/Utils/date";
export type {
  CalendarDayInteractionState,
  DatePickerMode,
  DatePickerModel,
  DateRangeValue,
  DisableDatesInput,
  IsDateDisabledOptions,
  StartOfWeek,
} from "@/Utils/date";
export {
  countDrawerTransitionLayers,
  DRAWER_LEAVE_FALLBACK_MS,
  getDrawerOverlayTransitionClass,
  getDrawerPanelTransitionClass,
  hasDrawerTransition,
  resolveEffectiveDrawerTransition,
} from "@/Utils/drawer";
export { hasDocument, hasWindow } from "@/Utils/env";
export {
  createFocusable,
  createFocusTrap,
  getFocusableElements,
  type FocusableHandle,
  type FocusTrap,
  type FocusTrapOptions,
} from "@/Utils/focus";
export { claimOpenMenu, resetOpenMenuLayersForTests } from "@/Utils/menu";
export {
  acquireLayerStackOrder,
  countModalTransitionLayers,
  getLayerStackEntry,
  getLayerStackSnapshot,
  getModalOverlayTransitionClass,
  getModalPanelTransitionClass,
  hasModalTransition,
  isLayerStackTop,
  LAYER_STACK_BASE_Z_INDEX,
  pushLayerStack,
  resetLayerStackForTests,
  resolveEffectiveModalTransition,
  SCROLLBAR_COMPENSATION_VAR,
  subscribeLayerStack,
  type LayerStackHandle,
  type LayerStackSnapshotEntry,
} from "@/Utils/modal";
export {
  applyOtpInput,
  applyOtpKeyNavigation,
  applyOtpPaste,
  DEFAULT_OTP_LENGTH,
  isOtpCharAllowed,
  isOtpComplete,
  joinOtpDigits,
  normalizeOtpValue,
  resolveOtpLength,
  splitOtpValue,
} from "@/Utils/otp";
export type { OtpDigitsUpdate, OtpInputType } from "@/Utils/otp";
export {
  isFieldOverlayDialog,
  resolveFieldOverlay,
  resolveFieldShowFooter,
  resolveRangePickerOrientation,
} from "@/Utils/overlay";
export type {
  FieldOverlayMode,
  RangePickerOrientation,
  ResolvedFieldOverlay,
} from "@/Utils/overlay";
export {
  isModalBackdropClick,
  resolveModalPortalElement,
} from "@/Utils/portal";
export {
  createPositionable,
  type PositionHandle,
  type PositionOptions,
  type PositionPlacement,
  type PositionStrategy,
} from "@/Utils/position";
export {
  DEFAULT_SPINNER_THICKNESS,
  getSpinnerCircleGeometry,
  SPINNER_VIEWBOX_SIZE,
} from "@/Utils/progress";
export type { SpinnerCircleGeometry } from "@/Utils/progress";
export {
  commitFreeSoloValue,
  createSelectAsyncSearch,
  DEFAULT_SELECT_ASYNC_DEBOUNCE,
  DEFAULT_SELECT_ASYNC_LIMIT,
  entriesFromListboxOptions,
  fetchSelectAsyncData,
  filterListboxEntries,
  flattenListboxOptions,
  isListboxOptionGroup,
  mapListboxEntriesToRows,
  mergeSelectAsyncOptions,
  normalizeListboxEntries,
  normalizeSelectOption,
  normalizeSelectOptions,
  resolveSelectAsyncDebounce,
  resolveSelectAsyncLimit,
  resolveSelectAsyncOptions,
  selectValuesEqual,
} from "@/Utils/select";
export type {
  ListboxEntry,
  ListboxOption,
  ListboxOptionGroup,
  ListboxOptionsInput,
  ListboxRow,
  ListboxValue,
  SelectAsyncData,
  SelectAsyncSearch,
  SelectModel,
  SelectOption,
  SelectOptionInput,
  SelectOptionKeys,
  SelectOptionLike,
  SelectValue,
} from "@/Utils/select";
export {
  clampSliderValue,
  DEFAULT_SLIDER_MAX,
  DEFAULT_SLIDER_MIN,
  DEFAULT_SLIDER_STEP,
  getSliderBarGeometry,
  getSliderPointerClientX,
  getSliderPrecision,
  isSliderStopCovered,
  normalizeSliderStops,
  percentFromSliderPointer,
  percentToValue,
  pickClosestSliderThumb,
  resolveSliderBounds,
  resolveSliderDefaultValue,
  snapSliderValue,
  sortSliderRangeValue,
  stepSliderValue,
  valueToPercent,
  writeSliderRangeThumb,
} from "@/Utils/slider";
export type {
  SliderBarGeometry,
  SliderBounds,
  SliderRangeValue,
  SliderStop,
  SliderStopInput,
} from "@/Utils/slider";
export {
  getSnackbarTransitionClass,
  hasSnackbarTransition,
  usesTrailingSnackbarActions,
} from "@/Utils/snackbar";
export { getAdjacentTabValue, getTabId, getTabPanelId } from "@/Utils/tabs";
export type { TabsActivation } from "@/Utils/tabs";
export {
  buildHourOptions,
  buildMinuteOptions,
  buildSecondOptions,
  combineDateAndTime,
  isTimeDisabled,
  isTimeRangeValue,
  normalizeTimeValue,
  observeTimePanelSelectedScroll,
  scrollSelectedTimeItemsIntoView,
  snapMinutes,
  sortTimeRangeValue,
  timeToMinutes,
  timeToSeconds,
  to12Hour,
  to24Hour,
  toMeridiem,
} from "@/Utils/time";
export type {
  DisableTimesInput,
  IsTimeDisabledOptions,
  TimeInterval,
  TimeRangeValue,
  TimeValue,
} from "@/Utils/time";
export type {
  ClassPropKey,
  LibDefaultsShape,
  MergeHtmlProps,
  MergeLibDefaults,
  MergePartBind,
  MergeProps,
  Overwrite,
  UnionProps,
} from "@/Utils/types";
