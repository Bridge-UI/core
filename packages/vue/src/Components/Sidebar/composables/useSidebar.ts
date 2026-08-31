// ** External Imports
import { inject } from "vue";

// ** Local Imports
import {
  SIDEBAR_INJECTION_KEY,
  type SidebarContextValue,
} from "@/Components/Sidebar/sidebarInjectionKey";

/**
 * Reads the nearest `SidebarProvider` context. Throws when used outside it.
 */
export function useSidebar() {
  const context = inject(SIDEBAR_INJECTION_KEY);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}

export type { SidebarContextValue };
