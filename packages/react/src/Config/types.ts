export type Direction = "ltr" | "rtl";

export interface BridgeUIGlobal {
  theme: string;
  locale: string;
  direction: Direction;
}

export interface BridgeUIComponentOverride {
  defaultProps?: Record<string, unknown>;
  customProps?: Record<string, Record<string, unknown>>;
}

export type BridgeUIComponentsConfig = Record<
  string,
  BridgeUIComponentOverride
>;

export interface BridgeUIOptions {
  global?: Partial<BridgeUIGlobal>;
  components?: BridgeUIComponentsConfig;
}

export const BRIDGE_UI_DEFAULT_GLOBAL: BridgeUIGlobal = {
  theme: "light",
  locale: "en-US",
  direction: "ltr",
};
