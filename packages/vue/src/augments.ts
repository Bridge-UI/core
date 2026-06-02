// ** Local Imports
import type { AlertClasses, AlertProps } from "@/Components/Alert";
import type { AvatarClasses, AvatarProps } from "@/Components/Avatar";
import type { BadgeClasses, BadgeProps } from "@/Components/Badge";
import type { ButtonClasses, ButtonProps } from "@/Components/Button";
import type { CardClasses, CardProps } from "@/Components/Card";
import type { CheckboxClasses, CheckboxProps } from "@/Components/Checkbox";
import type { FormFieldClasses, FormFieldProps } from "@/Components/FormField";
import type { IconProps } from "@/Components/Icon";
import type { LabelClasses, LabelProps } from "@/Components/Label";
import type { LinkClasses, LinkProps } from "@/Components/Link";
import type { MenuClasses, MenuProps } from "@/Components/Menu";
import type { ModalClasses, ModalProps } from "@/Components/Modal";
import type { NumberFieldClasses } from "@/Components/NumberField";
import type { PasswordFieldClasses } from "@/Components/PasswordField";
import type { RadioClasses, RadioProps } from "@/Components/Radio";
import type { SelectClasses, SelectProps } from "@/Components/Select";
import type { SwitcherClasses, SwitcherProps } from "@/Components/Switcher";
import type { TextareaClasses, TextareaProps } from "@/Components/Textarea";
import type { ToggleClasses, ToggleProps } from "@/Components/Toggle";

declare module "@bridge-ui/core" {
  interface AlertConfigOverrides {
    classes: AlertClasses;
    defaultProps: Partial<
      Pick<AlertProps, "color" | "shadow" | "padding" | "rounded" | "variant">
    >;
  }

  interface AvatarConfigOverrides {
    classes: AvatarClasses;
    defaultProps: Partial<Pick<AvatarProps, "size" | "color" | "rounded">>;
  }

  interface BadgeConfigOverrides {
    classes: BadgeClasses;
    defaultProps: Partial<
      Pick<BadgeProps, "size" | "color" | "density" | "rounded" | "variant">
    >;
  }

  interface ButtonConfigOverrides {
    classes: ButtonClasses;
    defaultProps: Partial<
      Pick<ButtonProps, "size" | "color" | "density" | "rounded" | "variant">
    >;
  }

  interface CardConfigOverrides {
    classes: CardClasses;
    defaultProps: Partial<
      Pick<CardProps, "shadow" | "padding" | "rounded" | "variant">
    >;
  }

  interface CheckboxConfigOverrides {
    classes: CheckboxClasses;
    defaultProps: Partial<Pick<CheckboxProps, "size" | "color" | "rounded">>;
  }

  interface FormFieldConfigOverrides {
    classes: FormFieldClasses;
    defaultProps: Partial<
      Pick<
        FormFieldProps,
        "size" | "color" | "rounded" | "variant" | "errorIcon" | "withErrorIcon"
      >
    >;
    customProps: Partial<{
      size: Record<string, import("@bridge-ui/core").FormFieldSizeItem>;
      color: Record<string, import("@bridge-ui/core").FormFieldColorItem>;
      rounded: Record<string, import("@bridge-ui/core").FormFieldRoundedItem>;
      variant: Record<string, import("@bridge-ui/core").FormFieldVariantItem>;
    }>;
  }

  interface IconConfigOverrides {
    defaultProps: Partial<Pick<IconProps, "size">>;
  }

  interface LabelConfigOverrides {
    classes: LabelClasses;
    defaultProps: Partial<Pick<LabelProps, "size" | "required">>;
  }

  interface LinkConfigOverrides {
    classes: LinkClasses;
    defaultProps: Partial<Pick<LinkProps, "size" | "color" | "underline">>;
  }

  interface MenuConfigOverrides {
    classes: MenuClasses;
    defaultProps: Partial<Pick<MenuProps, "rounded" | "shadow">>;
  }

  interface ModalConfigOverrides {
    classes: ModalClasses;
    defaultProps: Partial<Pick<ModalProps, "size" | "teleportTo">>;
  }

  interface RadioConfigOverrides {
    classes: RadioClasses;
    defaultProps: Partial<Pick<RadioProps, "size" | "color" | "rounded">>;
  }

  interface SelectConfigOverrides {
    classes: SelectClasses;
    defaultProps: Partial<
      Pick<SelectProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface SwitcherConfigOverrides {
    classes: SwitcherClasses;
    defaultProps: Partial<
      Pick<SwitcherProps, "size" | "error" | "withoutErrorMessage">
    >;
  }

  interface NumberFieldConfigOverrides {
    classes: NumberFieldClasses;
  }

  interface PasswordFieldConfigOverrides {
    classes: PasswordFieldClasses;
  }

  interface TextareaConfigOverrides {
    classes: TextareaClasses;
    defaultProps: Partial<Pick<TextareaProps, "resize" | "autosize">>;
    customProps: Partial<{
      resize: Record<string, string>;
    }>;
  }

  interface ToggleConfigOverrides {
    classes: ToggleClasses;
    defaultProps: Partial<Pick<ToggleProps, "size" | "color" | "rounded">>;
  }
}
