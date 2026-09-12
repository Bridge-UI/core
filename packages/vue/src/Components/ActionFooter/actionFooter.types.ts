// ** External Imports
import type { HTMLAttributes } from "vue";

// ** Core Imports
import type { ButtonColor, ButtonVariant } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ButtonColorOverrides,
  ButtonProps,
  ButtonVariantOverrides,
} from "@/Components/Button/button.types";

/**
 * Props accepted by the footer buttons.
 */
type ActionFooterButtonProps = Partial<ButtonProps>;

export interface ActionFooterClasses {
  /**
   * Classes merged onto the Apply button.
   */
  applyButton?: string;

  /**
   * Classes merged onto the Cancel button.
   */
  cancelButton?: string;

  /**
   * Classes merged onto the root.
   */
  root?: string;
}

export interface ActionFooterCustomProps {
  /**
   * Props forwarded to the Apply button.
   *
   * @default undefined
   */
  applyButton?: ActionFooterButtonProps;

  /**
   * Props forwarded to the Cancel button.
   *
   * @default undefined
   */
  cancelButton?: ActionFooterButtonProps;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

export interface ActionFooterEmits {
  /**
   * Emitted when Apply is pressed.
   */
  apply: [];

  /**
   * Emitted when Cancel is pressed.
   */
  cancel: [];
}

/**
 * Cancel / Apply pair used as the default footer in pickers and listboxes.
 */
export interface ActionFooterOwnProps {
  /**
   * Color of the Apply button.
   *
   * @default "primary"
   */
  applyColor?: MergeProps<ButtonColor, ButtonColorOverrides>;

  /**
   * Label of the Apply button. Falls back to the i18n string `Apply`.
   *
   * @default undefined
   */
  applyLabel?: string;

  /**
   * Variant of the Apply button. Falls back to the `Button` default.
   *
   * @default undefined
   */
  applyVariant?: MergeProps<ButtonVariant, ButtonVariantOverrides>;

  /**
   * Color of the Cancel button.
   *
   * @default "secondary"
   */
  cancelColor?: MergeProps<ButtonColor, ButtonColorOverrides>;

  /**
   * Label of the Cancel button. Falls back to the i18n string `Cancel`.
   *
   * @default undefined
   */
  cancelLabel?: string;

  /**
   * Variant of the Cancel button.
   *
   * @default "flat"
   */
  cancelVariant?: MergeProps<ButtonVariant, ButtonVariantOverrides>;

  /**
   * The classes to apply to the footer.
   *
   * @default undefined
   */
  classes?: ActionFooterClasses;

  /**
   * Extra props for internal parts (`root`, `applyButton`, `cancelButton`).
   *
   * @default undefined
   */
  customProps?: ActionFooterCustomProps;
}

export type ActionFooterProps = MergeHtmlProps<
  ActionFooterOwnProps,
  HTMLAttributes
>;
