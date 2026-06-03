// ** External Imports
import { createPortal } from "react-dom";

// ** Core Imports
import { resolveModalPortalElement } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useModal } from "@/Components/Modal/hooks/useModal";
import type { ModalProps } from "@/Components/Modal/modal.types";

const modalLibDefaults = {
  size: "md",
  blur: "none",
  align: "center",
  teleportTo: "body",
  closeOnEscape: true,
  closeOnOverlay: true,
} as const;

function ModalShell({
  children,
  rootBind,
  panelBind,
  overlayBind,
  wrapperBind,
  handleOverlayClick,
  handleWrapperClick,
}: ReturnType<typeof useModal> & { children: ModalProps["children"] }) {
  return (
    <div {...rootBind}>
      <div {...overlayBind} aria-hidden="true" onClick={handleOverlayClick} />

      <div {...wrapperBind} onClick={handleWrapperClick}>
        <div {...panelBind}>{children}</div>
      </div>
    </div>
  );
}

function Modal(props: ModalProps) {
  const { onClose, children, show = false, onShowChange, ...ownProps } = props;

  const modalState = useModal({ ...ownProps, children }, modalLibDefaults, {
    show,
    onClose,
    onShowChange,
  });

  if (!show) {
    return null;
  }

  const shell = <ModalShell {...modalState}>{children}</ModalShell>;

  const portalElement = resolveModalPortalElement(modalState.merged.teleportTo);

  if (portalElement === null) {
    return shell;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(shell, portalElement);
}

export default Modal;
