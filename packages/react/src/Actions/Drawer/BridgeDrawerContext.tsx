// ** External Imports
import { createContext } from "react";

// ** Local Imports
import type { BridgeDrawerController } from "@/Actions/Drawer/bridgeDrawer.types";

export const BridgeDrawerContext = createContext<null | BridgeDrawerController>(
  null,
);
