// ** External Imports
import type { ComputedRef, InjectionKey } from "vue";

export type ListContextValue = {
  dense: boolean;
  iconOnly: boolean;
};

export const LIST_INJECTION_KEY = Symbol("bridge-list") as InjectionKey<
  ComputedRef<ListContextValue>
>;
