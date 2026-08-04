// ** Local Imports
import type { AlertClasses, AlertProps } from "@/Components/Alert";
import type { AvatarClasses, AvatarProps } from "@/Components/Avatar";
import type { BadgeClasses, BadgeProps } from "@/Components/Badge";
import type { ButtonClasses, ButtonProps } from "@/Components/Button";
import type { CardClasses, CardProps } from "@/Components/Card";
import type { CheckboxClasses, CheckboxProps } from "@/Components/Checkbox";
import type { ChipClasses, ChipProps } from "@/Components/Chip";
import type { DividerClasses, DividerProps } from "@/Components/Divider";
import type {
  FormControlClasses,
  FormControlProps,
} from "@/Components/FormControl";
import type { FormFieldClasses, FormFieldProps } from "@/Components/FormField";
import type { IconProps } from "@/Components/Icon";
import type { LabelClasses, LabelProps } from "@/Components/Label";
import type { LinkClasses, LinkProps } from "@/Components/Link";
import type { ListClasses } from "@/Components/List";
import type { ListItemClasses, ListItemProps } from "@/Components/ListItem";
import type { ListSectionClasses } from "@/Components/ListSection";
import type { MenuClasses, MenuProps } from "@/Components/Menu";
import type { ModalClasses, ModalProps } from "@/Components/Modal";
import type { NumberFieldClasses } from "@/Components/NumberField";
import type { PasswordFieldClasses } from "@/Components/PasswordField";
import type { ProgressClasses, ProgressProps } from "@/Components/Progress";
import type { RadioClasses, RadioProps } from "@/Components/Radio";
import type { SelectClasses, SelectProps } from "@/Components/Select";
import type { SkeletonClasses, SkeletonProps } from "@/Components/Skeleton";
import type { SnackbarClasses, SnackbarProps } from "@/Components/Snackbar";
import type { SpinnerClasses, SpinnerProps } from "@/Components/Spinner";
import type { SwitchClasses, SwitchProps } from "@/Components/Switch";
import type { TextareaClasses, TextareaProps } from "@/Components/Textarea";

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

  interface ChipConfigOverrides {
    classes: ChipClasses;
    defaultProps: Partial<Pick<ChipProps, "size">>;
  }

  interface DividerConfigOverrides {
    classes: DividerClasses;
    defaultProps: Partial<Pick<DividerProps, "color" | "orientation">>;
  }

  interface FormControlConfigOverrides {
    classes: FormControlClasses;
    defaultProps: Partial<
      Pick<FormControlProps, "size" | "error" | "hideErrorMessage">
    >;
  }

  interface FormFieldConfigOverrides {
    classes: FormFieldClasses;
    defaultProps: Partial<
      Pick<
        FormFieldProps,
        "size" | "color" | "rounded" | "variant" | "errorIcon" | "showErrorIcon"
      >
    >;
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

  interface ListConfigOverrides {
    classes: ListClasses;
  }

  interface ListItemConfigOverrides {
    classes: ListItemClasses;
    defaultProps: Partial<Pick<ListItemProps, "role" | "selectedIcon">>;
  }

  interface ListSectionConfigOverrides {
    classes: ListSectionClasses;
  }

  interface MenuConfigOverrides {
    classes: MenuClasses;
    defaultProps: Partial<Pick<MenuProps, "shadow" | "rounded">>;
  }

  interface ModalConfigOverrides {
    classes: ModalClasses;
    defaultProps: Partial<
      Pick<ModalProps, "blur" | "size" | "align" | "teleportTo" | "transition">
    >;
  }

  interface NumberFieldConfigOverrides {
    classes: NumberFieldClasses;
  }

  interface PasswordFieldConfigOverrides {
    classes: PasswordFieldClasses;
  }

  interface ProgressConfigOverrides {
    classes: ProgressClasses;
    defaultProps: Partial<
      Pick<ProgressProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface RadioConfigOverrides {
    classes: RadioClasses;
    defaultProps: Partial<Pick<RadioProps, "size" | "color" | "rounded">>;
  }

  interface SnackbarConfigOverrides {
    classes: SnackbarClasses;
    defaultProps: Partial<
      Pick<
        SnackbarProps,
        | "color"
        | "padding"
        | "rounded"
        | "duration"
        | "position"
        | "teleportTo"
        | "transition"
        | "closeButton"
        | "progressbar"
      >
    >;
  }

  interface SelectConfigOverrides {
    classes: SelectClasses;
    defaultProps: Partial<
      Pick<SelectProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface SkeletonConfigOverrides {
    classes: SkeletonClasses;
    defaultProps: Partial<Pick<SkeletonProps, "rounded">>;
  }

  interface SpinnerConfigOverrides {
    classes: SpinnerClasses;
    defaultProps: Partial<
      Pick<
        SpinnerProps,
        | "size"
        | "color"
        | "variant"
        | "thickness"
        | "enableTrack"
        | "disableShrink"
      >
    >;
  }

  interface SwitchConfigOverrides {
    classes: SwitchClasses;
    defaultProps: Partial<Pick<SwitchProps, "size" | "color" | "rounded">>;
  }

  interface TextareaConfigOverrides {
    classes: TextareaClasses;
    defaultProps: Partial<Pick<TextareaProps, "resize" | "autosize">>;
  }
}
