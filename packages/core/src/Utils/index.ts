// ** Local Imports
import type { BridgeUIComponentsConfig } from "@core/Config/types";

export function mergePropsWithBridgeUIDefaults<
  K extends keyof BridgeUIComponentsConfig,
  P extends object,
>(
  componentName: K,
  props: P,
  components: BridgeUIComponentsConfig | null | undefined,
  libDefaults?: Partial<P>,
): P {
  const entry = components?.[componentName];
  const fromRegistry = entry?.defaultProps as Partial<P> | undefined;

  return {
    ...(libDefaults ?? {}),
    ...(fromRegistry ?? {}),
    ...props,
  } as P;
}

export type { MergeProps, Overwrite, UnionProps } from "@core/Utils/types";
