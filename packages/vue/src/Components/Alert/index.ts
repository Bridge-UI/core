// ** External Imports
import type { DefineComponent } from "vue";

// ** Local Imports
import type { AlertProps } from "@/Components/Alert/alert.types";
import AlertVue from "@/Components/Alert/Alert.vue";

// ** Exports
export const Alert = AlertVue as DefineComponent<AlertProps>;

export type {
  AlertClasses,
  AlertColorOverrides,
  AlertOwnProps,
  AlertPaddingOverrides,
  AlertPartsProps,
  AlertProps,
  AlertRoundedOverrides,
  AlertShadowOverrides,
  AlertSlots,
  AlertVariantOverrides,
} from "@/Components/Alert/alert.types";
export {
  alertLibDefaults,
  useAlert,
} from "@/Components/Alert/composables/useAlert";
