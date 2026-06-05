// ** Local Imports
import type {
  AlertColor,
  AlertColorItem,
  AlertPadding,
  AlertRounded,
  AlertShadow,
  AlertVariant,
} from "@core/Components/Alert";
import type {
  AvatarColor,
  AvatarColorItem,
  AvatarRounded,
  AvatarSize,
} from "@core/Components/Avatar";
import type {
  BadgeColor,
  BadgeColorItem,
  BadgeDensity,
  BadgeRounded,
  BadgeSize,
  BadgeVariant,
} from "@core/Components/Badge";
import type {
  ButtonColor,
  ButtonColorItem,
  ButtonDensity,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
} from "@core/Components/Button";
import type {
  CardPadding,
  CardPaddingItem,
  CardRounded,
  CardRoundedItem,
  CardShadow,
  CardVariant,
  CardVariantItem,
} from "@core/Components/Card";
import type {
  CheckboxColor,
  CheckboxColorItem,
  CheckboxRounded,
  CheckboxSize,
} from "@core/Components/Checkbox";
import type {
  FormFieldColor,
  FormFieldColorItem,
  FormFieldRounded,
  FormFieldRoundedItem,
  FormFieldSize,
  FormFieldSizeItem,
  FormFieldVariant,
  FormFieldVariantItem,
} from "@core/Components/FormField";
import type { IconSize } from "@core/Components/Icon";
import type { LabelSize } from "@core/Components/Label";
import type {
  LinkColor,
  LinkColorItem,
  LinkSize,
  LinkUnderline,
} from "@core/Components/Link";
import type { MenuRounded, MenuShadow } from "@core/Components/Menu";
import type {
  ModalAlign,
  ModalBlur,
  ModalSize,
  ModalTransition,
  ModalTransitionLayer,
} from "@core/Components/Modal";
import type {
  RadioColor,
  RadioColorItem,
  RadioRounded,
  RadioSize,
} from "@core/Components/Radio";
import type {
  SelectColor,
  SelectColorItem,
  SelectRounded,
  SelectSize,
  SelectVariant,
} from "@core/Components/Select";
import type { TextareaResize } from "@core/Components/Textarea";
import type {
  ToggleColor,
  ToggleColorItem,
  ToggleRounded,
  ToggleSize,
} from "@core/Components/Toggle";
import type { Overwrite } from "@core/Utils/types";

export type Direction = "ltr" | "rtl";

export interface BridgeUIGlobal {
  theme: string;
  locale: string;
  direction: Direction;
}

export interface AlertConfigOverrides {}
export interface AvatarConfigOverrides {}
export interface BadgeConfigOverrides {}
export interface ButtonConfigOverrides {}
export interface CardConfigOverrides {}
export interface CheckboxConfigOverrides {}
export interface IconConfigOverrides {}
export interface FormFieldConfigOverrides {}
export interface LabelConfigOverrides {}
export interface LinkConfigOverrides {}
export interface MenuConfigOverrides {}
export interface ModalConfigOverrides {}
export interface RadioConfigOverrides {}
export interface SelectConfigOverrides {}
export interface NumberFieldConfigOverrides {}
export interface PasswordFieldConfigOverrides {}
export interface SwitcherConfigOverrides {}
export interface TextareaConfigOverrides {}
export interface ToggleConfigOverrides {}

export interface AlertConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof AlertColor;
    shadow: keyof AlertShadow;
    padding: keyof AlertPadding;
    rounded: keyof AlertRounded;
    variant: keyof AlertVariant;
  }>;
  customProps: Partial<{
    shadow: Record<string, string>;
    padding: Record<string, string>;
    rounded: Record<string, string>;
    variant: Record<string, Record<string, AlertColorItem>>;
  }>;
}

export interface AvatarConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof AvatarSize;
    color: keyof AvatarColor;
    rounded: keyof AvatarRounded;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
    rounded: Record<string, string>;
    color: Record<string, AvatarColorItem>;
  }>;
}

export interface BadgeConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof BadgeSize;
    color: keyof BadgeColor;
    density: keyof BadgeDensity;
    rounded: keyof BadgeRounded;
    variant: keyof BadgeVariant;
  }>;
  customProps: Partial<{
    rounded: Record<string, string>;
    density: Record<string, Record<string, string>>;
    variant: Record<string, Record<string, BadgeColorItem>>;
  }>;
}

export interface ButtonConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof ButtonSize;
    color: keyof ButtonColor;
    density: keyof ButtonDensity;
    rounded: keyof ButtonRounded;
    variant: keyof ButtonVariant;
  }>;
  customProps: Partial<{
    rounded: Record<string, string>;
    density: Record<string, Record<string, string>>;
    variant: Record<string, Record<string, ButtonColorItem>>;
  }>;
}

export interface CardConfigBase {
  classes: object;
  defaultProps: Partial<{
    shadow: keyof CardShadow;
    padding: keyof CardPadding;
    rounded: keyof CardRounded;
    variant: keyof CardVariant;
  }>;
  customProps: Partial<{
    shadow: Record<string, string>;
    padding: Record<string, CardPaddingItem>;
    rounded: Record<string, CardRoundedItem>;
    variant: Record<string, CardVariantItem>;
  }>;
}

export interface CheckboxConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof CheckboxSize;
    color: keyof CheckboxColor;
    rounded: keyof CheckboxRounded;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
    rounded: Record<string, string>;
    color: Record<string, CheckboxColorItem>;
  }>;
}

export interface IconConfigBase {
  defaultProps: Partial<{
    size: keyof IconSize;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
  }>;
}

export interface FormFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    withErrorIcon: boolean;
    size: keyof FormFieldSize;
    color: keyof FormFieldColor;
    rounded: keyof FormFieldRounded;
    variant: keyof FormFieldVariant;
  }>;
  customProps: Partial<{
    size: Record<string, FormFieldSizeItem>;
    color: Record<string, FormFieldColorItem>;
    rounded: Record<string, FormFieldRoundedItem>;
    variant: Record<string, FormFieldVariantItem>;
  }>;
}

export interface LabelConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof LabelSize;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
  }>;
}

export interface LinkConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof LinkSize;
    color: keyof LinkColor;
    underline: keyof LinkUnderline;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
    underline: Record<string, string>;
    color: Record<string, LinkColorItem>;
  }>;
}

export interface MenuConfigBase {
  classes: object;
  defaultProps: Partial<{
    shadow: keyof MenuShadow;
    rounded: keyof MenuRounded;
  }>;
  customProps: Partial<{
    shadow: Record<string, string>;
    rounded: Record<string, string>;
  }>;
}

export interface ModalConfigBase {
  classes: object;
  defaultProps: Partial<{
    blur: keyof ModalBlur;
    size: keyof ModalSize;
    align: keyof ModalAlign;
    teleportTo: string | false;
    transition: keyof ModalTransition;
  }>;
  customProps: Partial<{
    blur: Record<string, string>;
    size: Record<string, string>;
    align: Record<string, string>;
    transition: Partial<Record<string, Partial<ModalTransitionLayer>>>;
  }>;
}

export interface RadioConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof RadioSize;
    color: keyof RadioColor;
    rounded: keyof RadioRounded;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
    rounded: Record<string, string>;
    color: Record<string, RadioColorItem>;
  }>;
}

export interface SelectConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof SelectSize;
    color: keyof SelectColor;
    rounded: keyof SelectRounded;
    variant: keyof SelectVariant;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
    rounded: Record<string, string>;
    variant: Record<string, Record<string, SelectColorItem>>;
  }>;
}

export interface NumberFieldConfigBase {
  classes: object;
}

export interface PasswordFieldConfigBase {
  classes: object;
}

export interface SwitcherConfigBase {
  classes: object;
  defaultProps: Partial<{
    errorless: boolean;
    size: keyof LabelSize;
    withoutErrorMessage: boolean;
    withValidationColors: boolean;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
  }>;
}

export interface TextareaConfigBase {
  classes: object;
  defaultProps: Partial<{
    autosize: boolean;
    resize: keyof TextareaResize;
  }>;
  customProps: Partial<{
    resize: Record<string, string>;
  }>;
}

export interface ToggleConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof ToggleSize;
    color: keyof ToggleColor;
    rounded: keyof ToggleRounded;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
    rounded: Record<string, string>;
    color: Record<string, ToggleColorItem>;
  }>;
}

export type BridgeUIComponentsConfig = Partial<{
  Alert: Partial<Overwrite<AlertConfigBase, AlertConfigOverrides>>;
  Avatar: Partial<Overwrite<AvatarConfigBase, AvatarConfigOverrides>>;
  Badge: Partial<Overwrite<BadgeConfigBase, BadgeConfigOverrides>>;
  Button: Partial<Overwrite<ButtonConfigBase, ButtonConfigOverrides>>;
  Card: Partial<Overwrite<CardConfigBase, CardConfigOverrides>>;
  Checkbox: Partial<Overwrite<CheckboxConfigBase, CheckboxConfigOverrides>>;
  FormField: Partial<Overwrite<FormFieldConfigBase, FormFieldConfigOverrides>>;
  Icon: Partial<Overwrite<IconConfigBase, IconConfigOverrides>>;
  Label: Partial<Overwrite<LabelConfigBase, LabelConfigOverrides>>;
  Link: Partial<Overwrite<LinkConfigBase, LinkConfigOverrides>>;
  Menu: Partial<Overwrite<MenuConfigBase, MenuConfigOverrides>>;
  Modal: Partial<Overwrite<ModalConfigBase, ModalConfigOverrides>>;
  Radio: Partial<Overwrite<RadioConfigBase, RadioConfigOverrides>>;
  Select: Partial<Overwrite<SelectConfigBase, SelectConfigOverrides>>;
  NumberField: Partial<
    Overwrite<NumberFieldConfigBase, NumberFieldConfigOverrides>
  >;
  PasswordField: Partial<
    Overwrite<PasswordFieldConfigBase, PasswordFieldConfigOverrides>
  >;
  Switcher: Partial<Overwrite<SwitcherConfigBase, SwitcherConfigOverrides>>;
  Textarea: Partial<Overwrite<TextareaConfigBase, TextareaConfigOverrides>>;
  Toggle: Partial<Overwrite<ToggleConfigBase, ToggleConfigOverrides>>;
}>;

export interface BridgeUIOptions {
  global?: Partial<BridgeUIGlobal>;
  components?: BridgeUIComponentsConfig;
}

export const BRIDGE_UI_DEFAULT_GLOBAL: BridgeUIGlobal = {
  theme: "light",
  locale: "en-US",
  direction: "ltr",
};
