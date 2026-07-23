// ** Local Imports
import type {
  AlertColor,
  AlertColorItem,
  AlertPadding,
  AlertRounded,
  AlertShadow,
  AlertVariant,
} from "@/Components/Alert";
import type {
  AvatarColor,
  AvatarColorItem,
  AvatarIconSizeItem,
  AvatarRounded,
  AvatarSize,
} from "@/Components/Avatar";
import type {
  BadgeColor,
  BadgeColorItem,
  BadgeDensity,
  BadgeRounded,
  BadgeSize,
  BadgeVariant,
} from "@/Components/Badge";
import type {
  ButtonColor,
  ButtonColorItem,
  ButtonDensity,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
} from "@/Components/Button";
import type {
  CardPadding,
  CardPaddingItem,
  CardRounded,
  CardRoundedItem,
  CardShadow,
  CardVariant,
  CardVariantItem,
} from "@/Components/Card";
import type {
  CheckboxColor,
  CheckboxColorItem,
  CheckboxInvalidated,
  CheckboxRounded,
  CheckboxSize,
} from "@/Components/Checkbox";
import type { ChipSize, ChipSizeItem } from "@/Components/Chip";
import type { DividerColor, DividerOrientation } from "@/Components/Divider";
import type { FormControlInvalidated } from "@/Components/FormControl";
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
} from "@/Components/FormField";
import type { IconSize } from "@/Components/Icon";
import type { LabelInvalidated, LabelSize } from "@/Components/Label";
import type {
  LinkColor,
  LinkColorItem,
  LinkSize,
  LinkUnderline,
} from "@/Components/Link";
import type { ListPadding } from "@/Components/List";
import type {
  ListboxColor,
  ListboxColorItem,
  ListboxInvalidated,
  ListboxSize,
  ListboxSizeItem,
} from "@/Components/Listbox";
import type { ListItemAlign } from "@/Components/ListItem";
import type { MenuRounded, MenuShadow } from "@/Components/Menu";
import type {
  ModalAlign,
  ModalBlur,
  ModalSize,
  ModalTransition,
  ModalTransitionLayer,
} from "@/Components/Modal";
import type {
  RadioColor,
  RadioColorItem,
  RadioInvalidated,
  RadioRounded,
  RadioSize,
} from "@/Components/Radio";
import type { SkeletonRounded } from "@/Components/Skeleton";
import type {
  SnackbarColor,
  SnackbarColorItem,
  SnackbarPadding,
  SnackbarPaddingItem,
  SnackbarPosition,
  SnackbarRounded,
  SnackbarRoundedItem,
  SnackbarTransition,
} from "@/Components/Snackbar";
import type {
  SwitchColor,
  SwitchColorItem,
  SwitchInvalidated,
  SwitchRounded,
  SwitchSize,
} from "@/Components/Switch";
import type { TextareaResize } from "@/Components/Textarea";
import type { Overwrite } from "@/Utils/types";

export type Direction = "ltr" | "rtl";

export interface BridgeUIGlobal {
  direction: Direction;
  locale: string;
  theme: string;
}

export interface AlertConfigOverrides {}
export interface AvatarConfigOverrides {}
export interface BadgeConfigOverrides {}
export interface ButtonConfigOverrides {}
export interface CardConfigOverrides {}
export interface CheckboxConfigOverrides {}
export interface ChipConfigOverrides {}
export interface DividerConfigOverrides {}
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
export interface PasswordFieldConfigOverrides {}
export interface RadioConfigOverrides {}
export interface SelectConfigOverrides {}
export interface SkeletonConfigOverrides {}
export interface SnackbarConfigOverrides {}
export interface FormControlConfigOverrides {}
export interface TextareaConfigOverrides {}
export interface SwitchConfigOverrides {}

export interface AlertConfigBase {
  classes: object;
  customProps: Partial<{
    padding: Record<string, string>;
    rounded: Record<string, string>;
    shadow: Record<string, string>;
    variant: Record<string, Record<string, AlertColorItem>>;
  }>;
  defaultProps: Partial<{
    color: keyof AlertColor;
    padding: keyof AlertPadding;
    rounded: keyof AlertRounded;
    shadow: keyof AlertShadow;
    variant: keyof AlertVariant;
  }>;
}

export interface AvatarConfigBase {
  classes: object;
  customProps: Partial<{
    color: Record<string, AvatarColorItem>;
    iconSize: Record<string, AvatarIconSizeItem>;
    rounded: Record<string, string>;
    size: Record<string, string>;
  }>;
  defaultProps: Partial<{
    color: keyof AvatarColor;
    rounded: keyof AvatarRounded;
    size: keyof AvatarSize;
  }>;
}

export interface BadgeConfigBase {
  classes: object;
  customProps: Partial<{
    density: Record<string, Record<string, string>>;
    rounded: Record<string, string>;
    variant: Record<string, Record<string, BadgeColorItem>>;
  }>;
  defaultProps: Partial<{
    color: keyof BadgeColor;
    density: keyof BadgeDensity;
    rounded: keyof BadgeRounded;
    size: keyof BadgeSize;
    variant: keyof BadgeVariant;
  }>;
}

export interface ButtonConfigBase {
  classes: object;
  customProps: Partial<{
    density: Record<string, Record<string, string>>;
    rounded: Record<string, string>;
    variant: Record<string, Record<string, ButtonColorItem>>;
  }>;
  defaultProps: Partial<{
    color: keyof ButtonColor;
    density: keyof ButtonDensity;
    rounded: keyof ButtonRounded;
    size: keyof ButtonSize;
    variant: keyof ButtonVariant;
  }>;
}

export interface CardConfigBase {
  classes: object;
  customProps: Partial<{
    padding: Record<string, CardPaddingItem>;
    rounded: Record<string, CardRoundedItem>;
    shadow: Record<string, string>;
    variant: Record<string, CardVariantItem>;
  }>;
  defaultProps: Partial<{
    padding: keyof CardPadding;
    rounded: keyof CardRounded;
    shadow: keyof CardShadow;
    variant: keyof CardVariant;
  }>;
}

export interface CheckboxConfigBase {
  classes: object;
  customProps: Partial<{
    color: Record<string, CheckboxColorItem>;
    invalidated: Partial<CheckboxInvalidated>;
    rounded: Record<string, string>;
    size: Record<string, string>;
  }>;
  defaultProps: Partial<{
    color: keyof CheckboxColor;
    rounded: keyof CheckboxRounded;
    size: keyof CheckboxSize;
  }>;
}

export interface ChipConfigBase {
  classes: object;
  customProps: Partial<{
    size: Record<string, ChipSizeItem>;
  }>;
  defaultProps: Partial<{
    size: keyof ChipSize;
  }>;
}

export interface IconConfigBase {
  customProps: Partial<{
    size: Record<string, string>;
  }>;
  defaultProps: Partial<{
    size: keyof IconSize;
  }>;
}

export interface FormControlConfigBase {
  classes: object;
  customProps: Partial<{
    invalidated: Partial<FormControlInvalidated>;
    size: Record<string, string>;
  }>;
  defaultProps: Partial<{
    errorless: boolean;
    size: keyof LabelSize;
    withoutErrorMessage: boolean;
    withValidationColors: boolean;
  }>;
}

export interface FormFieldConfigBase {
  classes: object;
  customProps: Partial<{
    color: Record<string, FormFieldColorItem>;
    invalidated: Partial<FormFieldInvalidated>;
    rounded: Record<string, FormFieldRoundedItem>;
    size: Record<string, FormFieldSizeItem>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
  defaultProps: Partial<{
    color: keyof FormFieldColor;
    rounded: keyof FormFieldRounded;
    size: keyof FormFieldSize;
    variant: keyof FormFieldVariant;
    withErrorIcon: boolean;
  }>;
}

export interface LabelConfigBase {
  classes: object;
  customProps: Partial<{
    invalidated: Partial<LabelInvalidated>;
    size: Record<string, string>;
  }>;
  defaultProps: Partial<{
    size: keyof LabelSize;
  }>;
}

export interface LinkConfigBase {
  classes: object;
  customProps: Partial<{
    color: Record<string, LinkColorItem>;
    size: Record<string, string>;
    underline: Record<string, string>;
  }>;
  defaultProps: Partial<{
    color: keyof LinkColor;
    size: keyof LinkSize;
    underline: keyof LinkUnderline;
  }>;
}

export interface ListConfigBase {
  classes: object;
  customProps: Partial<{
    padding: Record<string, string>;
  }>;
  defaultProps: Partial<{
    padding: keyof ListPadding;
  }>;
}

export interface ListboxConfigBase {
  classes: object;
  customProps: Partial<{
    color: Record<string, ListboxColorItem>;
    invalidated: Partial<ListboxInvalidated>;
    size: Record<string, ListboxSizeItem>;
  }>;
  defaultProps: Partial<{
    color: keyof ListboxColor;
    size: keyof ListboxSize;
  }>;
}

export interface ListItemConfigBase {
  classes: object;
  customProps: Partial<{
    align: Record<string, string>;
  }>;
  defaultProps: Partial<{
    align: keyof ListItemAlign;
    role: "button" | "option" | "menuitem";
    selectedIcon: unknown;
  }>;
}

export interface ListSectionConfigBase {
  classes: object;
}

export interface MenuConfigBase {
  classes: object;
  customProps: Partial<{
    rounded: Record<string, string>;
    shadow: Record<string, string>;
  }>;
  defaultProps: Partial<{
    rounded: keyof MenuRounded;
    shadow: keyof MenuShadow;
  }>;
}

export interface ModalConfigBase {
  classes: object;
  customProps: Partial<{
    align: Record<string, string>;
    blur: Record<string, string>;
    size: Record<string, string>;
    transition: Partial<Record<string, Partial<ModalTransitionLayer>>>;
  }>;
  defaultProps: Partial<{
    align: keyof ModalAlign;
    blur: keyof ModalBlur;
    size: keyof ModalSize;
    teleportTo: false | string;
    transition: keyof ModalTransition;
  }>;
}

export interface NumberFieldConfigBase {
  classes: object;
}

export interface PasswordFieldConfigBase {
  classes: object;
}

export interface RadioConfigBase {
  classes: object;
  customProps: Partial<{
    color: Record<string, RadioColorItem>;
    invalidated: Partial<RadioInvalidated>;
    rounded: Record<string, string>;
    size: Record<string, string>;
  }>;
  defaultProps: Partial<{
    color: keyof RadioColor;
    rounded: keyof RadioRounded;
    size: keyof RadioSize;
  }>;
}

export interface SnackbarConfigBase {
  classes: object;
  customProps: Partial<{
    color: Record<string, SnackbarColorItem>;
    padding: Record<string, SnackbarPaddingItem>;
    position: Record<string, string>;
    rounded: Record<string, SnackbarRoundedItem>;
    transition: Record<string, string>;
  }>;
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
}

export interface SelectConfigBase {
  classes: object;
}

export interface DividerConfigBase {
  classes: object;
  customProps: Partial<{
    color: Record<string, string>;
    orientation: Record<string, string>;
  }>;
  defaultProps: Partial<{
    color: keyof DividerColor;
    orientation: keyof DividerOrientation;
  }>;
}

export interface SkeletonConfigBase {
  classes: object;
  customProps: Partial<{
    rounded: Record<string, string>;
  }>;
  defaultProps: Partial<{
    rounded: keyof SkeletonRounded;
  }>;
}

export interface SwitchConfigBase {
  classes: object;
  customProps: Partial<{
    color: Record<string, SwitchColorItem>;
    invalidated: Partial<SwitchInvalidated>;
    rounded: Record<string, string>;
    size: Record<string, string>;
  }>;
  defaultProps: Partial<{
    color: keyof SwitchColor;
    rounded: keyof SwitchRounded;
    size: keyof SwitchSize;
  }>;
}

export interface TextareaConfigBase {
  classes: object;
  customProps: Partial<{
    resize: Record<string, string>;
  }>;
  defaultProps: Partial<{
    autosize: boolean;
    resize: keyof TextareaResize;
  }>;
}

export type BridgeUIComponentsConfig = Partial<{
  Alert: Partial<Overwrite<AlertConfigBase, AlertConfigOverrides>>;
  Avatar: Partial<Overwrite<AvatarConfigBase, AvatarConfigOverrides>>;
  Badge: Partial<Overwrite<BadgeConfigBase, BadgeConfigOverrides>>;
  Button: Partial<Overwrite<ButtonConfigBase, ButtonConfigOverrides>>;
  Card: Partial<Overwrite<CardConfigBase, CardConfigOverrides>>;
  Checkbox: Partial<Overwrite<CheckboxConfigBase, CheckboxConfigOverrides>>;
  Chip: Partial<Overwrite<ChipConfigBase, ChipConfigOverrides>>;
  Divider: Partial<Overwrite<DividerConfigBase, DividerConfigOverrides>>;
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
  PasswordField: Partial<
    Overwrite<PasswordFieldConfigBase, PasswordFieldConfigOverrides>
  >;
  Radio: Partial<Overwrite<RadioConfigBase, RadioConfigOverrides>>;
  Select: Partial<Overwrite<SelectConfigBase, SelectConfigOverrides>>;
  Skeleton: Partial<Overwrite<SkeletonConfigBase, SkeletonConfigOverrides>>;
  Snackbar: Partial<Overwrite<SnackbarConfigBase, SnackbarConfigOverrides>>;
  Switch: Partial<Overwrite<SwitchConfigBase, SwitchConfigOverrides>>;
  Textarea: Partial<Overwrite<TextareaConfigBase, TextareaConfigOverrides>>;
}>;

export interface BridgeUIOptions {
  components?: BridgeUIComponentsConfig;
  global?: Partial<BridgeUIGlobal>;
}

export const BRIDGE_UI_DEFAULT_GLOBAL: BridgeUIGlobal = {
  theme: "light",
  locale: "en-US",
  direction: "ltr",
};
