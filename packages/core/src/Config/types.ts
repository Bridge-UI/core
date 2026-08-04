// ** Local Imports
import type { I18nAdapter } from "@/Adapters/i18n";
import type { IconAdapter } from "@/Adapters/icon";
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
import type {
  ButtonColor,
  ButtonColorItem,
  ButtonDensity,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
} from "@/Tokens/Button";
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
  CheckboxInvalidated,
  CheckboxRounded,
  CheckboxSize,
} from "@/Tokens/Checkbox";
import type { ChipSize, ChipSizeItem } from "@/Tokens/Chip";
import type { DividerColor, DividerOrientation } from "@/Tokens/Divider";
import type {
  DrawerBlur,
  DrawerPlacement,
  DrawerSize,
  DrawerSizeItem,
  DrawerTransition,
  DrawerTransitionLayer,
} from "@/Tokens/Drawer";
import type { FormControlInvalidated } from "@/Tokens/FormControl";
import type {
  FormFieldColor,
  FormFieldColorItem,
  FormFieldInvalidated,
  FormFieldRounded,
  FormFieldRoundedItem,
  FormFieldSize,
  FormFieldSizeItem,
  FormFieldVariant,
  FormFieldVariantItem,
} from "@/Tokens/FormField";
import type { IconSize } from "@/Tokens/Icon";
import type { LabelInvalidated, LabelSize } from "@/Tokens/Label";
import type {
  LinkColor,
  LinkColorItem,
  LinkSize,
  LinkUnderline,
} from "@/Tokens/Link";
import type {
  ListboxColor,
  ListboxColorItem,
  ListboxInvalidated,
  ListboxSize,
  ListboxSizeItem,
} from "@/Tokens/Listbox";
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
  OtpFieldInvalidated,
  OtpFieldRounded,
  OtpFieldRoundedItem,
  OtpFieldSize,
  OtpFieldSizeItem,
  OtpFieldVariant,
  OtpFieldVariantItem,
} from "@/Tokens/OtpField";
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
  RadioInvalidated,
  RadioRounded,
  RadioSize,
} from "@/Tokens/Radio";
import type { SkeletonRounded } from "@/Tokens/Skeleton";
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
  SwitchColor,
  SwitchColorItem,
  SwitchInvalidated,
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
import type {
  TooltipColor,
  TooltipColorItem,
  TooltipRounded,
  TooltipSize,
  TooltipSizeItem,
} from "@/Tokens/Tooltip";
import type { Overwrite } from "@/Utils/types";

export type Direction = "ltr" | "rtl";

export interface BridgeUIGlobal {
  /**
   * Global breakpoint CSS length overrides for `useBreakpoint`.
   *
   * @default {}
   */
  breakpoints: Record<string, string>;

  /**
   * Global text direction.
   *
   * @default "ltr"
   */
  direction: Direction;

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
}

export interface AlertConfigOverrides {}
export interface AutocompleteConfigOverrides {}
export interface AvatarConfigOverrides {}
export interface BadgeConfigOverrides {}
export interface ButtonConfigOverrides {}
export interface CardConfigOverrides {}
export interface CheckboxConfigOverrides {}
export interface ChipConfigOverrides {}
export interface DividerConfigOverrides {}
export interface DrawerConfigOverrides {}
export interface FormControlConfigOverrides {}
export interface FormFieldConfigOverrides {}
export interface IconConfigOverrides {}
export interface LabelConfigOverrides {}
export interface LinkConfigOverrides {}
export interface ListConfigOverrides {}
export interface ListboxConfigOverrides {}
export interface ListItemConfigOverrides {}
export interface ListSectionConfigOverrides {}
export interface MenuConfigOverrides {}
export interface ModalConfigOverrides {}
export interface NumberFieldConfigOverrides {}
export interface OtpFieldConfigOverrides {}
export interface PasswordFieldConfigOverrides {}
export interface ProgressConfigOverrides {}
export interface RadioConfigOverrides {}
export interface SelectConfigOverrides {}
export interface SkeletonConfigOverrides {}
export interface SnackbarConfigOverrides {}
export interface SpinnerConfigOverrides {}
export interface SwitchConfigOverrides {}
export interface TabConfigOverrides {}
export interface TabItemConfigOverrides {}
export interface TabListConfigOverrides {}
export interface TabPanelConfigOverrides {}
export interface TabsConfigOverrides {}
export interface TextareaConfigOverrides {}
export interface TooltipConfigOverrides {}

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
    rounded: keyof CheckboxRounded;
    size: keyof CheckboxSize;
  }>;
  tokens: Partial<{
    color: Record<string, CheckboxColorItem>;
    invalidated: Partial<CheckboxInvalidated>;
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

export interface IconConfigBase {
  defaultProps: Partial<{
    size: keyof IconSize;
  }>;
  tokens: Partial<{
    size: Record<string, string>;
  }>;
}

export interface FormControlConfigBase {
  classes: object;
  defaultProps: Partial<{
    hideErrorMessage: boolean;
    size: keyof LabelSize;
  }>;
  tokens: Partial<{
    invalidated: Partial<FormControlInvalidated>;
    size: Record<string, string>;
  }>;
}

export interface FormFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof FormFieldColor;
    rounded: keyof FormFieldRounded;
    showErrorIcon: boolean;
    size: keyof FormFieldSize;
    variant: keyof FormFieldVariant;
  }>;
  tokens: Partial<{
    color: Record<string, FormFieldColorItem>;
    invalidated: Partial<FormFieldInvalidated>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface LabelConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof LabelSize;
  }>;
  tokens: Partial<{
    invalidated: Partial<LabelInvalidated>;
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

export interface ListboxConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof ListboxColor;
    size: keyof ListboxSize;
  }>;
  tokens: Partial<{
    color: Record<string, ListboxColorItem>;
    invalidated: Partial<ListboxInvalidated>;
    size: Record<string, ListboxSizeItem>;
  }>;
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
}

export interface OtpFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof OtpFieldColor;
    length: number;
    rounded: keyof OtpFieldRounded;
    size: keyof OtpFieldSize;
    type: "numeric" | "alphanumeric";
    variant: keyof OtpFieldVariant;
  }>;
  tokens: Partial<{
    color: Record<string, OtpFieldColorItem>;
    invalidated: Partial<OtpFieldInvalidated>;
    rounded: Record<string, OtpFieldRoundedItem>;
    size: Record<string, OtpFieldSizeItem>;
    variant: Record<string, OtpFieldVariantItem>;
  }>;
}

export interface PasswordFieldConfigBase {
  classes: object;
}

export interface RadioConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof RadioColor;
    rounded: keyof RadioRounded;
    size: keyof RadioSize;
  }>;
  tokens: Partial<{
    color: Record<string, RadioColorItem>;
    invalidated: Partial<RadioInvalidated>;
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
}

export interface SelectConfigBase {
  classes: object;
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

export interface SwitchConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof SwitchColor;
    rounded: keyof SwitchRounded;
    size: keyof SwitchSize;
  }>;
  tokens: Partial<{
    color: Record<string, SwitchColorItem>;
    invalidated: Partial<SwitchInvalidated>;
    rounded: Record<string, string>;
    size: Record<string, string>;
  }>;
}

export interface TextareaConfigBase {
  classes: object;
  defaultProps: Partial<{
    autosize: boolean;
    resize: keyof TextareaResize;
  }>;
  tokens: Partial<{
    resize: Record<string, string>;
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
  Alert: Partial<Overwrite<AlertConfigBase, AlertConfigOverrides>>;
  Autocomplete: Partial<
    Overwrite<AutocompleteConfigBase, AutocompleteConfigOverrides>
  >;
  Avatar: Partial<Overwrite<AvatarConfigBase, AvatarConfigOverrides>>;
  Badge: Partial<Overwrite<BadgeConfigBase, BadgeConfigOverrides>>;
  Button: Partial<Overwrite<ButtonConfigBase, ButtonConfigOverrides>>;
  Card: Partial<Overwrite<CardConfigBase, CardConfigOverrides>>;
  Checkbox: Partial<Overwrite<CheckboxConfigBase, CheckboxConfigOverrides>>;
  Chip: Partial<Overwrite<ChipConfigBase, ChipConfigOverrides>>;
  Divider: Partial<Overwrite<DividerConfigBase, DividerConfigOverrides>>;
  Drawer: Partial<Overwrite<DrawerConfigBase, DrawerConfigOverrides>>;
  FormControl: Partial<
    Overwrite<FormControlConfigBase, FormControlConfigOverrides>
  >;
  FormField: Partial<Overwrite<FormFieldConfigBase, FormFieldConfigOverrides>>;
  Icon: Partial<Overwrite<IconConfigBase, IconConfigOverrides>>;
  Label: Partial<Overwrite<LabelConfigBase, LabelConfigOverrides>>;
  Link: Partial<Overwrite<LinkConfigBase, LinkConfigOverrides>>;
  List: Partial<Overwrite<ListConfigBase, ListConfigOverrides>>;
  Listbox: Partial<Overwrite<ListboxConfigBase, ListboxConfigOverrides>>;
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
  PasswordField: Partial<
    Overwrite<PasswordFieldConfigBase, PasswordFieldConfigOverrides>
  >;
  Progress: Partial<Overwrite<ProgressConfigBase, ProgressConfigOverrides>>;
  Radio: Partial<Overwrite<RadioConfigBase, RadioConfigOverrides>>;
  Select: Partial<Overwrite<SelectConfigBase, SelectConfigOverrides>>;
  Skeleton: Partial<Overwrite<SkeletonConfigBase, SkeletonConfigOverrides>>;
  Snackbar: Partial<Overwrite<SnackbarConfigBase, SnackbarConfigOverrides>>;
  Spinner: Partial<Overwrite<SpinnerConfigBase, SpinnerConfigOverrides>>;
  Switch: Partial<Overwrite<SwitchConfigBase, SwitchConfigOverrides>>;
  Tab: Partial<Overwrite<TabConfigBase, TabConfigOverrides>>;
  TabItem: Partial<Overwrite<TabItemConfigBase, TabItemConfigOverrides>>;
  TabList: Partial<Overwrite<TabListConfigBase, TabListConfigOverrides>>;
  TabPanel: Partial<Overwrite<TabPanelConfigBase, TabPanelConfigOverrides>>;
  Tabs: Partial<Overwrite<TabsConfigBase, TabsConfigOverrides>>;
  Textarea: Partial<Overwrite<TextareaConfigBase, TextareaConfigOverrides>>;
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
};
