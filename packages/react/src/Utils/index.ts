// ** Local Imports
import type { BridgeUIComponentsConfig } from "@/Config/types";

export function mergePropsWithBridgeUIDefaults<P extends object>(
  componentName: string,
  props: P,
  components: BridgeUIComponentsConfig | null | undefined,
  libDefaults?: Partial<P>,
): P {
  const fromRegistry = components?.[componentName]?.defaultProps as
    | Partial<P>
    | undefined;

  return {
    ...(libDefaults ?? {}),
    ...(fromRegistry ?? {}),
    ...props,
  } as P;
}

export type { MergeProps, Overwrite, UnionProps } from "@/Utils/types";
