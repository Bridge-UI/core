// ** External Imports
import { createContext, useContext } from "react";

export type ListSectionContextValue = {
  hidden: boolean;
};

export const ListSectionContext = createContext<null | ListSectionContextValue>(
  null,
);

/**
 * Visibility from the nearest list that owns sections.
 */
export function useListSectionContext() {
  return useContext(ListSectionContext);
}
