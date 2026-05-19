// ** External Imports
import type { DefineComponent } from "vue";

// ** Local Imports
import type { BadgeProps } from "@/Components/Badge/badge.types";
import BadgeVue from "@/Components/Badge/Badge.vue";

// ** Exports
export const Badge = BadgeVue as DefineComponent<BadgeProps>;

export type {
  BadgeClasses,
  BadgeColorOverrides,
  BadgeOwnProps,
  BadgeProps,
  BadgeRoundedOverrides,
  BadgeSizeOverrides,
  BadgeSlots,
  BadgeVariantOverrides,
} from "@/Components/Badge/badge.types";
export { useBadge } from "@/Components/Badge/composables/useBadge";
