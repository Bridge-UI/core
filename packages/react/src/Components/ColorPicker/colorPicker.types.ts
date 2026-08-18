// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  ColorFormat,
  FieldOverlayFooterSlotProps,
} from "@bridge-ui/core/Domain";
import type {
  ColorPickerColor,
  ColorPickerColorItem,
  ColorPickerRounded,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ButtonOwnProps } from "@/Components/Button";

export interface ColorPickerColorOverrides {}
export interface ColorPickerRoundedOverrides {}

/**
 * Props accepted by the footer buttons, pinned to the native `button` element.
 */
type ColorPickerFooterButtonProps = Partial<
  MergeHtmlProps<
    Omit<ButtonOwnProps, "as">,
    ButtonHTMLAttributes<HTMLButtonElement>
  >
>;

export interface ColorPickerClasses {
  /**
   * Classes for the alpha slider.
   */
  alpha?: string;

  /**
   * Classes for the saturation / brightness area.
   */
  area?: string;

  /**
   * Classes for the footer.
   */
  footer?: string;

  /**
   * Classes for the hue slider.
   */
  hue?: string;

  /**
   * Classes for the preview row.
   */
  preview?: string;

  /**
   * Classes for the root element.
   */
  root?: string;

  /**
   * Classes for preset swatches.
   */
  swatches?: string;
}

export interface ColorPickerCustomProps {
  /**
   * Props forwarded to the alpha slider.
   *
   * @default undefined
   */
  alpha?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the Apply button.
   *
   * @default undefined
   */
  applyButton?: ColorPickerFooterButtonProps;

  /**
   * Props forwarded to the saturation / brightness area.
   *
   * @default undefined
   */
  area?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the Cancel button.
   *
   * @default undefined
   */
  cancelButton?: ColorPickerFooterButtonProps;

  /**
   * Props forwarded to the footer.
   *
   * @default undefined
   */
  footer?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the hue slider.
   *
   * @default undefined
   */
  hue?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the preview row.
   *
   * @default undefined
   */
  preview?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the preset swatches row.
   *
   * @default undefined
   */
  swatches?: HTMLAttributes<HTMLDivElement>;
}

export interface ColorPickerCallbacks {
  /**
   * Called when Apply is pressed (`showFooter`).
   */
  onApply?: () => void;

  /**
   * Called when Cancel is pressed.
   */
  onCancel?: () => void;

  /**
   * Called when Apply is pressed (`showFooter`) or when the value commits.
   */
  onChange?: (value: null | string) => void;
}

export interface ColorPickerOwnProps {
  /**
   * Shows the alpha slider. When unset, follows `format` (`rgba` / `hexa` /
   * `hsla` enable it).
   *
   * @default false (`true` for alpha formats when unset)
   */
  alpha?: boolean;

  /**
   * Classes for picker regions.
   *
   * @default undefined
   */
  classes?: ColorPickerClasses;

  /**
   * Accent color for selected swatches.
   *
   * @default "primary"
   */
  color?: MergeProps<ColorPickerColor, ColorPickerColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: ColorPickerCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: null | string;

  /**
   * Disables the picker.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * When `true`, applies the error color palette to selected swatches.
   *
   * @default false
   */
  error?: boolean;

  /**
   * When `true`, fills the container width.
   * When `false` or unset, stays at the minimum width.
   *
   * @default false
   */
  fill?: boolean;

  /**
   * Serialized output format.
   *
   * @default "hex"
   */
  format?: ColorFormat;

  /**
   * Prevents selection.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Border radius of the picker shell and swatches.
   *
   * The shell uses the Menu panel scale (`full` caps at `rounded-panel-full`).
   *
   * `ColorField` always forwards its own `rounded` here so the picker matches
   * the field, independent of `ColorPicker.defaultProps`.
   *
   * @default "md"
   */
  rounded?: MergeProps<ColorPickerRounded, ColorPickerRoundedOverrides>;

  /**
   * Shows Cancel / Apply footer. Selection is draft until Apply.
   * Nested fields forward their own `showFooter` (dialog overlays default to `true`).
   *
   * @default false
   */
  showFooter?: boolean;

  /**
   * Named slots (`footer` for Cancel / Apply).
   *
   * @default undefined
   */
  slots?: ColorPickerSlots;

  /**
   * Preset colors shown below the sliders.
   *
   * @default undefined
   */
  swatches?: string[];

  /**
   * Token overrides.
   *
   * @default undefined
   */
  tokens?: ColorPickerTokens;

  /**
   * Controlled value.
   *
   * @default undefined
   */
  value?: null | string;
}

export interface ColorPickerSlots {
  /**
   * Custom footer. Replaces Cancel / Apply. Call `apply()` to commit and close
   * the overlay, or `cancel()` to discard and close.
   *
   * @default undefined
   */
  footer?: (ctx: FieldOverlayFooterSlotProps) => ReactNode;
}

export interface ColorPickerTokens {
  /**
   * Color token map overrides.
   */
  color?: Record<string, Partial<ColorPickerColorItem>>;

  /**
   * Border radius token map overrides.
   */
  rounded?: Record<string, string>;
}

export type ColorPickerProps = MergeHtmlProps<
  ColorPickerOwnProps & ColorPickerCallbacks,
  HTMLAttributes<HTMLDivElement>
>;
