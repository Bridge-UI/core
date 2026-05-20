// ** External Imports
import type { DefineComponent } from "vue";

// ** Local Imports
import type { ButtonProps } from "@/Components/Button/button.types";
import ButtonVue from "@/Components/Button/Button.vue";

// ** Exports
export const Button = ButtonVue as DefineComponent<ButtonProps>;

export type {
  ButtonClasses,
  ButtonColorOverrides,
  ButtonDensityOverrides,
  ButtonOwnProps,
  ButtonPartsProps,
  ButtonProps,
  ButtonRoundedOverrides,
  ButtonSizeOverrides,
  ButtonSlots,
  ButtonVariantOverrides,
} from "@/Components/Button/button.types";
export { useButton } from "@/Components/Button/composables/useButton";
