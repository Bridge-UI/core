// ** External Imports
import { toMerged } from "es-toolkit/object";
import { useCallback, useContext, useMemo, useState } from "react";

// ** Core Imports
import {
  BRIDGE_UI_DEFAULT_GLOBAL,
  mergeBridgeUIComponents,
  mergeBridgeUIGlobal,
  type BridgeUIComponentsConfig,
  type BridgeUIGlobal,
  type Direction,
} from "@bridge-ui/core/Config";

// ** Local Imports
import {
  BridgeUIContext,
  type BridgeUIContextValue,
  type BridgeUIProviderProps,
} from "@/Provider/BridgeUIContext";

function useBridgeUIContextValue(
  parent: null | BridgeUIContextValue,
  globalProp: BridgeUIProviderProps["global"],
  componentsProp: BridgeUIProviderProps["components"],
): BridgeUIContextValue {
  const [globalPatch, setGlobalPatch] = useState<Partial<BridgeUIGlobal>>({});

  const [componentsPatch, setComponentsPatch] =
    useState<BridgeUIComponentsConfig>({});

  const baseGlobal = useMemo(() => {
    return mergeBridgeUIGlobal({
      partials: [globalProp],
      base: parent?.global ?? BRIDGE_UI_DEFAULT_GLOBAL,
    });
  }, [parent, globalProp]);

  const global = useMemo(() => {
    return mergeBridgeUIGlobal({
      base: baseGlobal,
      partials: [globalPatch],
    });
  }, [baseGlobal, globalPatch]);

  const baseComponents = useMemo(() => {
    return mergeBridgeUIComponents({
      partials: [componentsProp],
      base: parent?.components ?? {},
    });
  }, [parent, componentsProp]);

  const components = useMemo(() => {
    return mergeBridgeUIComponents({
      base: baseComponents,
      partials: [componentsPatch],
    });
  }, [baseComponents, componentsPatch]);

  const setGlobal = useCallback((patch: Partial<BridgeUIGlobal>) => {
    setGlobalPatch((prev) => {
      const { icons, ...rest } = patch;
      const next = toMerged(prev, rest) as Partial<BridgeUIGlobal>;

      if (icons !== undefined) {
        next.icons = icons;
      }

      return next;
    });
  }, []);

  const setTheme = useCallback(
    (theme: string) => {
      setGlobal({ theme });
    },
    [setGlobal],
  );

  const setLocale = useCallback(
    (locale: string) => {
      setGlobal({ locale });
      global.i18n?.setLocale?.(locale);
    },
    [setGlobal, global.i18n],
  );

  const setDirection = useCallback(
    (direction: Direction) => {
      setGlobal({ direction });
    },
    [setGlobal],
  );

  const setComponents = useCallback((patch: BridgeUIComponentsConfig) => {
    setComponentsPatch((prev) => {
      return mergeBridgeUIComponents({
        base: prev,
        partials: [patch],
      });
    });
  }, []);

  return useMemo(() => {
    return {
      global,
      setTheme,
      setGlobal,
      setLocale,
      components,
      setDirection,
      setComponents,
    };
  }, [
    global,
    setTheme,
    setGlobal,
    setLocale,
    components,
    setDirection,
    setComponents,
  ]);
}

export function BridgeUIProvider({
  global,
  children,
  components,
}: BridgeUIProviderProps) {
  const parent = useContext(BridgeUIContext);

  const value = useBridgeUIContextValue(parent, global, components);

  return (
    <BridgeUIContext.Provider value={value}>
      {children}
    </BridgeUIContext.Provider>
  );
}
