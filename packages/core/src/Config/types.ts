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
  CardRounded,
  CardShadow,
} from "@core/Components/Card";
import type {
  CheckboxColor,
  CheckboxColorItem,
  CheckboxRounded,
  CheckboxSize,
} from "@core/Components/Checkbox";
import type { IconSize } from "@core/Components/Icon";
import type {
  LinkColor,
  LinkColorItem,
  LinkSize,
  LinkUnderline,
} from "@core/Components/Link";
import type { MenuRounded, MenuShadow } from "@core/Components/Menu";
import type {
  ModalRounded,
  ModalShadow,
  ModalSize,
} from "@core/Components/Modal";
import type {
  RadioColor,
  RadioColorItem,
  RadioSize,
} from "@core/Components/Radio";
import type {
  SelectColor,
  SelectColorItem,
  SelectRounded,
  SelectSize,
  SelectVariant,
} from "@core/Components/Select";
import type {
  TextareaColor,
  TextareaColorItem,
  TextareaRounded,
  TextareaSize,
  TextareaVariant,
} from "@core/Components/Textarea";
import type {
  TextFieldColor,
  TextFieldColorItem,
  TextFieldRounded,
  TextFieldSize,
  TextFieldVariant,
} from "@core/Components/TextField";
import type {
  ToggleColor,
  ToggleColorItem,
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
export interface LinkConfigOverrides {}
export interface MenuConfigOverrides {}
export interface ModalConfigOverrides {}
export interface RadioConfigOverrides {}
export interface SelectConfigOverrides {}
export interface TextareaConfigOverrides {}
export interface TextFieldConfigOverrides {}
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
    density: Record<string, Record<string, string>>;
    rounded: Record<string, string>;
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
    density: Record<string, Record<string, string>>;
    rounded: Record<string, string>;
    variant: Record<string, Record<string, ButtonColorItem>>;
  }>;
}

export interface CardConfigBase {
  classes: object;
  defaultProps: Partial<{
    rounded: keyof CardRounded;
    shadow: keyof CardShadow;
    padding: keyof CardPadding;
  }>;
  customProps: Partial<{
    rounded: Record<string, string>;
    shadow: Record<string, string>;
    padding: Record<string, string>;
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

export interface LinkConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof LinkSize;
    color: keyof LinkColor;
    underline: keyof LinkUnderline;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
    color: Record<string, LinkColorItem>;
    underline: Record<string, string>;
  }>;
}

export interface MenuConfigBase {
  classes: object;
  defaultProps: Partial<{
    rounded: keyof MenuRounded;
    shadow: keyof MenuShadow;
  }>;
  customProps: Partial<{
    rounded: Record<string, string>;
    shadow: Record<string, string>;
  }>;
}

export interface ModalConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof ModalSize;
    rounded: keyof ModalRounded;
    shadow: keyof ModalShadow;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
    rounded: Record<string, string>;
    shadow: Record<string, string>;
  }>;
}

export interface RadioConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof RadioSize;
    color: keyof RadioColor;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
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

export interface TextareaConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof TextareaSize;
    color: keyof TextareaColor;
    rounded: keyof TextareaRounded;
    variant: keyof TextareaVariant;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
    rounded: Record<string, string>;
    variant: Record<string, Record<string, TextareaColorItem>>;
  }>;
}

export interface TextFieldConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof TextFieldSize;
    color: keyof TextFieldColor;
    rounded: keyof TextFieldRounded;
    variant: keyof TextFieldVariant;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
    rounded: Record<string, string>;
    variant: Record<string, Record<string, TextFieldColorItem>>;
  }>;
}

export interface ToggleConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof ToggleSize;
    color: keyof ToggleColor;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
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
  Icon: Partial<Overwrite<IconConfigBase, IconConfigOverrides>>;
  Link: Partial<Overwrite<LinkConfigBase, LinkConfigOverrides>>;
  Menu: Partial<Overwrite<MenuConfigBase, MenuConfigOverrides>>;
  Modal: Partial<Overwrite<ModalConfigBase, ModalConfigOverrides>>;
  Radio: Partial<Overwrite<RadioConfigBase, RadioConfigOverrides>>;
  Select: Partial<Overwrite<SelectConfigBase, SelectConfigOverrides>>;
  Textarea: Partial<Overwrite<TextareaConfigBase, TextareaConfigOverrides>>;
  TextField: Partial<Overwrite<TextFieldConfigBase, TextFieldConfigOverrides>>;
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
