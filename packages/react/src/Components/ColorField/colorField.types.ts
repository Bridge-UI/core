// ** External Imports
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { ColorFormat, FieldOverlayMode } from "@bridge-ui/core/Domain";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ColorPickerCustomProps,
  ColorPickerSlots,
} from "@/Components/ColorPicker";
import type { DrawerOwnProps } from "@/Components/Drawer/drawer.types";
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { IconProps } from "@/Components/Icon";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";
import type { ModalOwnProps } from "@/Components/Modal/modal.types";

export interface ColorFieldCallbacks {
  /**
   * Called when Apply is pressed (`showFooter`).
   */
  onApply?: () => void;

  /**
   * Called when Cancel is pressed (`showFooter`).
   */
  onCancel?: () => void;

  /**
   * Called when the selected color changes.
   */
  onChange?: (value: null | string) => void;

  /**
   * Called when the value is cleared.
   */
  onClear?: () => void;

  /**
   * Called when the menu closes.
   */
  onClose?: () => void;

  /**
   * Called when the menu opens.
   */
  onOpen?: () => void;
}

export interface ColorFieldClasses extends FormFieldClasses {
  /**
   * Classes merged onto the clear control.
   */
  clear?: string;

  /**
   * Classes merged onto the start color swatch.
   */
  swatch?: string;
}

export interface ColorFieldCustomProps extends FormFieldCustomProps {
  /**
   * Props forwarded to the clear `Icon` (`icon` is set by `ColorField`).
   *
   * @default undefined
   */
  clearIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the nested `ColorPicker`.
   *
   * @default undefined
   */
  colorPicker?: ColorPickerCustomProps;

  /**
   * Props forwarded to the nested `Drawer` when overlay resolves to drawer.
   *
   * @default undefined
   */
  drawer?: Partial<Omit<DrawerOwnProps, "show" | "children" | "onShowChange">>;

  /**
   * Props forwarded to the floating `Menu` when overlay resolves to menu.
   *
   * @default undefined
   */
  menu?: Partial<Omit<MenuOwnProps, "show" | "children" | "onShowChange">>;

  /**
   * Props forwarded to the nested `Modal` when overlay resolves to modal.
   *
   * @default undefined
   */
  modal?: Partial<Omit<ModalOwnProps, "show" | "children" | "onShowChange">>;

  /**
   * Props forwarded to the start color swatch.
   *
   * @default undefined
   */
  swatch?: HTMLAttributes<HTMLSpanElement>;
}

export interface ColorFieldOwnProps extends Omit<
  FormFieldOwnProps,
  "field" | "slots" | "classes" | "customProps"
> {
  /**
   * Shows the alpha slider in the nested picker. When unset, follows `format`.
   *
   * @default false (`true` for alpha formats when unset)
   */
  alpha?: boolean;

  /**
   * Children (unused; prefer slots).
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for field / input regions.
   *
   * @default undefined
   */
  classes?: ColorFieldClasses;

  /**
   * Whether the value can be cleared.
   *
   * @default true
   */
  clearable?: boolean;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: ColorFieldCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: null | string;

  /**
   * Unlocks the input for typing. Typed text is parsed and committed on blur
   * or Enter. When unset, the input is read-only.
   *
   * @default false
   */
  editable?: boolean;

  /**
   * When `true`, the picker fills the overlay width.
   * When `false`, it stays at its minimum width.
   * Unset: `true` for `drawer`, `false` for `menu` and `modal`.
   *
   * @default undefined
   */
  fill?: boolean;

  /**
   * Serialized output format.
   *
   * @default "hex"
   */
  format?: ColorFormat;

  /**
   * Which overlay shell opens the picker. `auto` uses `menu` on desktop and
   * `drawer` (bottom) on mobile.
   *
   * @default "auto"
   */
  overlay?: FieldOverlayMode;

  /**
   * Shows Cancel / Apply on the nested picker. When unset, defaults to `true` for dialog
   * shells (`modal` / `drawer`).
   *
   * @default false (`true` for `modal` / `drawer` when unset)
   */
  showFooter?: boolean;

  /**
   * Shows the selected color swatch at the start of the field.
   *
   * @default true
   */
  showSwatch?: boolean;

  /**
   * Named slots (`FormField` slots + footer).
   *
   * @default undefined
   */
  slots?: ColorFieldSlots;

  /**
   * Preset colors forwarded to the nested picker.
   *
   * @default undefined
   */
  swatches?: string[];

  /**
   * Controlled value.
   *
   * @default undefined
   */
  value?: null | string;
}

export interface ColorFieldSlots extends FormFieldSlots {
  /**
   * Custom footer. Replaces Cancel / Apply. Call `apply()` to commit and close
   * the overlay, or `cancel()` to discard and close.
   *
   * @default undefined
   */
  footer?: ColorPickerSlots["footer"];
}

export type ColorFieldProps = MergeHtmlProps<
  ColorFieldOwnProps & ColorFieldCallbacks,
  InputHTMLAttributes<HTMLInputElement>
>;
