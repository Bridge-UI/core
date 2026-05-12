// ** External Imports
import { toMerged } from "es-toolkit/object";
import { useCallback, useContext, useMemo, useState } from "react";

// ** Local Imports
import {
  BRIDGE_UI_DEFAULT_GLOBAL,
  mergeBridgeUIComponents,
  mergeBridgeUIGlobal,
  type BridgeUIComponentsConfig,
  type BridgeUIGlobal,
} from "@/Config";
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
    return mergeBridgeUIGlobal(
      parent?.global ?? BRIDGE_UI_DEFAULT_GLOBAL,
      globalProp,
    );
  }, [parent, globalProp]);

  const global = useMemo(() => {
    return mergeBridgeUIGlobal(baseGlobal, globalPatch);
  }, [baseGlobal, globalPatch]);

  const baseComponents = useMemo(() => {
    return mergeBridgeUIComponents(parent?.components ?? {}, componentsProp);
  }, [parent, componentsProp]);

  const components = useMemo(() => {
    return mergeBridgeUIComponents(baseComponents, componentsPatch);
  }, [baseComponents, componentsPatch]);

  const setGlobal = useCallback((patch: Partial<BridgeUIGlobal>) => {
    setGlobalPatch((prev) => toMerged(prev, patch));
  }, []);

  const setComponents = useCallback((patch: BridgeUIComponentsConfig) => {
    setComponentsPatch((prev) => mergeBridgeUIComponents(prev, patch));
  }, []);

  return useMemo(() => {
    return { global, components, setGlobal, setComponents };
  }, [components, global, setComponents, setGlobal]);
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
