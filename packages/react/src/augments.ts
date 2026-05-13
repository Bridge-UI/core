// ** Local Imports
import type { AlertClasses, AlertProps } from "@/Components/Alert/alert.types";
import type {
  ButtonClasses,
  ButtonProps,
} from "@/Components/Button/button.types";
import type { IconProps } from "@/Components/Icon/icon.types";
import type {
  MiniButtonClasses,
  MiniButtonProps,
} from "@/Components/MiniButton/miniButton.types";

declare module "@bridge-ui/core" {
  interface AlertConfigOverrides {
    classes: AlertClasses;
    defaultProps: Partial<
      Pick<AlertProps, "color" | "shadow" | "padding" | "rounded" | "variant">
    >;
  }

  interface ButtonConfigOverrides {
    classes: ButtonClasses;
    defaultProps: Partial<
      Pick<ButtonProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface MiniButtonConfigOverrides {
    classes: MiniButtonClasses;
    defaultProps: Partial<
      Pick<MiniButtonProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface IconConfigOverrides {
    defaultProps: Partial<Pick<IconProps, "size">>;
  }
}
