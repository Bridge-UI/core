// ** External Imports
import { get } from "es-toolkit/compat";
import type { MouseEvent } from "react";

// ** Core Imports
import { cn, snackbarRoundedProps, type LinkColor } from "@bridge-ui/core";

// ** Local Imports
import type {
  SnackbarActionControlProps,
  SnackbarActionLayout,
  SnackbarActionRounded,
} from "@/Actions/Snackbar/bridgeSnackbar.types";
import { Button } from "@/Components/Button";
import { Link } from "@/Components/Link";

function layoutClasses(
  layout: SnackbarActionLayout,
  rounded: SnackbarActionRounded = "lg",
  hasReject?: boolean,
  hasAccept?: boolean,
): string {
  const roundedClasses = get(snackbarRoundedProps, rounded);
  const topRightClass = get(roundedClasses, "tr");
  const bottomRightClass = get(roundedClasses, "br");

  const rootClass = {
    trailing: "mr-4 shrink-0",
    "right-accept": cn({
      "w-full rounded-none": true,
      [topRightClass ?? ""]: true,
      [bottomRightClass ?? ""]: !hasReject,
    }),
    "right-reject": cn({
      "w-full rounded-none": true,
      [bottomRightClass ?? ""]: true,
      [topRightClass ?? ""]: !hasAccept,
    }),
  };

  return get(rootClass, layout, "");
}

export function SnackbarActionControl({
  role,
  onRun,
  action,
  layout,
  hasReject,
  hasAccept,
  snackbarColor,
  snackbarRounded = "lg",
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
          root: cn({
            [layoutClasses(layout, snackbarRounded, hasReject, hasAccept)]:
              true,
            [action.className ?? ""]: true,
            [action.link.classes?.root ?? ""]: true,
          }),
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
        root: cn({
          [layoutClasses(layout, snackbarRounded, hasReject, hasAccept)]: true,
          [action.className ?? ""]: true,
          [action.button?.classes?.root ?? ""]: true,
          "w-full": layout === "right-accept" || layout === "right-reject",
        }),
      }}
      onClick={() => onRun()}
    >
      {action.label}
    </Button>
  );
}
