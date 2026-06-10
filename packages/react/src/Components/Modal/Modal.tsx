// ** External Imports
import { createPortal } from "react-dom";

// ** Core Imports
import { hasDocument, resolveModalPortalElement } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useModal } from "@/Components/Modal/hooks/useModal";
import type { ModalProps } from "@/Components/Modal/modal.types";

const modalLibDefaults = {
  size: "md",
  blur: "none",
  scroll: "body",
  teleportTo: "body",
  transition: "fade",
  closeOnEscape: true,
  closeOnOverlay: true,
  align: "middle-center",
} as const;

function ModalShell({
  merged,
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
      {!merged.hideBackdrop ? (
        <div {...overlayBind} aria-hidden="true" onClick={handleOverlayClick} />
      ) : null}

      <div {...wrapperBind} onClick={handleWrapperClick}>
        <div {...panelBind}>{children}</div>
      </div>
    </div>
  );
}

function Modal({
  onClose,
  stackId,
  children,
  onShowChange,
  show = false,
  persistent = false,
  teleportTo = "body",
  closeOnEscape = true,
  closeOnOverlay = true,
  ...ownProps
}: ModalProps) {
  const modalState = useModal(
    {
      ...ownProps,
      stackId,
      children,
      persistent,
      teleportTo,
      closeOnEscape,
      closeOnOverlay,
    },
    modalLibDefaults,
    {
      show,
      onClose,
      stackId,
      onShowChange,
    },
  );

  if (!modalState.mounted) {
    return null;
  }

  const shell = <ModalShell {...modalState}>{children}</ModalShell>;

  const portalElement = resolveModalPortalElement(modalState.merged.teleportTo);

  if (portalElement === null) {
    return shell;
  }

  if (!hasDocument()) {
    return null;
  }

  return createPortal(shell, portalElement);
}

export default Modal;
