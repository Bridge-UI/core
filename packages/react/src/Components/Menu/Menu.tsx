// ** External Imports
import { Fragment } from "react";
import { createPortal } from "react-dom";

// ** Core Imports
import { hasDocument, resolveModalPortalElement } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useMenu } from "@/Components/Menu/hooks/useMenu";
import type { MenuProps } from "@/Components/Menu/menu.types";

const menuLibDefaults = {
  offset: 4,
  shadow: "md",
  rounded: "md",
  strategy: "fixed",
  teleportTo: "body",
  closeOnEscape: true,
  closeOnClickAway: true,
  disableScrollLock: true,
  placement: "bottom-start",
} as const;

type MenuShellProps = ReturnType<typeof useMenu>;

function MenuShell({
  slots,
  merged,
  mounted,
  children,
  rootBind,
  hasTrigger,
  isPortaled,
  triggerBind,
  contentBind,
}: MenuShellProps) {
  const panel = mounted ? <div {...contentBind}>{children}</div> : null;

  let content = panel;

  if (panel && isPortaled) {
    if (!hasDocument()) {
      content = null;
    } else {
      const portalElement = resolveModalPortalElement(merged.teleportTo);

      content =
        portalElement === null ? panel : createPortal(panel, portalElement);
    }
  }

  if (!hasTrigger) {
    return <Fragment>{content}</Fragment>;
  }

  return (
    <div {...rootBind}>
      <div {...triggerBind}>{slots?.trigger}</div>

      {content}
    </div>
  );
}

function Menu({
  onClose,
  children,
  onShowChange,
  show = false,
  ...ownProps
}: MenuProps) {
  const menuState = useMenu(
    {
      ...ownProps,
      children,
    },
    menuLibDefaults,
    {
      show,
      onClose,
      onShowChange,
    },
  );

  return <MenuShell {...menuState} />;
}

export default Menu;
