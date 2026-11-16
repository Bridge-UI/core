// ** External Imports
import { Fragment } from "react";
import { createPortal } from "react-dom";

// ** Core Imports
import {
  hasDocument,
  resolveModalPortalElement,
} from "@bridge-ui/core/Runtime";

// ** Local Imports
import { usePopover } from "@/Components/Popover/hooks/usePopover";
import type { PopoverProps } from "@/Components/Popover/popover.types";

const popoverLibDefaults = {
  offset: 8,
  arrow: false,
  shadow: "md",
  rounded: "md",
  strategy: "fixed",
  teleportTo: "body",
  closeOnEscape: true,
  closeOnFocusOut: true,
  closeOnClickAway: true,
  disableScrollLock: true,
  placement: "bottom-start",
} as const;

type PopoverShellProps = ReturnType<typeof usePopover>;

function PopoverShell({
  slots,
  merged,
  mounted,
  children,
  hasTitle,
  rootBind,
  titleBind,
  arrowBind,
  hasTrigger,
  isPortaled,
  triggerBind,
  contentBind,
}: PopoverShellProps) {
  const panel = mounted ? (
    <div {...contentBind}>
      {hasTitle ? <div {...titleBind}>{merged.title}</div> : null}

      {children}

      {arrowBind ? <div {...arrowBind} /> : null}
    </div>
  ) : null;

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
    <Fragment>
      <div {...rootBind}>
        <div {...triggerBind}>{slots?.trigger}</div>
      </div>

      {content}
    </Fragment>
  );
}

function Popover({
  onClose,
  children,
  onShowChange,
  show = false,
  ...ownProps
}: PopoverProps) {
  const popoverState = usePopover(
    {
      ...ownProps,
      children,
    },
    popoverLibDefaults,
    {
      show,
      onClose,
      onShowChange,
    },
  );

  return <PopoverShell {...popoverState} />;
}

export default Popover;
