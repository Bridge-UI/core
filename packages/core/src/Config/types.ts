// ** Local Imports
import type { DateAdapter } from "@/Adapters/date";
import type { I18nAdapter } from "@/Adapters/i18n";
import type { IconAdapter } from "@/Adapters/icon";
import type {
  AccordionColor,
  AccordionColorItem,
  AccordionSize,
  AccordionSizeItem,
  AccordionVariant,
  AccordionVariantItem,
} from "@/Tokens/Accordion";
import type {
  AlertColor,
  AlertColorItem,
  AlertPadding,
  AlertRounded,
  AlertShadow,
  AlertVariant,
} from "@/Tokens/Alert";
import type {
  AvatarColor,
  AvatarColorItem,
  AvatarIconSizeItem,
  AvatarRounded,
  AvatarSize,
} from "@/Tokens/Avatar";
import type {
  BadgeColor,
  BadgeColorItem,
  BadgeDensity,
  BadgeRounded,
  BadgeSize,
  BadgeVariant,
} from "@/Tokens/Badge";
import type { BaseFieldSizeItem } from "@/Tokens/BaseField";
import type { BreadcrumbSize, BreadcrumbSizeItem } from "@/Tokens/Breadcrumb";
import type {
  ButtonColor,
  ButtonColorItem,
  ButtonDensity,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
} from "@/Tokens/Button";
import type {
  CalendarColor,
  CalendarColorItem,
  CalendarDay,
  CalendarRounded,
} from "@/Tokens/Calendar";
import type {
  CardPadding,
  CardPaddingItem,
  CardRounded,
  CardRoundedItem,
  CardShadow,
  CardVariant,
  CardVariantItem,
} from "@/Tokens/Card";
import type {
  CheckboxColor,
  CheckboxColorItem,
  CheckboxRounded,
  CheckboxSize,
} from "@/Tokens/Checkbox";
import type { ChipSize, ChipSizeItem } from "@/Tokens/Chip";
import type {
  ColorPickerRounded,
  ColorPickerSizeItem,
} from "@/Tokens/ColorPicker";
import type { DividerColor, DividerOrientation } from "@/Tokens/Divider";
import type {
  DrawerBlur,
  DrawerPlacement,
  DrawerSize,
  DrawerSizeItem,
  DrawerTransition,
  DrawerTransitionLayer,
} from "@/Tokens/Drawer";
import type {
  FormFieldColor,
  FormFieldColorItem,
  FormFieldRounded,
  FormFieldRoundedItem,
  FormFieldSize,
  FormFieldSizeItem,
  FormFieldVariant,
  FormFieldVariantItem,
} from "@/Tokens/FormField";
import type { IconSize } from "@/Tokens/Icon";
import type { LabelSize } from "@/Tokens/Label";
import type {
  LinkColor,
  LinkColorItem,
  LinkSize,
  LinkUnderline,
} from "@/Tokens/Link";
import type { ListboxColorItem, ListboxSizeItem } from "@/Tokens/Listbox";
import type { MenuRounded, MenuShadow } from "@/Tokens/Menu";
import type {
  ModalAlign,
  ModalBlur,
  ModalSize,
  ModalTransition,
  ModalTransitionLayer,
} from "@/Tokens/Modal";
import type {
  OtpFieldColor,
  OtpFieldColorItem,
  OtpFieldRounded,
  OtpFieldRoundedItem,
  OtpFieldSize,
  OtpFieldSizeItem,
  OtpFieldVariant,
  OtpFieldVariantItem,
} from "@/Tokens/OtpField";
import type {
  PaginationColor,
  PaginationColorItem,
  PaginationRounded,
  PaginationRoundedItem,
  PaginationSize,
  PaginationSizeItem,
  PaginationVariant,
  PaginationVariantItem,
} from "@/Tokens/Pagination";
import type {
  ProgressColor,
  ProgressColorItem,
  ProgressRounded,
  ProgressSize,
  ProgressVariant,
} from "@/Tokens/Progress";
import type {
  RadioColor,
  RadioColorItem,
  RadioRounded,
  RadioSize,
} from "@/Tokens/Radio";
import type { SkeletonRounded } from "@/Tokens/Skeleton";
import type {
  SliderColor,
  SliderColorItem,
  SliderRounded,
  SliderSize,
  SliderSizeItem,
} from "@/Tokens/Slider";
import type {
  SnackbarColor,
  SnackbarColorItem,
  SnackbarPadding,
  SnackbarPaddingItem,
  SnackbarPosition,
  SnackbarRounded,
  SnackbarRoundedItem,
  SnackbarTransition,
} from "@/Tokens/Snackbar";
import type {
  SpinnerColor,
  SpinnerColorItem,
  SpinnerSize,
  SpinnerVariant,
} from "@/Tokens/Spinner";
import type {
  StepperColor,
  StepperColorItem,
  StepperOrientation,
  StepperOrientationItem,
  StepperSize,
  StepperSizeItem,
} from "@/Tokens/Stepper";
import type {
  SwitchColor,
  SwitchColorItem,
  SwitchRounded,
  SwitchSize,
} from "@/Tokens/Switch";
import type {
  TabsColor,
  TabsColorItem,
  TabsOrientation,
  TabsOrientationItem,
  TabsSize,
  TabsSizeItem,
  TabsVariant,
  TabsVariantItem,
} from "@/Tokens/Tabs";
import type { TextareaResize } from "@/Tokens/Textarea";
import type { TimeColor, TimeColorItem, TimeRounded } from "@/Tokens/Time";
import type {
  ToggleGroupColor,
  ToggleGroupColorItem,
  ToggleGroupOrientation,
  ToggleGroupOrientationItem,
  ToggleGroupRounded,
  ToggleGroupRoundedItem,
  ToggleGroupSize,
  ToggleGroupSizeItem,
  ToggleGroupVariant,
  ToggleGroupVariantItem,
} from "@/Tokens/ToggleGroup";
import type {
  TooltipColor,
  TooltipColorItem,
  TooltipRounded,
  TooltipSize,
  TooltipSizeItem,
} from "@/Tokens/Tooltip";
import type { Overwrite } from "@/Utils/types";

export type Direction = "ltr" | "rtl";

/**
 * Shared density defaults for form controls (`size` / `rounded` token keys).
 * Keys follow the canonical FormField scales (`2xs`…`2xl`, `none`/`xs`…`4xl`/`full`),
 * which form controls share after token alignment.
 * Applied when merging props for form registry components only.
 * Radio and Switch ignore `rounded` (shape-driven `full` stays from lib / registry).
 */
export interface BridgeUIFormDefaults {
  /**
   * Default `rounded` token key for form controls (not applied to Radio / Switch).
   *
   * @default undefined
   */
  rounded?: keyof FormFieldRounded;

  /**
   * Default `size` token key for form controls (`2xs` … `2xl`).
   *
   * @default undefined
   */
  size?: keyof FormFieldSize;
}

export interface BridgeUIGlobal {
  /**
   * Global breakpoint CSS length overrides for `useBreakpoint`.
   *
   * @default {}
   */
  breakpoints: Record<string, string>;

  /**
   * Date adapter used by calendars and pickers (`format`, `parse`, calendar math).
   * When omitted, Bridge falls back to the native `Date` adapter.
   * See `packages/{react,vue}/docs/examples` for dayjs / date-fns / luxon /
   * moment samples (not shipped).
   *
   * @default undefined
   */
  dates?: DateAdapter;

  /**
   * Global text direction.
   *
   * @default "ltr"
   */
  direction: Direction;

  /**
   * Default `size` / `rounded` for form controls (TextField, Select, Checkbox, …).
   * Merge order: instance props → component `defaultProps` → `formDefaults` → lib defaults.
   * Does not apply to non-form components (Button, Progress, Modal, …).
   *
   * @default undefined
   */
  formDefaults?: BridgeUIFormDefaults;

  /**
   * i18n adapter used to translate Bridge chrome strings
   * (`"Close"`, `"Hide password"`, …). Source English text is the lookup key.
   * When omitted, `resolveMessage` returns the source string.
   * Optional `setLocale` is invoked by Bridge `setLocale`.
   * See `packages/{react,vue}/examples` for samples (not shipped as packages).
   *
   * @default undefined
   */
  i18n?: I18nAdapter;

  /**
   * Icon adapter used to resolve semantic icon names.
   * Required when components use semantic names (`"clear"`, `"check"`, …).
   * See `packages/{react,vue}/examples` for samples (not shipped as packages).
   *
   * @default undefined
   */
  icons?: IconAdapter;

  /**
   * Global locale.
   *
   * @default "en-US"
   */
  locale: string;

  /**
   * Default mobile threshold for `useBreakpoint` (`mobile` flag).
   *
   * @default "sm"
   */
  mobileBreakpoint: string;

  /**
   * Global theme.
   *
   * @default "light"
   */
  theme: string;

  /**
   * Default IANA time zone for date adapters and pickers.
   * Override per component with the `timeZone` prop.
   *
   * @default Intl.DateTimeFormat().resolvedOptions().timeZone
   */
  timeZone: string;
}

export interface AccordionConfigOverrides {}
export interface AccordionItemConfigOverrides {}
export interface AlertConfigOverrides {}
export interface AutocompleteConfigOverrides {}
export interface AvatarConfigOverrides {}
export interface BadgeConfigOverrides {}
export interface BreadcrumbConfigOverrides {}
export interface BreadcrumbItemConfigOverrides {}
export interface ButtonConfigOverrides {}
export interface CardConfigOverrides {}
export interface CheckboxConfigOverrides {}
export interface ChipConfigOverrides {}
export interface ColorFieldConfigOverrides {}
export interface ColorPickerConfigOverrides {}
export interface DateFieldConfigOverrides {}
export interface DatePickerConfigOverrides {}
export interface DateRangeFieldConfigOverrides {}
export interface DateRangePickerConfigOverrides {}
export interface DateTimeFieldConfigOverrides {}
export interface DateTimePickerConfigOverrides {}
export interface DateTimeRangeFieldConfigOverrides {}
export interface DateTimeRangePickerConfigOverrides {}
export interface DividerConfigOverrides {}
export interface DrawerConfigOverrides {}
export interface IconConfigOverrides {}
export interface LabelConfigOverrides {}
export interface LinkConfigOverrides {}
export interface ListConfigOverrides {}
export interface ListItemConfigOverrides {}
export interface ListSectionConfigOverrides {}
export interface MenuConfigOverrides {}
export interface ModalConfigOverrides {}
export interface NumberFieldConfigOverrides {}
export interface OtpFieldConfigOverrides {}
export interface PaginationConfigOverrides {}
export interface PasswordFieldConfigOverrides {}
export interface ProgressConfigOverrides {}
export interface RadioConfigOverrides {}
export interface SelectConfigOverrides {}
export interface SkeletonConfigOverrides {}
export interface SliderConfigOverrides {}
export interface SnackbarConfigOverrides {}
export interface SpinnerConfigOverrides {}
export interface StepConfigOverrides {}
export interface StepperConfigOverrides {}
export interface SwitchConfigOverrides {}
export interface TabConfigOverrides {}
export interface TabItemConfigOverrides {}
export interface TabListConfigOverrides {}
export interface TabPanelConfigOverrides {}
export interface TabsConfigOverrides {}
export interface TextareaConfigOverrides {}
export interface TextFieldConfigOverrides {}
export interface TimeFieldConfigOverrides {}
export interface TimePickerConfigOverrides {}
export interface TimeRangeFieldConfigOverrides {}
export interface TimeRangePickerConfigOverrides {}
export interface ToggleGroupConfigOverrides {}
export interface ToggleItemConfigOverrides {}
export interface TooltipConfigOverrides {}

export interface AccordionConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof AccordionColor;
    disabled: boolean;
    multiple: boolean;
    size: keyof AccordionSize;
    variant: keyof AccordionVariant;
  }>;
  tokens: Partial<{
    color: Record<string, AccordionColorItem>;
    size: Record<string, AccordionSizeItem>;
    variant: Record<string, AccordionVariantItem>;
  }>;
}

export interface AccordionItemConfigBase {
  classes: object;
  defaultProps: Partial<{
    disabled: boolean;
  }>;
}

export interface AlertConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof AlertColor;
    padding: keyof AlertPadding;
    rounded: keyof AlertRounded;
    shadow: keyof AlertShadow;
    variant: keyof AlertVariant;
  }>;
  tokens: Partial<{
    padding: Record<string, string>;
    rounded: Record<string, string>;
    shadow: Record<string, string>;
    variant: Record<string, Record<string, AlertColorItem>>;
  }>;
}

export interface AvatarConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof AvatarColor;
    rounded: keyof AvatarRounded;
    size: keyof AvatarSize;
  }>;
  tokens: Partial<{
    color: Record<string, AvatarColorItem>;
    iconSize: Record<string, AvatarIconSizeItem>;
    rounded: Record<string, string>;
    size: Record<string, string>;
  }>;
}

export interface BadgeConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof BadgeColor;
    density: keyof BadgeDensity;
    rounded: keyof BadgeRounded;
    size: keyof BadgeSize;
    variant: keyof BadgeVariant;
  }>;
  tokens: Partial<{
    density: Record<string, Record<string, string>>;
    rounded: Record<string, string>;
    variant: Record<string, Record<string, BadgeColorItem>>;
  }>;
}

export interface BreadcrumbConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof BreadcrumbSize;
  }>;
  tokens: Partial<{
    size: Record<string, BreadcrumbSizeItem>;
  }>;
}

export interface BreadcrumbItemConfigBase {
  classes: object;
  defaultProps: Partial<{
    current: boolean;
    disabled: boolean;
  }>;
}

export interface ButtonConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof ButtonColor;
    density: keyof ButtonDensity;
    rounded: keyof ButtonRounded;
    size: keyof ButtonSize;
    variant: keyof ButtonVariant;
  }>;
  tokens: Partial<{
    density: Record<string, Record<string, string>>;
    rounded: Record<string, string>;
    variant: Record<string, Record<string, ButtonColorItem>>;
  }>;
}

export interface CardConfigBase {
  classes: object;
  defaultProps: Partial<{
    padding: keyof CardPadding;
    rounded: keyof CardRounded;
    shadow: keyof CardShadow;
    variant: keyof CardVariant;
  }>;
  tokens: Partial<{
    padding: Record<string, CardPaddingItem>;
    rounded: Record<string, CardRoundedItem>;
    shadow: Record<string, string>;
    variant: Record<string, CardVariantItem>;
  }>;
}

export interface CheckboxConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof CheckboxColor;
    hideErrorMessage: boolean;
    rounded: keyof CheckboxRounded;
    size: keyof CheckboxSize;
  }>;
  tokens: Partial<{
    color: Record<string, CheckboxColorItem>;
    rounded: Record<string, string>;
    size: Record<string, string>;
  }>;
}

export interface ChipConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof ChipSize;
  }>;
  tokens: Partial<{
    size: Record<string, ChipSizeItem>;
  }>;
}

export interface ColorFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    alpha: boolean;
    color: keyof FormFieldColor;
    editable: boolean;
    fill: boolean;
    format: "hex" | "hsl" | "rgb" | "hexa" | "hsla" | "rgba";
    hideErrorMessage: boolean;
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    showFooter: boolean;
    showSwatch: boolean;
    size: keyof FormFieldSize;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    color: Record<string, FormFieldColorItem>;
    colorPicker: Partial<{
      rounded: keyof ColorPickerRounded;
      roundedMap: Record<string, string>;
      size: Record<string, ColorPickerSizeItem>;
    }>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface ColorPickerConfigBase {
  classes: object;
  defaultProps: Partial<{
    alpha: boolean;
    error: boolean;
    fill: boolean;
    format: "hex" | "hsl" | "rgb" | "hexa" | "hsla" | "rgba";
    rounded: keyof ColorPickerRounded;
    showFooter: boolean;
  }>;
  tokens: Partial<{
    rounded: Record<string, string>;
    size: Record<string, ColorPickerSizeItem>;
  }>;
}

export interface DateFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof FormFieldColor;
    editable: boolean;
    fill: boolean;
    hideErrorMessage: boolean;
    hideMonths: boolean;
    hideOutsideDays: boolean;
    hideWeekdays: boolean;
    hideYears: boolean;
    multiple: boolean;
    range: boolean;
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    showFooter: boolean;
    size: keyof FormFieldSize;
    startOfWeek: number;
    timeZone: string;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    calendar: Partial<{
      color: Record<string, CalendarColorItem>;
      day: Partial<CalendarDay>;
      rounded: Record<string, string>;
    }>;
    color: Record<string, FormFieldColorItem>;
    datePicker: Partial<{
      color: keyof CalendarColor;
      colorMap: Record<string, CalendarColorItem>;
      day: Partial<CalendarDay>;
      rounded: keyof CalendarRounded;
      roundedMap: Record<string, string>;
    }>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface DatePickerConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof CalendarColor;
    error: boolean;
    fill: boolean;
    hideMonths: boolean;
    hideOutsideDays: boolean;
    hideWeekdays: boolean;
    hideYears: boolean;
    multiple: boolean;
    range: boolean;
    rounded: keyof CalendarRounded;
    showFooter: boolean;
    startOfWeek: number;
    timeZone: string;
  }>;
  tokens: Partial<{
    calendar: Partial<{
      color: Record<string, CalendarColorItem>;
      day: Partial<CalendarDay>;
      rounded: Record<string, string>;
    }>;
    color: Record<string, CalendarColorItem>;
    day: Partial<CalendarDay>;
    rounded: Record<string, string>;
  }>;
}

export interface DateRangeFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof FormFieldColor;
    editable: boolean;
    fill: boolean;
    hideErrorMessage: boolean;
    hideMonths: boolean;
    hideOutsideDays: boolean;
    hideWeekdays: boolean;
    hideYears: boolean;
    orientation: "vertical" | "horizontal";
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    showFooter: boolean;
    size: keyof FormFieldSize;
    startOfWeek: number;
    timeZone: string;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    calendar: Partial<{
      color: Record<string, CalendarColorItem>;
      day: Partial<CalendarDay>;
      rounded: Record<string, string>;
    }>;
    color: Record<string, FormFieldColorItem>;
    dateRangePicker: Partial<{
      color: keyof CalendarColor;
      colorMap: Record<string, CalendarColorItem>;
      day: Partial<CalendarDay>;
      rounded: keyof CalendarRounded;
      roundedMap: Record<string, string>;
    }>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface DateRangePickerConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof CalendarColor;
    error: boolean;
    fill: boolean;
    hideMonths: boolean;
    hideOutsideDays: boolean;
    hideWeekdays: boolean;
    hideYears: boolean;
    orientation: "vertical" | "horizontal";
    rounded: keyof CalendarRounded;
    showFooter: boolean;
    startOfWeek: number;
    timeZone: string;
  }>;
  tokens: Partial<{
    calendar: Partial<{
      color: Record<string, CalendarColorItem>;
      day: Partial<CalendarDay>;
      rounded: Record<string, string>;
    }>;
    color: Record<string, CalendarColorItem>;
    day: Partial<CalendarDay>;
    rounded: Record<string, string>;
  }>;
}

export interface DateTimeFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    ampm: boolean;
    color: keyof FormFieldColor;
    editable: boolean;
    fill: boolean;
    hideErrorMessage: boolean;
    hideMonths: boolean;
    hideOutsideDays: boolean;
    hideWeekdays: boolean;
    hideYears: boolean;
    interval: number;
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    showFooter: boolean;
    showSeconds: boolean;
    size: keyof FormFieldSize;
    startOfWeek: number;
    timeZone: string;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    calendar: Partial<{
      color: Record<string, CalendarColorItem>;
      day: Partial<CalendarDay>;
      rounded: Record<string, string>;
    }>;
    color: Record<string, FormFieldColorItem>;
    dateTimePicker: Partial<{
      color: keyof CalendarColor;
      colorMap: Record<string, CalendarColorItem>;
      day: Partial<CalendarDay>;
      rounded: keyof CalendarRounded;
      roundedMap: Record<string, string>;
      timeColor: keyof TimeColor;
      timeColorMap: Record<string, TimeColorItem>;
      timeRounded: keyof TimeRounded;
      timeRoundedMap: Record<string, string>;
    }>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    time: Partial<{
      color: Record<string, TimeColorItem>;
      rounded: Record<string, string>;
    }>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface DateTimePickerConfigBase {
  classes: object;
  defaultProps: Partial<{
    ampm: boolean;
    color: keyof CalendarColor;
    error: boolean;
    fill: boolean;
    hideMonths: boolean;
    hideOutsideDays: boolean;
    hideWeekdays: boolean;
    hideYears: boolean;
    interval: number;
    rounded: keyof CalendarRounded;
    showFooter: boolean;
    showSeconds: boolean;
    startOfWeek: number;
    timeZone: string;
  }>;
  tokens: Partial<{
    calendar: Partial<{
      color: Record<string, CalendarColorItem>;
      day: Partial<CalendarDay>;
      rounded: Record<string, string>;
    }>;
    color: Record<string, CalendarColorItem>;
    day: Partial<CalendarDay>;
    rounded: Record<string, string>;
    time: Partial<{
      color: Record<string, TimeColorItem>;
      rounded: Record<string, string>;
    }>;
  }>;
}

export interface TimeFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    ampm: boolean;
    color: keyof FormFieldColor;
    editable: boolean;
    fill: boolean;
    hideErrorMessage: boolean;
    interval: number;
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    showFooter: boolean;
    showSeconds: boolean;
    size: keyof FormFieldSize;
    timeZone: string;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    color: Record<string, FormFieldColorItem>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    time: Partial<{
      color: Record<string, TimeColorItem>;
      rounded: Record<string, string>;
    }>;
    timePicker: Partial<{
      color: keyof TimeColor;
      colorMap: Record<string, TimeColorItem>;
      rounded: keyof TimeRounded;
      roundedMap: Record<string, string>;
    }>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface TimePickerConfigBase {
  classes: object;
  defaultProps: Partial<{
    ampm: boolean;
    color: keyof TimeColor;
    error: boolean;
    fill: boolean;
    interval: number;
    rounded: keyof TimeRounded;
    showFooter: boolean;
    showSeconds: boolean;
    timeZone: string;
  }>;
  tokens: Partial<{
    color: Record<string, TimeColorItem>;
    rounded: Record<string, string>;
    time: Partial<{
      color: Record<string, TimeColorItem>;
      rounded: Record<string, string>;
    }>;
  }>;
}

export interface TimeRangeFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    ampm: boolean;
    color: keyof FormFieldColor;
    editable: boolean;
    fill: boolean;
    hideErrorMessage: boolean;
    interval: number;
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    showFooter: boolean;
    showSeconds: boolean;
    size: keyof FormFieldSize;
    timeZone: string;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    color: Record<string, FormFieldColorItem>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    time: Partial<{
      color: Record<string, TimeColorItem>;
      rounded: Record<string, string>;
    }>;
    timeRangePicker: Partial<{
      color: keyof TimeColor;
      colorMap: Record<string, TimeColorItem>;
      rounded: keyof TimeRounded;
      roundedMap: Record<string, string>;
    }>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface TimeRangePickerConfigBase {
  classes: object;
  defaultProps: Partial<{
    ampm: boolean;
    color: keyof TimeColor;
    error: boolean;
    fill: boolean;
    interval: number;
    orientation: "vertical" | "horizontal";
    rounded: keyof TimeRounded;
    showFooter: boolean;
    showSeconds: boolean;
    timeZone: string;
  }>;
  tokens: Partial<{
    color: Record<string, TimeColorItem>;
    rounded: Record<string, string>;
    time: Partial<{
      color: Record<string, TimeColorItem>;
      rounded: Record<string, string>;
    }>;
  }>;
}

export interface DateTimeRangeFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    ampm: boolean;
    color: keyof FormFieldColor;
    editable: boolean;
    fill: boolean;
    hideErrorMessage: boolean;
    hideMonths: boolean;
    hideOutsideDays: boolean;
    hideWeekdays: boolean;
    hideYears: boolean;
    interval: number;
    orientation: "vertical" | "horizontal";
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    showFooter: boolean;
    showSeconds: boolean;
    size: keyof FormFieldSize;
    startOfWeek: number;
    timeZone: string;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    calendar: Partial<{
      color: Record<string, CalendarColorItem>;
      day: Partial<CalendarDay>;
      rounded: Record<string, string>;
    }>;
    color: Record<string, FormFieldColorItem>;
    dateTimeRangePicker: Partial<{
      color: keyof CalendarColor;
      colorMap: Record<string, CalendarColorItem>;
      day: Partial<CalendarDay>;
      rounded: keyof CalendarRounded;
      roundedMap: Record<string, string>;
      timeColor: keyof TimeColor;
      timeColorMap: Record<string, TimeColorItem>;
      timeRounded: keyof TimeRounded;
      timeRoundedMap: Record<string, string>;
    }>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    time: Partial<{
      color: Record<string, TimeColorItem>;
      rounded: Record<string, string>;
    }>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface DateTimeRangePickerConfigBase {
  classes: object;
  defaultProps: Partial<{
    ampm: boolean;
    color: keyof CalendarColor;
    error: boolean;
    fill: boolean;
    hideMonths: boolean;
    hideOutsideDays: boolean;
    hideWeekdays: boolean;
    hideYears: boolean;
    interval: number;
    orientation: "vertical" | "horizontal";
    rounded: keyof CalendarRounded;
    showFooter: boolean;
    showSeconds: boolean;
    startOfWeek: number;
    timeZone: string;
  }>;
  tokens: Partial<{
    calendar: Partial<{
      color: Record<string, CalendarColorItem>;
      day: Partial<CalendarDay>;
      rounded: Record<string, string>;
    }>;
    color: Record<string, CalendarColorItem>;
    day: Partial<CalendarDay>;
    rounded: Record<string, string>;
    time: Partial<{
      color: Record<string, TimeColorItem>;
      rounded: Record<string, string>;
    }>;
  }>;
}

export interface IconConfigBase {
  defaultProps: Partial<{
    size: keyof IconSize;
  }>;
  tokens: Partial<{
    size: Record<string, string>;
  }>;
}

export interface LabelConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof LabelSize;
  }>;
  tokens: Partial<{
    size: Record<string, string>;
  }>;
}

export interface LinkConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof LinkColor;
    size: keyof LinkSize;
    underline: keyof LinkUnderline;
  }>;
  tokens: Partial<{
    color: Record<string, LinkColorItem>;
    size: Record<string, string>;
    underline: Record<string, string>;
  }>;
}

export interface ListConfigBase {
  classes: object;
}

export interface ListItemConfigBase {
  classes: object;
  defaultProps: Partial<{
    role: "button" | "option" | "menuitem";
    selectedIcon: unknown;
  }>;
}

export interface ListSectionConfigBase {
  classes: object;
}

export interface MenuConfigBase {
  classes: object;
  defaultProps: Partial<{
    rounded: keyof MenuRounded;
    shadow: keyof MenuShadow;
  }>;
  tokens: Partial<{
    rounded: Record<string, string>;
    shadow: Record<string, string>;
  }>;
}

export interface ModalConfigBase {
  classes: object;
  defaultProps: Partial<{
    align: keyof ModalAlign;
    blur: keyof ModalBlur;
    size: keyof ModalSize;
    teleportTo: false | string;
    transition: keyof ModalTransition;
  }>;
  tokens: Partial<{
    align: Record<string, string>;
    blur: Record<string, string>;
    size: Record<string, string>;
    transition: Partial<Record<string, Partial<ModalTransitionLayer>>>;
  }>;
}

export interface DrawerConfigBase {
  classes: object;
  defaultProps: Partial<{
    blur: keyof DrawerBlur;
    placement: keyof DrawerPlacement;
    size: keyof DrawerSize;
    teleportTo: false | string;
    transition: keyof DrawerTransition;
  }>;
  tokens: Partial<{
    blur: Record<string, string>;
    placement: Record<string, string>;
    size: Record<string, DrawerSizeItem>;
    transition: Partial<Record<string, Partial<DrawerTransitionLayer>>>;
  }>;
}

export interface NumberFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof FormFieldColor;
    hideErrorMessage: boolean;
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    size: keyof FormFieldSize;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    color: Record<string, FormFieldColorItem>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface OtpFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof OtpFieldColor;
    hideErrorMessage: boolean;
    length: number;
    rounded: keyof OtpFieldRounded;
    size: keyof OtpFieldSize;
    type: "numeric" | "alphanumeric";
    variant: keyof OtpFieldVariant;
  }>;
  tokens: Partial<{
    baseField: Partial<{
      size: Record<string, BaseFieldSizeItem>;
    }>;
    color: Record<string, OtpFieldColorItem>;
    rounded: Record<string, OtpFieldRoundedItem>;
    size: Record<string, OtpFieldSizeItem>;
    variant: Record<string, OtpFieldVariantItem>;
  }>;
}

export interface PaginationConfigBase {
  classes: object;
  defaultProps: Partial<{
    boundaryCount: number;
    color: keyof PaginationColor;
    disabled: boolean;
    hideNextButton: boolean;
    hidePrevButton: boolean;
    mode: "simple" | "numbered";
    rounded: keyof PaginationRounded;
    siblingCount: number;
    size: keyof PaginationSize;
    variant: keyof PaginationVariant;
  }>;
  tokens: Partial<{
    color: Record<string, PaginationColorItem>;
    rounded: Record<string, PaginationRoundedItem>;
    size: Record<string, PaginationSizeItem>;
    variant: Record<string, PaginationVariantItem>;
  }>;
}

export interface PasswordFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof FormFieldColor;
    hideErrorMessage: boolean;
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    size: keyof FormFieldSize;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    color: Record<string, FormFieldColorItem>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface RadioConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof RadioColor;
    hideErrorMessage: boolean;
    rounded: keyof RadioRounded;
    size: keyof RadioSize;
  }>;
  tokens: Partial<{
    color: Record<string, RadioColorItem>;
    rounded: Record<string, string>;
    size: Record<string, string>;
  }>;
}

export interface SnackbarConfigBase {
  classes: object;
  defaultProps: Partial<{
    closeButton: boolean;
    color: keyof SnackbarColor;
    duration: false | number;
    padding: keyof SnackbarPadding;
    position: keyof SnackbarPosition;
    progressbar: boolean;
    rounded: keyof SnackbarRounded;
    teleportTo: false | string;
    transition: keyof SnackbarTransition;
  }>;
  tokens: Partial<{
    color: Record<string, SnackbarColorItem>;
    padding: Record<string, SnackbarPaddingItem>;
    position: Record<string, string>;
    rounded: Record<string, SnackbarRoundedItem>;
    transition: Record<string, string>;
  }>;
}

export interface AutocompleteConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof FormFieldColor;
    hideErrorMessage: boolean;
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    showFooter: boolean;
    size: keyof FormFieldSize;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    color: Record<string, FormFieldColorItem>;
    listbox: Partial<{
      color: Record<string, ListboxColorItem>;
      size: Record<string, ListboxSizeItem>;
    }>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface SelectConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof FormFieldColor;
    hideErrorMessage: boolean;
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    showFooter: boolean;
    size: keyof FormFieldSize;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    color: Record<string, FormFieldColorItem>;
    listbox: Partial<{
      color: Record<string, ListboxColorItem>;
      size: Record<string, ListboxSizeItem>;
    }>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface DividerConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof DividerColor;
    orientation: keyof DividerOrientation;
  }>;
  tokens: Partial<{
    color: Record<string, string>;
    orientation: Record<string, string>;
  }>;
}

export interface ProgressConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof ProgressColor;
    rounded: keyof ProgressRounded;
    size: keyof ProgressSize;
    variant: keyof ProgressVariant;
  }>;
  tokens: Partial<{
    color: Record<string, ProgressColorItem>;
    rounded: Record<string, string>;
    size: Record<string, string>;
    variant: Record<string, string>;
  }>;
}

export interface SkeletonConfigBase {
  classes: object;
  defaultProps: Partial<{
    rounded: keyof SkeletonRounded;
  }>;
  tokens: Partial<{
    rounded: Record<string, string>;
  }>;
}

export interface SliderConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof SliderColor;
    hideErrorMessage: boolean;
    max: number;
    min: number;
    rounded: keyof SliderRounded;
    showStops: boolean;
    showTooltip: boolean;
    size: keyof SliderSize;
    step: number;
  }>;
  tokens: Partial<{
    baseField: Partial<{
      size: Record<string, BaseFieldSizeItem>;
    }>;
    color: Record<string, SliderColorItem>;
    rounded: Record<string, string>;
    size: Record<string, SliderSizeItem>;
  }>;
}

export interface SpinnerConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof SpinnerColor;
    disableShrink: boolean;
    enableTrack: boolean;
    size: keyof SpinnerSize;
    thickness: number;
    variant: keyof SpinnerVariant;
  }>;
  tokens: Partial<{
    color: Record<string, SpinnerColorItem>;
    size: Record<string, string>;
    variant: Record<string, string>;
  }>;
}

export interface StepConfigBase {
  classes: object;
  defaultProps: Partial<{
    disabled: boolean;
    error: boolean;
  }>;
}

export interface StepperConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof StepperColor;
    linear: boolean;
    orientation: keyof StepperOrientation;
    size: keyof StepperSize;
  }>;
  tokens: Partial<{
    color: Record<string, StepperColorItem>;
    orientation: Record<string, StepperOrientationItem>;
    size: Record<string, StepperSizeItem>;
  }>;
}

export interface SwitchConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof SwitchColor;
    hideErrorMessage: boolean;
    rounded: keyof SwitchRounded;
    size: keyof SwitchSize;
  }>;
  tokens: Partial<{
    color: Record<string, SwitchColorItem>;
    rounded: Record<string, string>;
    size: Record<string, string>;
  }>;
}

export interface TextareaConfigBase {
  classes: object;
  defaultProps: Partial<{
    autosize: boolean;
    color: keyof FormFieldColor;
    hideErrorMessage: boolean;
    resize: keyof TextareaResize;
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    size: keyof FormFieldSize;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    color: Record<string, FormFieldColorItem>;
    resize: Record<string, string>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface TextFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof FormFieldColor;
    hideErrorMessage: boolean;
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    size: keyof FormFieldSize;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    color: Record<string, FormFieldColorItem>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface TabsConfigBase {
  classes: object;
  defaultProps: Partial<{
    activation: "manual" | "automatic";
    color: keyof TabsColor;
    keepMounted: boolean;
    orientation: keyof TabsOrientation;
    size: keyof TabsSize;
    variant: keyof TabsVariant;
  }>;
  tokens: Partial<{
    color: Record<string, TabsColorItem>;
    orientation: Record<string, TabsOrientationItem>;
    size: Record<string, TabsSizeItem>;
    variant: Record<string, TabsVariantItem>;
  }>;
}

export interface TabListConfigBase {
  classes: object;
}

export interface TabConfigBase {
  classes: object;
}

export interface TabPanelConfigBase {
  classes: object;
  defaultProps: Partial<{
    keepMounted: boolean;
  }>;
}

export interface TabItemConfigBase {
  classes: object;
  defaultProps: Partial<{
    keepMounted: boolean;
  }>;
}

export interface ToggleGroupConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof ToggleGroupColor;
    disabled: boolean;
    full: boolean;
    multiple: boolean;
    orientation: keyof ToggleGroupOrientation;
    rounded: keyof ToggleGroupRounded;
    size: keyof ToggleGroupSize;
    variant: keyof ToggleGroupVariant;
  }>;
  tokens: Partial<{
    color: Record<string, ToggleGroupColorItem>;
    orientation: Record<string, ToggleGroupOrientationItem>;
    rounded: Record<string, ToggleGroupRoundedItem>;
    size: Record<string, ToggleGroupSizeItem>;
    variant: Record<string, ToggleGroupVariantItem>;
  }>;
}

export interface ToggleItemConfigBase {
  classes: object;
  defaultProps: Partial<{
    disabled: boolean;
  }>;
}

export interface TooltipConfigBase {
  classes: object;
  defaultProps: Partial<{
    arrow: boolean;
    closeDelay: number;
    color: keyof TooltipColor;
    offset: number;
    openDelay: number;
    placement: string;
    rounded: keyof TooltipRounded;
    size: keyof TooltipSize;
    strategy: "fixed" | "absolute";
    teleportTo: false | string;
  }>;
  tokens: Partial<{
    color: Record<string, TooltipColorItem>;
    rounded: Record<string, string>;
    size: Record<string, TooltipSizeItem>;
  }>;
}

export type BridgeUIComponentsConfig = Partial<{
  Accordion: Partial<Overwrite<AccordionConfigBase, AccordionConfigOverrides>>;
  AccordionItem: Partial<
    Overwrite<AccordionItemConfigBase, AccordionItemConfigOverrides>
  >;
  Alert: Partial<Overwrite<AlertConfigBase, AlertConfigOverrides>>;
  Autocomplete: Partial<
    Overwrite<AutocompleteConfigBase, AutocompleteConfigOverrides>
  >;
  Avatar: Partial<Overwrite<AvatarConfigBase, AvatarConfigOverrides>>;
  Badge: Partial<Overwrite<BadgeConfigBase, BadgeConfigOverrides>>;
  Breadcrumb: Partial<
    Overwrite<BreadcrumbConfigBase, BreadcrumbConfigOverrides>
  >;
  BreadcrumbItem: Partial<
    Overwrite<BreadcrumbItemConfigBase, BreadcrumbItemConfigOverrides>
  >;
  Button: Partial<Overwrite<ButtonConfigBase, ButtonConfigOverrides>>;
  Card: Partial<Overwrite<CardConfigBase, CardConfigOverrides>>;
  Checkbox: Partial<Overwrite<CheckboxConfigBase, CheckboxConfigOverrides>>;
  Chip: Partial<Overwrite<ChipConfigBase, ChipConfigOverrides>>;
  ColorField: Partial<
    Overwrite<ColorFieldConfigBase, ColorFieldConfigOverrides>
  >;
  ColorPicker: Partial<
    Overwrite<ColorPickerConfigBase, ColorPickerConfigOverrides>
  >;
  DateField: Partial<Overwrite<DateFieldConfigBase, DateFieldConfigOverrides>>;
  DatePicker: Partial<
    Overwrite<DatePickerConfigBase, DatePickerConfigOverrides>
  >;
  DateRangeField: Partial<
    Overwrite<DateRangeFieldConfigBase, DateRangeFieldConfigOverrides>
  >;
  DateRangePicker: Partial<
    Overwrite<DateRangePickerConfigBase, DateRangePickerConfigOverrides>
  >;
  DateTimeField: Partial<
    Overwrite<DateTimeFieldConfigBase, DateTimeFieldConfigOverrides>
  >;
  DateTimePicker: Partial<
    Overwrite<DateTimePickerConfigBase, DateTimePickerConfigOverrides>
  >;
  DateTimeRangeField: Partial<
    Overwrite<DateTimeRangeFieldConfigBase, DateTimeRangeFieldConfigOverrides>
  >;
  DateTimeRangePicker: Partial<
    Overwrite<DateTimeRangePickerConfigBase, DateTimeRangePickerConfigOverrides>
  >;
  Divider: Partial<Overwrite<DividerConfigBase, DividerConfigOverrides>>;
  Drawer: Partial<Overwrite<DrawerConfigBase, DrawerConfigOverrides>>;
  Icon: Partial<Overwrite<IconConfigBase, IconConfigOverrides>>;
  Label: Partial<Overwrite<LabelConfigBase, LabelConfigOverrides>>;
  Link: Partial<Overwrite<LinkConfigBase, LinkConfigOverrides>>;
  List: Partial<Overwrite<ListConfigBase, ListConfigOverrides>>;
  ListItem: Partial<Overwrite<ListItemConfigBase, ListItemConfigOverrides>>;
  ListSection: Partial<
    Overwrite<ListSectionConfigBase, ListSectionConfigOverrides>
  >;
  Menu: Partial<Overwrite<MenuConfigBase, MenuConfigOverrides>>;
  Modal: Partial<Overwrite<ModalConfigBase, ModalConfigOverrides>>;
  NumberField: Partial<
    Overwrite<NumberFieldConfigBase, NumberFieldConfigOverrides>
  >;
  OtpField: Partial<Overwrite<OtpFieldConfigBase, OtpFieldConfigOverrides>>;
  Pagination: Partial<
    Overwrite<PaginationConfigBase, PaginationConfigOverrides>
  >;
  PasswordField: Partial<
    Overwrite<PasswordFieldConfigBase, PasswordFieldConfigOverrides>
  >;
  Progress: Partial<Overwrite<ProgressConfigBase, ProgressConfigOverrides>>;
  Radio: Partial<Overwrite<RadioConfigBase, RadioConfigOverrides>>;
  Select: Partial<Overwrite<SelectConfigBase, SelectConfigOverrides>>;
  Skeleton: Partial<Overwrite<SkeletonConfigBase, SkeletonConfigOverrides>>;
  Slider: Partial<Overwrite<SliderConfigBase, SliderConfigOverrides>>;
  Snackbar: Partial<Overwrite<SnackbarConfigBase, SnackbarConfigOverrides>>;
  Spinner: Partial<Overwrite<SpinnerConfigBase, SpinnerConfigOverrides>>;
  Step: Partial<Overwrite<StepConfigBase, StepConfigOverrides>>;
  Stepper: Partial<Overwrite<StepperConfigBase, StepperConfigOverrides>>;
  Switch: Partial<Overwrite<SwitchConfigBase, SwitchConfigOverrides>>;
  Tab: Partial<Overwrite<TabConfigBase, TabConfigOverrides>>;
  TabItem: Partial<Overwrite<TabItemConfigBase, TabItemConfigOverrides>>;
  TabList: Partial<Overwrite<TabListConfigBase, TabListConfigOverrides>>;
  TabPanel: Partial<Overwrite<TabPanelConfigBase, TabPanelConfigOverrides>>;
  Tabs: Partial<Overwrite<TabsConfigBase, TabsConfigOverrides>>;
  Textarea: Partial<Overwrite<TextareaConfigBase, TextareaConfigOverrides>>;
  TextField: Partial<Overwrite<TextFieldConfigBase, TextFieldConfigOverrides>>;
  TimeField: Partial<Overwrite<TimeFieldConfigBase, TimeFieldConfigOverrides>>;
  TimePicker: Partial<
    Overwrite<TimePickerConfigBase, TimePickerConfigOverrides>
  >;
  TimeRangeField: Partial<
    Overwrite<TimeRangeFieldConfigBase, TimeRangeFieldConfigOverrides>
  >;
  TimeRangePicker: Partial<
    Overwrite<TimeRangePickerConfigBase, TimeRangePickerConfigOverrides>
  >;
  ToggleGroup: Partial<
    Overwrite<ToggleGroupConfigBase, ToggleGroupConfigOverrides>
  >;
  ToggleItem: Partial<
    Overwrite<ToggleItemConfigBase, ToggleItemConfigOverrides>
  >;
  Tooltip: Partial<Overwrite<TooltipConfigBase, TooltipConfigOverrides>>;
}>;

export interface BridgeUIOptions {
  components?: BridgeUIComponentsConfig;
  global?: Partial<BridgeUIGlobal>;
}

export const BRIDGE_UI_DEFAULT_GLOBAL: BridgeUIGlobal = {
  theme: "light",
  locale: "en-US",
  breakpoints: {},
  direction: "ltr",
  mobileBreakpoint: "sm",
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};
