// ** External Imports
import type { ComputedRef, InjectionKey } from "vue";

export type SidebarListContextValue = {
  iconOnly: boolean;
};

export const SIDEBAR_LIST_INJECTION_KEY = Symbol(
  "bridge-sidebar-list",
) as InjectionKey<ComputedRef<SidebarListContextValue>>;
