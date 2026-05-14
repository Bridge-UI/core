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
  ButtonColor,
  ButtonColorItem,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
} from "@core/Components/Button";
import type { IconSize } from "@core/Components/Icon";
import type { MiniButtonSize } from "@core/Components/MiniButton";
import type { Overwrite } from "@core/Utils/types";

export type Direction = "ltr" | "rtl";

export interface BridgeUIGlobal {
  theme: string;
  locale: string;
  direction: Direction;
}

export interface AlertConfigOverrides {}
export interface ButtonConfigOverrides {}
export interface IconConfigOverrides {}
export interface MiniButtonConfigOverrides {}

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

export interface ButtonConfigBase {
  classes: object;
  defaultProps: Partial<{
    size: keyof ButtonSize;
    color: keyof ButtonColor;
    rounded: keyof ButtonRounded;
    variant: keyof ButtonVariant;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
    rounded: Record<string, string>;
    variant: Record<string, Record<string, ButtonColorItem>>;
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

export interface MiniButtonConfigBase {
  classes: object;
  defaultProps: Partial<{
    color: keyof ButtonColor;
    size: keyof MiniButtonSize;
    rounded: keyof ButtonRounded;
    variant: keyof ButtonVariant;
  }>;
  customProps: Partial<{
    size: Record<string, string>;
  }>;
}

export type BridgeUIComponentsConfig = Partial<{
  Alert: Partial<Overwrite<AlertConfigBase, AlertConfigOverrides>>;
  Button: Partial<Overwrite<ButtonConfigBase, ButtonConfigOverrides>>;
  Icon: Partial<Overwrite<IconConfigBase, IconConfigOverrides>>;
  MiniButton: Partial<
    Overwrite<MiniButtonConfigBase, MiniButtonConfigOverrides>
  >;
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
