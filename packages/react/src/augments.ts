// ** Local Imports
import type { AlertClasses, AlertProps } from "@/Components/Alert";
import type { AvatarClasses, AvatarProps } from "@/Components/Avatar";
import type { BadgeClasses, BadgeProps } from "@/Components/Badge";
import type { ButtonClasses, ButtonProps } from "@/Components/Button";
import type { CardClasses, CardProps } from "@/Components/Card";
import type { CheckboxClasses, CheckboxProps } from "@/Components/Checkbox";
import type { IconProps } from "@/Components/Icon";
import type { LinkClasses, LinkProps } from "@/Components/Link";
import type { MenuClasses, MenuProps } from "@/Components/Menu";
import type { MiniBadgeClasses, MiniBadgeProps } from "@/Components/MiniBadge";
import type {
  MiniButtonClasses,
  MiniButtonProps,
} from "@/Components/MiniButton";
import type { ModalClasses, ModalProps } from "@/Components/Modal";
import type {
  NumberInputClasses,
  NumberInputProps,
} from "@/Components/NumberInput";
import type {
  PasswordInputClasses,
  PasswordInputProps,
} from "@/Components/PasswordInput";
import type { RadioClasses, RadioProps } from "@/Components/Radio";
import type { SelectClasses, SelectProps } from "@/Components/Select";
import type { TextareaClasses, TextareaProps } from "@/Components/Textarea";
import type { TextInputClasses, TextInputProps } from "@/Components/TextInput";
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
      Pick<BadgeProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface ButtonConfigOverrides {
    classes: ButtonClasses;
    defaultProps: Partial<
      Pick<ButtonProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface CardConfigOverrides {
    classes: CardClasses;
    defaultProps: Partial<Pick<CardProps, "rounded" | "shadow" | "padding">>;
  }

  interface CheckboxConfigOverrides {
    classes: CheckboxClasses;
    defaultProps: Partial<Pick<CheckboxProps, "size" | "color" | "rounded">>;
  }

  interface IconConfigOverrides {
    defaultProps: Partial<Pick<IconProps, "size">>;
  }

  interface LinkConfigOverrides {
    classes: LinkClasses;
    defaultProps: Partial<Pick<LinkProps, "size" | "color">>;
  }

  interface MenuConfigOverrides {
    classes: MenuClasses;
    defaultProps: Partial<Pick<MenuProps, "rounded" | "shadow">>;
  }

  interface MiniBadgeConfigOverrides {
    classes: MiniBadgeClasses;
    defaultProps: Partial<
      Pick<MiniBadgeProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface MiniButtonConfigOverrides {
    classes: MiniButtonClasses;
    defaultProps: Partial<
      Pick<MiniButtonProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface ModalConfigOverrides {
    classes: ModalClasses;
    defaultProps: Partial<Pick<ModalProps, "size" | "rounded" | "shadow">>;
  }

  interface NumberInputConfigOverrides {
    classes: NumberInputClasses;
    defaultProps: Partial<
      Pick<NumberInputProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface PasswordInputConfigOverrides {
    classes: PasswordInputClasses;
    defaultProps: Partial<
      Pick<PasswordInputProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface RadioConfigOverrides {
    classes: RadioClasses;
    defaultProps: Partial<Pick<RadioProps, "size" | "color">>;
  }

  interface SelectConfigOverrides {
    classes: SelectClasses;
    defaultProps: Partial<
      Pick<SelectProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface TextareaConfigOverrides {
    classes: TextareaClasses;
    defaultProps: Partial<
      Pick<TextareaProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface TextInputConfigOverrides {
    classes: TextInputClasses;
    defaultProps: Partial<
      Pick<TextInputProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface ToggleConfigOverrides {
    classes: ToggleClasses;
    defaultProps: Partial<Pick<ToggleProps, "size" | "color">>;
  }
}
