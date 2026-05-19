// ** External Imports
import type { DefineComponent } from "vue";

// ** Local Imports
import type { MiniButtonProps } from "@/Components/MiniButton/miniButton.types";
import MiniButtonVue from "@/Components/MiniButton/MiniButton.vue";

// ** Exports
export const MiniButton = MiniButtonVue as DefineComponent<MiniButtonProps>;

export { useMiniButton } from "@/Components/MiniButton/composables/useMiniButton";
export type {
  MiniButtonClasses,
  MiniButtonColorOverrides,
  MiniButtonOwnProps,
  MiniButtonPartsProps,
  MiniButtonProps,
  MiniButtonRoundedOverrides,
  MiniButtonSizeOverrides,
  MiniButtonSlots,
  MiniButtonVariantOverrides,
} from "@/Components/MiniButton/miniButton.types";
