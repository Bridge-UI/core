// ** External Imports
import { createPortal } from "react-dom";

// ** Core Imports
import { hasDocument, resolveModalPortalElement } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { DrawerProps } from "@/Components/Drawer/drawer.types";
import { useDrawer } from "@/Components/Drawer/hooks/useDrawer";

const drawerLibDefaults = {
  size: "md",
  blur: "none",
  scroll: "paper",
  autoFocus: false,
  placement: "left",
  teleportTo: "body",
  transition: "slide",
  closeOnEscape: true,
  closeOnOverlay: true,
} as const;

function DrawerShell({
  merged,
  children,
  rootBind,
  panelBind,
  overlayBind,
  wrapperBind,
  handleOverlayClick,
  handleWrapperClick,
}: ReturnType<typeof useDrawer> & { children: DrawerProps["children"] }) {
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

function Drawer({
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
}: DrawerProps) {
  const drawerState = useDrawer(
    {
      ...ownProps,
      stackId,
      children,
      persistent,
      teleportTo,
      closeOnEscape,
      closeOnOverlay,
    },
    drawerLibDefaults,
    {
      show,
      onClose,
      stackId,
      onShowChange,
    },
  );

  if (!drawerState.mounted) {
    return null;
  }

  const shell = <DrawerShell {...drawerState}>{children}</DrawerShell>;

  const portalElement = resolveModalPortalElement(
    drawerState.merged.teleportTo,
  );

  if (portalElement === null) {
    return shell;
  }

  if (!hasDocument()) {
    return null;
  }

  return createPortal(shell, portalElement);
}

export default Drawer;
