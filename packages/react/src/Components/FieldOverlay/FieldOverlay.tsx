// ** External Imports
import { useMemo } from "react";

// ** Local Imports
import { Drawer } from "@/Components/Drawer";
import type { FieldOverlayProps } from "@/Components/FieldOverlay/fieldOverlay.types";
import {
  FieldOverlayContext,
  type FieldOverlayFooterContextValue,
} from "@/Components/FieldOverlay/FieldOverlayContext";
import { useFieldOverlay } from "@/Components/FieldOverlay/hooks/useFieldOverlay";
import { Menu } from "@/Components/Menu";
import { Modal } from "@/Components/Modal";

function FieldOverlay(props: FieldOverlayProps) {
  const { onShowChange } = props;
  const {
    children,
    menuProps,
    modalProps,
    drawerProps,
    resolvedOverlay,
    drawerScrollerBind,
  } = useFieldOverlay(props);

  const footer = useMemo((): FieldOverlayFooterContextValue => {
    return {
      apply: () => {
        onShowChange?.(false);
      },
      cancel: () => {
        onShowChange?.(false);
      },
    };
  }, [onShowChange]);

  const content =
    resolvedOverlay === "modal" ? (
      <Modal {...modalProps}>{children}</Modal>
    ) : resolvedOverlay === "drawer" ? (
      <Drawer {...drawerProps}>
        <div {...drawerScrollerBind}>{children}</div>
      </Drawer>
    ) : (
      <Menu {...menuProps}>{children}</Menu>
    );

  return (
    <FieldOverlayContext.Provider value={footer}>
      {content}
    </FieldOverlayContext.Provider>
  );
}

export default FieldOverlay;
