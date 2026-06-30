// ** External Imports
import { createContext } from "react";

// ** Local Imports
import type { BridgeModalController } from "@/Actions/Modal/bridgeModal.types";

export const BridgeModalContext = createContext<null | BridgeModalController>(
  null,
);
