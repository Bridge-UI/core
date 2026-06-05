// ** External Imports
import type { MouseEvent } from "react";

// ** Core Imports
import { cn, type ButtonColor, type LinkColor } from "@bridge-ui/core";

// ** Local Imports
import type { SnackbarAction } from "@/Actions/Snackbar/bridgeSnackbar.types";
import { Button } from "@/Components/Button";
import { Link } from "@/Components/Link";

type SnackbarActionLayout =
  | "inline"
  | "trailing"
  | "right-accept"
  | "right-reject";

type SnackbarActionControlProps = {
  onRun: () => void;
  hasReject?: boolean;
  hasAccept?: boolean;
  action: SnackbarAction;
  role: "accept" | "reject";
  layout: SnackbarActionLayout;
  snackbarColor: keyof ButtonColor;
};

function layoutClasses(
  layout: SnackbarActionLayout,
  hasReject?: boolean,
  hasAccept?: boolean,
): string {
  switch (layout) {
    case "trailing":
      return "mr-4 shrink-0";
    case "right-accept":
      return cn(
        "w-full rounded-none rounded-tr-lg",
        !hasReject && "rounded-br-lg",
      );
    case "right-reject":
      return cn(
        "w-full rounded-none rounded-br-lg",
        !hasAccept && "rounded-tr-lg",
      );
    default:
      return "";
  }
}

export function SnackbarActionControl({
  role,
  onRun,
  action,
  layout,
  hasReject,
  hasAccept,
  snackbarColor,
}: SnackbarActionControlProps) {
  const buttonColor = role === "accept" ? snackbarColor : "secondary";

  const linkColor = buttonColor as keyof LinkColor;

  if (action.link) {
    const { onClick: linkOnClick, ...linkProps } = action.link;

    return (
      <Link
        size="sm"
        underline="hover"
        color={linkColor}
        {...linkProps}
        classes={{
          ...action.link.classes,
          root: cn(
            layoutClasses(layout, hasReject, hasAccept),
            action.className,
            action.link.classes?.root,
          ),
        }}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
          linkOnClick?.(event);
          onRun();
        }}
      >
        {action.label}
      </Link>
    );
  }

  return (
    <Button
      size="sm"
      color={buttonColor}
      variant={action.solid ? "outline" : "flat"}
      {...action.button}
      classes={{
        ...action.button?.classes,
        root: cn(
          layoutClasses(layout, hasReject, hasAccept),
          action.className,
          action.button?.classes?.root,
          layout === "right-accept" || layout === "right-reject"
            ? "w-full"
            : undefined,
        ),
      }}
      onClick={() => onRun()}
    >
      {action.label}
    </Button>
  );
}
