// ** External Imports
import type { MouseEvent } from "react";

// ** Core Imports
import { cn, type SnackbarColor } from "@bridge-ui/core";

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
  action: SnackbarAction;
  role: "accept" | "reject";
  layout: SnackbarActionLayout;
  snackbarColor: keyof SnackbarColor;
  hasReject?: boolean;
  hasAccept?: boolean;
  onRun: () => void;
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
  action,
  role,
  layout,
  snackbarColor,
  hasReject,
  hasAccept,
  onRun,
}: SnackbarActionControlProps) {
  const color = role === "accept" ? snackbarColor : "secondary";

  if (action.link) {
    return (
      <Link
        size="sm"
        underline="hover"
        color={color}
        {...action.link}
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
          action.link?.onClick?.(event);
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
      color={color}
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
