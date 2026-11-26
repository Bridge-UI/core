// ** External Imports
import type { ComputedRef, InjectionKey } from "vue";

// ** Local Imports
import type { ListOwnProps } from "@/Components/List/list.types";

export type ListContextValue = {
  dense: boolean;
  size?: ListOwnProps["size"];
};

export const LIST_INJECTION_KEY = Symbol("bridge-list") as InjectionKey<
  ComputedRef<ListContextValue>
>;
