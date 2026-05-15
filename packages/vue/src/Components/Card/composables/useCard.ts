// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { CardProps } from "@/Components/Card/card.types";
import { useBridgeUIComponent } from "@/Utils";

export function useCard(props: CardProps, libDefaults: Partial<CardProps>) {
  const slots = useSlots();

  const { entry: bridgeCard, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Card",
  });

  return {
    slots,
    merged,
    bridgeCard,
  };
}
