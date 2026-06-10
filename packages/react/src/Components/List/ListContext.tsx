// ** External Imports
import { createContext, useContext } from "react";

export type ListContextValue = {
  dense: boolean;
};

export const ListContext = createContext<ListContextValue | null>(null);

export function useListContext() {
  return useContext(ListContext);
}
