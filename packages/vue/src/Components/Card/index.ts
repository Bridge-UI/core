// ** External Imports
import type { DefineComponent } from "vue";

// ** Local Imports
import type { CardProps } from "@/Components/Card/card.types";
import CardVue from "@/Components/Card/Card.vue";

// ** Exports
export const Card = CardVue as DefineComponent<CardProps>;

export type {
  CardClasses,
  CardCustomProps,
  CardOwnProps,
  CardPaddingOverrides,
  CardProps,
  CardRoundedOverrides,
  CardShadowOverrides,
  CardSlots,
  CardVariantOverrides,
} from "@/Components/Card/card.types";
export { useCard } from "@/Components/Card/composables/useCard";
