// ** External Imports
import type { ComputedRef, InjectionKey } from "vue";

export type ListSectionContextValue = {
  hidden: boolean;
};

export const LIST_SECTION_INJECTION_KEY = Symbol(
  "bridge-list-section",
) as InjectionKey<ComputedRef<ListSectionContextValue>>;
