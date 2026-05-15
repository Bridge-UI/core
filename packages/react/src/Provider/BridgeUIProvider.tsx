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
} from "@bridge-ui/core";

// ** Local Imports
import {
  BridgeUIContext,
  type BridgeUIContextValue,
  type BridgeUIProviderProps,
} from "@/Provider/BridgeUIContext";

function useBridgeUIContextValue(
  parent: BridgeUIContextValue | null,
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
      return toMerged(prev, patch);
    });
  }, []);

  const setComponents = useCallback((patch: BridgeUIComponentsConfig) => {
    setComponentsPatch((prev) => {
      return mergeBridgeUIComponents({
        base: prev,
        partials: [patch],
      });
    });
  }, []);

  return useMemo(() => {
    return { global, setGlobal, components, setComponents };
  }, [global, setGlobal, components, setComponents]);
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
