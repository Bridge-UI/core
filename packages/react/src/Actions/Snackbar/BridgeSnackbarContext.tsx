// ** External Imports
import { createContext } from "react";

// ** Local Imports
import type { BridgeSnackbarController } from "@/Actions/Snackbar/bridgeSnackbar.types";

export const BridgeSnackbarContext =
  createContext<null | BridgeSnackbarController>(null);
