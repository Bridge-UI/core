// ** Local Imports
import { AlertClasses, AlertProps } from "@/Components/Alert/alert.types";
import { AlertColorItem } from "@/Components/Alert/props";
import { ButtonClasses, ButtonProps } from "@/Components/Button/button.types";
import { ButtonColorItem } from "@/Components/Button/props";
import type { IconProps } from "@/Components/Icon/icon.types";
import {
  MiniButtonClasses,
  MiniButtonProps,
} from "@/Components/MiniButton/miniButton.types";

export type Direction = "ltr" | "rtl";

export interface BridgeUIGlobal {
  theme: string;
  locale: string;
  direction: Direction;
}

export type BridgeUIComponentsConfig = Partial<{
  Alert: Partial<{
    classes: Partial<AlertClasses>;
    defaultProps: Partial<
      Pick<AlertProps, "color" | "shadow" | "padding" | "rounded" | "variant">
    >;
    customProps: Partial<{
      shadow: Record<string, string>;
      padding: Record<string, string>;
      rounded: Record<string, string>;
      variant: Record<string, Record<string, AlertColorItem>>;
    }>;
  }>;
  Button: Partial<{
    classes: Partial<ButtonClasses>;
    defaultProps: Partial<
      Pick<ButtonProps, "size" | "color" | "rounded" | "variant">
    >;
    customProps: Partial<{
      size: Record<string, string>;
      rounded: Record<string, string>;
      variant: Record<string, Record<string, ButtonColorItem>>;
    }>;
  }>;
  MiniButton: Partial<{
    classes: Partial<MiniButtonClasses>;
    defaultProps: Partial<
      Pick<MiniButtonProps, "size" | "color" | "rounded" | "variant">
    >;
    customProps: Partial<{
      size: Record<string, string>;
    }>;
  }>;
  Icon: Partial<{
    defaultProps: Partial<Pick<IconProps, "size">>;
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
