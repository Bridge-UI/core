// ** Local Imports
import type { AlertColorItem } from "@core/Components/Alert";
import type { ButtonColorItem } from "@core/Components/Button";

export type Direction = "ltr" | "rtl";

export interface BridgeUIGlobal {
  theme: string;
  locale: string;
  direction: Direction;
}

export type BridgeUIComponentsConfig = Partial<{
  Alert: Partial<{
    classes: object;
    defaultProps: Partial<{
      color: string;
      shadow: string;
      padding: string;
      rounded: string;
      variant: string;
    }>;
    customProps: Partial<{
      shadow: Record<string, string>;
      padding: Record<string, string>;
      rounded: Record<string, string>;
      variant: Record<string, Record<string, AlertColorItem>>;
    }>;
  }>;
  Button: Partial<{
    classes: object;
    defaultProps: Partial<{
      size: string;
      color: string;
      rounded: string;
      variant: string;
    }>;
    customProps: Partial<{
      size: Record<string, string>;
      rounded: Record<string, string>;
      variant: Record<string, Record<string, ButtonColorItem>>;
    }>;
  }>;
  MiniButton: Partial<{
    classes: object;
    defaultProps: Partial<{
      size: string;
      color: string;
      rounded: string;
      variant: string;
    }>;
    customProps: Partial<{
      size: Record<string, string>;
    }>;
  }>;
  Icon: Partial<{
    defaultProps: Partial<{
      size: string;
    }>;
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
