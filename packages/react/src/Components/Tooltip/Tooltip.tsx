// ** External Imports
import { Fragment } from "react";
import { createPortal } from "react-dom";

// ** Core Imports
import { hasDocument, resolveModalPortalElement } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useTooltip } from "@/Components/Tooltip/hooks/useTooltip";
import type { TooltipProps } from "@/Components/Tooltip/tooltip.types";

const tooltipLibDefaults = {
  offset: 8,
  size: "md",
  arrow: true,
  color: "dark",
  rounded: "md",
  closeDelay: 0,
  openDelay: 200,
  placement: "top",
  strategy: "fixed",
  teleportTo: "body",
} as const;

type TooltipShellProps = ReturnType<typeof useTooltip>;

function TooltipShell({
  slots,
  merged,
  mounted,
  rootBind,
  panelBody,
  arrowBind,
  hasTrigger,
  isPortaled,
  triggerBind,
  contentBind,
}: TooltipShellProps) {
  const panel = mounted ? (
    <div {...contentBind}>
      {panelBody}
      {arrowBind ? <div {...arrowBind} /> : null}
    </div>
  ) : null;

  let floating = panel;

  if (panel && isPortaled) {
    if (!hasDocument()) {
      floating = null;
    } else {
      const portalElement = resolveModalPortalElement(merged.teleportTo);

      floating =
        portalElement === null ? panel : createPortal(panel, portalElement);
    }
  }

  if (!hasTrigger) {
    return <Fragment>{floating}</Fragment>;
  }

  return (
    <Fragment>
      <div {...rootBind}>
        <div {...triggerBind}>{slots?.trigger}</div>
      </div>

      {floating}
    </Fragment>
  );
}

function Tooltip({ show, children, onShowChange, ...ownProps }: TooltipProps) {
  const tooltipState = useTooltip(
    {
      ...ownProps,
      children,
    },
    tooltipLibDefaults,
    {
      show,
      onShowChange,
    },
  );

  return <TooltipShell {...tooltipState} />;
}

export default Tooltip;
