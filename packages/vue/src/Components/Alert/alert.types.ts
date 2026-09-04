// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  AlertColor,
  AlertPadding,
  AlertRounded,
  AlertShadow,
  AlertVariant,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { IconProps } from "@/Components/Icon";

export interface AlertColorOverrides {}
export interface AlertShadowOverrides {}
export interface AlertPaddingOverrides {}
export interface AlertRoundedOverrides {}
export interface AlertVariantOverrides {}

export interface AlertClasses {
  /**
   * The classes to apply to the body.
   */
  body?: string;

  /**
   * The classes to apply to the icon.
   */
  icon?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the title.
   */
  title?: string;
}

export interface AlertCustomProps {
  /**
   * Props forwarded to the default body container.
   */
  body?: HTMLAttributes;

  /**
   * Props forwarded to the default `Icon` (`icon` is set by the alert).
   */
  icon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the root container.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the title container.
   */
  title?: HTMLAttributes;
}

/**
 * Alert banner. Does not set `role` or `aria-live` by default — pass them when needed:
 * urgent dynamic messages: `role="alert"` and optionally `aria-live="assertive"`;
 * non-interrupting updates: `role="status"` and `aria-live="polite"`.
 */
export interface AlertOwnProps {
  /**
   * The classes to apply to the alert.
   *
   * @default undefined
   */
  classes?: AlertClasses;

  /**
   * The color to apply to the alert.
   *
   * @default "primary"
   */
  color?: MergeProps<AlertColor, AlertColorOverrides>;

  /**
   * Extra props for internal parts (`icon`, `title`, `body`, etc.).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  customProps?: AlertCustomProps;

  /**
   * The icon to apply to the alert. Use `null` to omit the prop icon.
   *
   * @default undefined
   */
  icon?: null | IconSource;

  /**
   * Root padding scale. Each token also sets body indent under the title row.
   *
   * @default "medium"
   */
  padding?: MergeProps<AlertPadding, AlertPaddingOverrides>;

  /**
   * The roundedness of the alert.
   *
   * @default "sm"
   */
  rounded?: MergeProps<AlertRounded, AlertRoundedOverrides>;

  /**
   * The shadow to apply to the alert.
   *
   * @default "sm"
   */
  shadow?: MergeProps<AlertShadow, AlertShadowOverrides>;

  /**
   * Title in the heading row. When omitted, the default slot is used as the
   * title.
   *
   * @default undefined
   */
  title?: string;

  /**
   * The variant of the alert.
   *
   * @default "flat"
   */
  variant?: MergeProps<AlertVariant, AlertVariantOverrides>;
}

export interface AlertSlots {
  /**
   * Content aligned to the right of the title row (e.g. dismiss or link).
   */
  action?: Slot<undefined>;

  /**
   * Body below the title row. Used as the title when `title` and the `title`
   * slot are omitted.
   */
  default?: Slot<undefined>;

  /**
   * Footer below the body, with top border spacing.
   */
  footer?: Slot<undefined>;

  /**
   * Replaces the entire alert header area (title row, icon, action).
   */
  header?: Slot<undefined>;

  /**
   * Custom icon markup. When provided, it replaces the default `Icon` used from the `icon` prop.
   */
  icon?: Slot<undefined>;

  /**
   * Title in the heading row. Takes precedence over the `title` prop and the
   * default slot.
   */
  title?: Slot<undefined>;
}

export type AlertProps = MergeHtmlProps<AlertOwnProps, HTMLAttributes>;
