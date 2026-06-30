// ** External Imports
import { createContext } from "react";

// ** Local Imports
import type { BridgeDialogController } from "@/Actions/Dialog/bridgeDialog.types";

export const BridgeDialogContext = createContext<null | BridgeDialogController>(
  null,
);
