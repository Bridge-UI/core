// ** External Imports
import type { InjectionKey } from "vue";

// ** Local Imports
import type { BridgeDrawerController } from "@/Actions/Drawer/bridgeDrawer.types";

export const BRIDGE_DRAWER_INJECTION_KEY: InjectionKey<BridgeDrawerController> =
  Symbol.for("@bridge-ui/vue/bridge-drawer");
