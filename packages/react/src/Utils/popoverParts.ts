// ** External Imports
import { get } from "es-toolkit/compat";
import {
  useMemo,
  type HTMLAttributes,
  type KeyboardEvent,
  type RefObject,
} from "react";

// ** Core Imports
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core/Utils";

// ** Local Imports
import { mergePartBind } from "@/Utils/mergePartBind";

/**
 * Root and trigger parts shared by Popover and Menu (the anchored panels
 * built on `usePopoverBase`). Content, roles and keyboard handling
 * stay in each component.
 */

type PartClasses = undefined | Partial<Record<"root" | "trigger", string>>;

type PartProps = undefined | HTMLAttributes<HTMLDivElement>;

/**
 * `setShow` for a controlled overlay: calls `onClose` on close, then
 * `onShowChange`.
 */
export function createPopoverSetShow(options: {
  onClose?: () => void;
  onShowChange?: (show: boolean) => void;
}): (show: boolean) => void {
  return (next) => {
    if (!next) {
      options.onClose?.();
    }

    options.onShowChange?.(next);
  };
}

/**
 * Panel `rounded` and `shadow` classes: the base token maps merged with the
 * registry overrides, resolved for the selected keys.
 */
export function usePopoverPanelClasses<
  R extends object,
  S extends object,
>(options: {
  rounded?: keyof R;
  roundedOverrides?: Partial<R>;
  roundedProps: R;
  shadow?: keyof S;
  shadowOverrides?: Partial<S>;
  shadowProps: S;
}): { roundedClass?: string; shadowClass?: string } {
  const { shadow, rounded, shadowOverrides, roundedOverrides } = options;

  const { shadowProps, roundedProps } = options;

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(roundedProps, roundedOverrides);

    return get(classes, rounded as string) as string | undefined;
  }, [rounded, roundedProps, roundedOverrides]);

  const shadowClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(shadowProps, shadowOverrides);

    return get(classes, shadow as string) as string | undefined;
  }, [shadow, shadowProps, shadowOverrides]);

  return { shadowClass, roundedClass };
}

/**
 * Root wrapper bind (holds the trigger).
 */
export function getPopoverRootBind(options: {
  classes: PartClasses;
  customProps: PartProps;
  hasTrigger: boolean;
  inheritedAttrs: object;
}) {
  return mergePartBind(
    options.customProps,
    options.inheritedAttrs,
    cn({
      "relative inline-flex": options.hasTrigger,
      [get(options.classes, "root") ?? ""]: true,
    }),
  );
}

/**
 * Trigger wrapper bind: a focusable button that toggles the panel.
 */
export function getPopoverTriggerBind(options: {
  classes: PartClasses;
  controlsId: string;
  customProps: PartProps;
  hasPopup: "menu" | "dialog";
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  show: boolean;
  toggle: () => void;
  triggerRef: RefObject<null | HTMLDivElement>;
}) {
  return mergePartBind(
    options.customProps,
    { ref: options.triggerRef },
    {
      tabIndex: 0,
      role: "button",
      onKeyDown: options.onKeyDown,
      "aria-expanded": options.show,
      onClickCapture: options.toggle,
      "aria-haspopup": options.hasPopup,
      "aria-controls": options.show ? options.controlsId : undefined,
      className: cn({
        "inline-flex w-fit max-w-full cursor-pointer outline-hidden": true,
        [get(options.classes, "trigger") ?? ""]: true,
      }),
    },
  );
}
