// ** External Imports
import type { LucideIcon } from "lucide-vue-next";
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  SnackbarColor,
  SnackbarPosition,
  SnackbarTransition,
} from "@bridge-ui/core";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

export interface SnackbarColorOverrides {}
export interface SnackbarPositionOverrides {}
export interface SnackbarTransitionOverrides {}

export interface SnackbarClasses {
  actions?: string;
  description?: string;
  icon?: string;
  progress?: string;
  right?: string;
  portal?: string;
  root?: string;
  title?: string;
}

export interface SnackbarEmits {
  close: [];
}

export interface SnackbarPartsProps {
  icon?: Partial<Omit<IconProps, "icon">>;
  portal?: HTMLAttributes;
  root?: HTMLAttributes;
  title?: HTMLAttributes;
  description?: HTMLAttributes;
  progress?: HTMLAttributes;
}

export interface SnackbarOwnProps {
  classes?: SnackbarClasses;
  closeButton?: boolean;
  color?: MergeProps<SnackbarColor, SnackbarColorOverrides>;
  dense?: boolean;
  description?: string;
  duration?: number | false;
  icon?: LucideIcon | null;
  img?: string;
  partsProps?: SnackbarPartsProps;
  progressbar?: boolean;
  position?: MergeProps<SnackbarPosition, SnackbarPositionOverrides>;
  stackId?: string;
  teleportTo?: string | false;
  title?: string;
  transition?: MergeProps<SnackbarTransition, SnackbarTransitionOverrides>;
  onShowChange?: (show: boolean) => void;
}

export interface SnackbarSlots {
  actions?: Slot;
  default?: Slot;
  description?: Slot;
  icon?: Slot;
  right?: Slot;
  title?: Slot;
  trailing?: Slot;
}

export type SnackbarProps = MergeHtmlProps<SnackbarOwnProps, HTMLAttributes>;
