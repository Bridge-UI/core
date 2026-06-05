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
  portal?: string;
  progress?: string;
  right?: string;
  root?: string;
  title?: string;
}

export interface SnackbarEmits {
  close: [];
}

export interface SnackbarPartsProps {
  description?: HTMLAttributes;
  icon?: Partial<Omit<IconProps, "icon">>;
  portal?: HTMLAttributes;
  progress?: HTMLAttributes;
  root?: HTMLAttributes;
  title?: HTMLAttributes;
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
  onShowChange?: (show: boolean) => void;
  partsProps?: SnackbarPartsProps;
  position?: MergeProps<SnackbarPosition, SnackbarPositionOverrides>;
  progressbar?: boolean;
  stackId?: string;
  teleportTo?: string | false;
  title?: string;
  transition?: MergeProps<SnackbarTransition, SnackbarTransitionOverrides>;
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
