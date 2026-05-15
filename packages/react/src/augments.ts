// ** Local Imports
import type { AlertClasses, AlertProps } from "@/Components/Alert/alert.types";
import type {
  AvatarClasses,
  AvatarProps,
} from "@/Components/Avatar/avatar.types";
import type { BadgeClasses, BadgeProps } from "@/Components/Badge/badge.types";
import type {
  ButtonClasses,
  ButtonProps,
} from "@/Components/Button/button.types";
import type { CardClasses, CardProps } from "@/Components/Card/card.types";
import type {
  CheckboxClasses,
  CheckboxProps,
} from "@/Components/Checkbox/checkbox.types";
import type { IconProps } from "@/Components/Icon/icon.types";
import type { LinkClasses, LinkProps } from "@/Components/Link/link.types";
import type { MenuClasses, MenuProps } from "@/Components/Menu/menu.types";
import type {
  MiniBadgeClasses,
  MiniBadgeProps,
} from "@/Components/MiniBadge/miniBadge.types";
import type {
  MiniButtonClasses,
  MiniButtonProps,
} from "@/Components/MiniButton/miniButton.types";
import type { ModalClasses, ModalProps } from "@/Components/Modal/modal.types";
import type {
  NumberInputClasses,
  NumberInputProps,
} from "@/Components/NumberInput/numberInput.types";
import type {
  PasswordInputClasses,
  PasswordInputProps,
} from "@/Components/PasswordInput/passwordInput.types";
import type { RadioClasses, RadioProps } from "@/Components/Radio/radio.types";
import type {
  SelectClasses,
  SelectProps,
} from "@/Components/Select/select.types";
import type {
  TextareaClasses,
  TextareaProps,
} from "@/Components/Textarea/textarea.types";
import type {
  TextInputClasses,
  TextInputProps,
} from "@/Components/TextInput/textInput.types";
import type {
  ToggleClasses,
  ToggleProps,
} from "@/Components/Toggle/toggle.types";

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
