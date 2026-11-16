// ** External Imports
import { get } from "es-toolkit/compat";
import type { HTMLAttributes, Ref } from "vue";

// ** Core Imports
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core/Utils";

// ** Local Imports
import { mergePartBind } from "@/Utils";

/**
 * Root and trigger parts shared by Popover and Menu (the anchored panels
 * built on `usePopoverBase`). Content, roles and keyboard handling
 * stay in each component.
 */

type PartClasses = undefined | Partial<Record<"root" | "trigger", string>>;

type PartProps = undefined | HTMLAttributes;

/**
 * `setShow` for an overlay bound with `v-model:show`: calls `onClose` on
 * close, updates the model, then calls `onShowChange`.
 */
export function createPopoverSetShow(options: {
  onClose?: () => void;
  onShowChange?: (show: boolean) => void;
  show?: Ref<boolean>;
}): (show: boolean) => void {
  return (next) => {
    if (!next) {
      options.onClose?.();
    }

    if (options.show) {
      options.show.value = next;
    }

    options.onShowChange?.(next);
  };
}

/**
 * Panel token class (`rounded`, `shadow`): the base token map merged with
 * the registry overrides, resolved for the selected key.
 */
export function getPopoverPanelTokenClass<T extends object>(
  props: T,
  overrides: undefined | Partial<T>,
  key: keyof T | undefined,
): string | undefined {
  const classes = mergeBridgeUILayeredClasses(props, overrides);

  return get(classes, key as string) as string | undefined;
}

/**
 * Root wrapper bind (holds the trigger).
 */
export function getPopoverRootBind(options: {
  classes: PartClasses;
  customProps: PartProps;
  inheritedAttrs: object;
}) {
  return mergePartBind(
    options.customProps,
    options.inheritedAttrs,
    cn({
      "relative inline-flex": true,
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
  onKeydown: (event: KeyboardEvent) => void;
  show: boolean;
  toggle: () => void;
}) {
  return mergePartBind(
    options.customProps,
    {},
    {
      tabindex: 0,
      role: "button",
      onKeydown: options.onKeydown,
      "aria-expanded": options.show,
      onClickCapture: options.toggle,
      "aria-haspopup": options.hasPopup,
      "aria-controls": options.show ? options.controlsId : undefined,
      class: cn({
        "inline-flex w-fit max-w-full cursor-pointer outline-hidden": true,
        [get(options.classes, "trigger") ?? ""]: true,
      }),
    },
  );
}
