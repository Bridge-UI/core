// ** External Imports
import type { LucideIcon } from "lucide-vue-next";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  Slot,
} from "vue";

// ** Core Imports
import type {
  ButtonColor,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

export interface MiniButtonSizeOverrides {}
export interface MiniButtonColorOverrides {}
export interface MiniButtonRoundedOverrides {}
export interface MiniButtonVariantOverrides {}

export interface MiniButtonClasses {
  /**
   * The classes to apply to the icon.
   */
  icon?: string;

  /**
   * The classes to apply to the loading spinner.
   */
  loading?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface MiniButtonPartsProps {
  /**
   * Props forwarded to the `Icon` (`icon` is set by the mini button).
   */
  icon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the loading spinner `Icon`.
   */
  loading?: Partial<Omit<IconProps, "icon">>;
}

export interface MiniButtonOwnProps {
  /**
   * The element to render as.
   *
   * @default "button"
   */
  as?: "a" | "span" | "button";

  /**
   * Extra classes merged with the root element (and `classes.root`).
   *
   * @default undefined
   */
  class?: string;

  /**
   * The classes to apply to the mini button.
   *
   * @default undefined
   */
  classes?: MiniButtonClasses;

  /**
   * The color to apply to the mini button.
   *
   * @default "primary"
   */
  color?: MergeProps<ButtonColor, MiniButtonColorOverrides>;

  /**
   * Whether the mini button is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * The href when `as` is `"a"`.
   *
   * @default undefined
   */
  href?: string;

  /**
   * The icon to display.
   *
   * @default undefined
   */
  icon?: LucideIcon;

  /**
   * Whether the mini button is loading.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Extra props for internal parts (`icon`, `loading`, etc.).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  partsProps?: MiniButtonPartsProps;

  /**
   * The roundedness of the mini button.
   *
   * @default "md"
   */
  rounded?: MergeProps<ButtonRounded, MiniButtonRoundedOverrides>;

  /**
   * The size of the mini button.
   *
   * @default "md"
   */
  size?: MergeProps<ButtonSize, MiniButtonSizeOverrides>;

  /**
   * The variant of the mini button.
   *
   * @default "flat"
   */
  variant?: MergeProps<ButtonVariant, MiniButtonVariantOverrides>;
}

export interface MiniButtonSlots {
  /**
   * Content rendered in place of the icon. Hidden while `loading` is true.
   * Ignored when `icon` is set.
   */
  default?: Slot;
}

// prettier-ignore
export type MiniButtonProps =
  | MergeHtmlProps<MiniButtonOwnProps & { as: "span" }, HTMLAttributes>
  | MergeHtmlProps<MiniButtonOwnProps & { as: "a" }, AnchorHTMLAttributes>
  | MergeHtmlProps<MiniButtonOwnProps & { as?: "button" }, ButtonHTMLAttributes>;
