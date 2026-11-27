// ** External Imports
import { createContext, useContext } from "react";

// ** Local Imports
import type { ListOwnProps } from "@/Components/List/list.types";

export type ListContextValue = {
  dense: boolean;
  size?: ListOwnProps["size"];
};

export const ListContext = createContext<null | ListContextValue>(null);

export function useListContext() {
  return useContext(ListContext);
}
