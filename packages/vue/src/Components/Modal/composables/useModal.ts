// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { ModalProps } from "@/Components/Modal/modal.types";
import { useBridgeUIComponent } from "@/Utils";

export function useModal(props: ModalProps, libDefaults: Partial<ModalProps>) {
  const slots = useSlots();

  const { entry: bridgeModal, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Modal",
  });

  return {
    slots,
    merged,
    bridgeModal,
  };
}
