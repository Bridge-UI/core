// ** Local Imports
import {
  AlertClasses,
  AlertProps,
  AlertSlots,
} from "@/Components/Alert/alert.types";
import type { AlertColorItem } from "@/Components/Alert/props";
import {
  ButtonClasses,
  ButtonProps,
  ButtonSlots,
} from "@/Components/Button/button.types";
import { ButtonColorItem } from "@/Components/Button/props";
import type { IconProps } from "@/Components/Icon/icon.types";
import {
  MiniButtonClasses,
  MiniButtonProps,
  MiniButtonSlots,
} from "@/Components/MiniButton/miniButton.types";

export type Direction = "ltr" | "rtl";

export interface BridgeUIGlobal {
  theme: string;
  locale: string;
  direction: Direction;
}

export type BridgeUIComponentsConfig = Partial<{
  Alert: Partial<{
    slots: Partial<AlertSlots>;
    classes: Partial<AlertClasses>;
    defaultProps: Partial<AlertProps>;
    customProps: Partial<{
      shadow: Record<string, string>;
      padding: Record<string, string>;
      rounded: Record<string, string>;
      variant: Record<string, Record<string, AlertColorItem>>;
    }>;
  }>;
  Button: Partial<{
    slots: Partial<ButtonSlots>;
    classes: Partial<ButtonClasses>;
    defaultProps: Partial<ButtonProps>;
    customProps: Partial<{
      size: Record<string, string>;
      rounded: Record<string, string>;
      variant: Record<string, Record<string, ButtonColorItem>>;
    }>;
  }>;
  MiniButton: Partial<{
    slots: Partial<MiniButtonSlots>;
    classes: Partial<MiniButtonClasses>;
    defaultProps: Partial<MiniButtonProps>;
    customProps: Partial<{
      size: Record<string, string>;
    }>;
  }>;
  Icon: Partial<{
    defaultProps: Partial<IconProps>;
    customProps: Partial<{
      size: Record<string, string>;
    }>;
  }>;
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
