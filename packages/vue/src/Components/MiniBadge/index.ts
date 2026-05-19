// ** External Imports
import type { DefineComponent } from "vue";

// ** Local Imports
import type { MiniBadgeProps } from "@/Components/MiniBadge/miniBadge.types";
import MiniBadgeVue from "@/Components/MiniBadge/MiniBadge.vue";

// ** Exports
export const MiniBadge = MiniBadgeVue as DefineComponent<MiniBadgeProps>;

export { useMiniBadge } from "@/Components/MiniBadge/composables/useMiniBadge";
export type {
  MiniBadgeClasses,
  MiniBadgeColorOverrides,
  MiniBadgeOwnProps,
  MiniBadgeProps,
  MiniBadgeRoundedOverrides,
  MiniBadgeSizeOverrides,
  MiniBadgeSlots,
  MiniBadgeVariantOverrides,
} from "@/Components/MiniBadge/miniBadge.types";
