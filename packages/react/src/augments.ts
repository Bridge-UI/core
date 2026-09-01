// ** Local Imports
import type { AlertClasses, AlertProps } from "@/Components/Alert";
import type {
  AutocompleteClasses,
  AutocompleteProps,
} from "@/Components/Autocomplete";
import type { AvatarClasses, AvatarProps } from "@/Components/Avatar";
import type { BadgeClasses, BadgeProps } from "@/Components/Badge";
import type { ButtonClasses, ButtonProps } from "@/Components/Button";
import type {
  ButtonGroupClasses,
  ButtonGroupProps,
  ButtonGroupTextClasses,
  ButtonGroupTextProps,
} from "@/Components/ButtonGroup";
import type { CardClasses, CardProps } from "@/Components/Card";
import type { CheckboxClasses, CheckboxProps } from "@/Components/Checkbox";
import type { ChipClasses, ChipProps } from "@/Components/Chip";
import type { DividerClasses, DividerProps } from "@/Components/Divider";
import type {
  EmptyStateClasses,
  EmptyStateProps,
} from "@/Components/EmptyState";
import type { IconProps } from "@/Components/Icon";
import type { LabelClasses, LabelProps } from "@/Components/Label";
import type { LinkClasses, LinkProps } from "@/Components/Link";
import type { ListClasses } from "@/Components/List";
import type { ListItemClasses, ListItemProps } from "@/Components/ListItem";
import type { ListSectionClasses } from "@/Components/ListSection";
import type { MenuClasses, MenuProps } from "@/Components/Menu";
import type { ModalClasses, ModalProps } from "@/Components/Modal";
import type {
  NumberFieldClasses,
  NumberFieldProps,
} from "@/Components/NumberField";
import type { OtpFieldClasses, OtpFieldProps } from "@/Components/OtpField";
import type {
  PasswordFieldClasses,
  PasswordFieldProps,
} from "@/Components/PasswordField";
import type { ProgressClasses, ProgressProps } from "@/Components/Progress";
import type { RadioClasses, RadioProps } from "@/Components/Radio";
import type { SelectClasses, SelectProps } from "@/Components/Select";
import type {
  SidebarClasses,
  SidebarInsetClasses,
  SidebarProps,
  SidebarProviderClasses,
  SidebarProviderProps,
} from "@/Components/Sidebar";
import type { SkeletonClasses, SkeletonProps } from "@/Components/Skeleton";
import type { SliderClasses, SliderProps } from "@/Components/Slider";
import type { SnackbarClasses, SnackbarProps } from "@/Components/Snackbar";
import type { SpinnerClasses, SpinnerProps } from "@/Components/Spinner";
import type { SwitchClasses, SwitchProps } from "@/Components/Switch";
import type { TextareaClasses, TextareaProps } from "@/Components/Textarea";
import type { TextFieldClasses, TextFieldProps } from "@/Components/TextField";

declare module "@bridge-ui/core/Config" {
  interface AlertConfigOverrides {
    classes: AlertClasses;
    defaultProps: Partial<
      Pick<AlertProps, "color" | "shadow" | "padding" | "rounded" | "variant">
    >;
  }

  interface AutocompleteConfigOverrides {
    classes: AutocompleteClasses;
    defaultProps: Partial<
      Pick<
        AutocompleteProps,
        | "size"
        | "color"
        | "rounded"
        | "variant"
        | "showFooter"
        | "showErrorIcon"
        | "hideErrorMessage"
      >
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

  interface ButtonGroupConfigOverrides {
    classes: ButtonGroupClasses;
    defaultProps: Partial<
      Pick<ButtonGroupProps, "full" | "color" | "orientation">
    >;
  }

  interface ButtonGroupTextConfigOverrides {
    classes: ButtonGroupTextClasses;
    defaultProps: Partial<Pick<ButtonGroupTextProps, "as">>;
  }

  interface CardConfigOverrides {
    classes: CardClasses;
    defaultProps: Partial<
      Pick<CardProps, "shadow" | "padding" | "rounded" | "variant">
    >;
  }

  interface CheckboxConfigOverrides {
    classes: CheckboxClasses;
    defaultProps: Partial<
      Pick<CheckboxProps, "size" | "color" | "rounded" | "hideErrorMessage">
    >;
  }

  interface ChipConfigOverrides {
    classes: ChipClasses;
    defaultProps: Partial<Pick<ChipProps, "size">>;
  }

  interface DividerConfigOverrides {
    classes: DividerClasses;
    defaultProps: Partial<Pick<DividerProps, "color" | "orientation">>;
  }

  interface EmptyStateConfigOverrides {
    classes: EmptyStateClasses;
    defaultProps: Partial<
      Pick<EmptyStateProps, "size" | "align" | "titleAs" | "mediaDecorative">
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
    defaultProps: Partial<
      Pick<
        NumberFieldProps,
        | "size"
        | "color"
        | "rounded"
        | "variant"
        | "showErrorIcon"
        | "controlVariant"
        | "hideErrorMessage"
      >
    >;
  }

  interface OtpFieldConfigOverrides {
    classes: OtpFieldClasses;
    defaultProps: Partial<
      Pick<
        OtpFieldProps,
        | "size"
        | "type"
        | "color"
        | "length"
        | "rounded"
        | "variant"
        | "hideErrorMessage"
      >
    >;
  }

  interface PasswordFieldConfigOverrides {
    classes: PasswordFieldClasses;
    defaultProps: Partial<
      Pick<
        PasswordFieldProps,
        | "size"
        | "color"
        | "rounded"
        | "variant"
        | "showErrorIcon"
        | "hideErrorMessage"
      >
    >;
  }

  interface ProgressConfigOverrides {
    classes: ProgressClasses;
    defaultProps: Partial<
      Pick<ProgressProps, "size" | "color" | "rounded" | "variant">
    >;
  }

  interface RadioConfigOverrides {
    classes: RadioClasses;
    defaultProps: Partial<
      Pick<RadioProps, "size" | "color" | "rounded" | "hideErrorMessage">
    >;
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
      Pick<
        SelectProps,
        | "size"
        | "color"
        | "rounded"
        | "variant"
        | "showFooter"
        | "showErrorIcon"
        | "hideErrorMessage"
      >
    >;
  }

  interface SidebarConfigOverrides {
    classes: SidebarClasses & SidebarInsetClasses & SidebarProviderClasses;
    defaultProps: Partial<
      Pick<SidebarProps, "side" | "variant" | "ariaLabel" | "collapsible"> &
        Pick<SidebarProviderProps, "open" | "defaultOpen">
    >;
  }

  interface SkeletonConfigOverrides {
    classes: SkeletonClasses;
    defaultProps: Partial<Pick<SkeletonProps, "rounded">>;
  }

  interface SliderConfigOverrides {
    classes: SliderClasses;
    defaultProps: Partial<
      Pick<
        SliderProps,
        | "max"
        | "min"
        | "size"
        | "step"
        | "color"
        | "rounded"
        | "showStops"
        | "showTooltip"
        | "hideErrorMessage"
      >
    >;
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
    defaultProps: Partial<
      Pick<SwitchProps, "size" | "color" | "rounded" | "hideErrorMessage">
    >;
  }

  interface TextareaConfigOverrides {
    classes: TextareaClasses;
    defaultProps: Partial<
      Pick<
        TextareaProps,
        | "size"
        | "color"
        | "resize"
        | "rounded"
        | "variant"
        | "autosize"
        | "showErrorIcon"
        | "hideErrorMessage"
      >
    >;
  }

  interface TextFieldConfigOverrides {
    classes: TextFieldClasses;
    defaultProps: Partial<
      Pick<
        TextFieldProps,
        | "size"
        | "color"
        | "rounded"
        | "variant"
        | "showErrorIcon"
        | "hideErrorMessage"
      >
    >;
  }
}
