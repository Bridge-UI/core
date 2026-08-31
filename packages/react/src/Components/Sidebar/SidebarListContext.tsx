// ** External Imports
import { createContext, useContext } from "react";

export type SidebarListContextValue = {
  iconOnly: boolean;
};

export const SidebarListContext = createContext<null | SidebarListContextValue>(
  null,
);

/**
 * Icon-rail mode from the nearest `SidebarList`.
 */
export function useSidebarListContext() {
  return useContext(SidebarListContext);
}
