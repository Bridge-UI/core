// ** Local Imports
import { Drawer } from "@/Components/Drawer";
import type { FieldOverlayProps } from "@/Components/FieldOverlay/fieldOverlay.types";
import { useFieldOverlay } from "@/Components/FieldOverlay/hooks/useFieldOverlay";
import { Menu } from "@/Components/Menu";
import { Modal } from "@/Components/Modal";

function FieldOverlay(props: FieldOverlayProps) {
  const { children, menuProps, modalProps, drawerProps, resolvedOverlay } =
    useFieldOverlay(props);

  if (resolvedOverlay === "modal") {
    return <Modal {...modalProps}>{children}</Modal>;
  }

  if (resolvedOverlay === "drawer") {
    return <Drawer {...drawerProps}>{children}</Drawer>;
  }

  return <Menu {...menuProps}>{children}</Menu>;
}

export default FieldOverlay;
