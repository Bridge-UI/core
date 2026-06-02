// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type {
  CheckboxColor,
  CheckboxRounded,
  CheckboxSize,
  MergeProps,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  SwitcherClasses,
  SwitcherOwnProps,
  SwitcherPartsProps,
  SwitcherSlots,
} from "@/Components/Switcher/switcher.types";

export interface CheckboxSizeOverrides {}
export interface CheckboxColorOverrides {}
export interface CheckboxRoundedOverrides {}

export interface CheckboxClasses extends SwitcherClasses {
  control?: string;
  icon?: string;
  input?: string;
}

export interface CheckboxPartsProps extends SwitcherPartsProps {
  control?: InputHTMLAttributes;
  icon?: InputHTMLAttributes;
  input?: Partial<InputHTMLAttributes>;
}

export interface CheckboxSlots extends SwitcherSlots {}

export interface CheckboxOwnProps extends Omit<
  SwitcherOwnProps,
  "field" | "classes" | "partsProps"
> {
  classes?: CheckboxClasses;
  color?: MergeProps<CheckboxColor, CheckboxColorOverrides>;
  indeterminate?: boolean;
  partsProps?: CheckboxPartsProps;
  rounded?: MergeProps<CheckboxRounded, CheckboxRoundedOverrides>;
  size?: MergeProps<CheckboxSize, CheckboxSizeOverrides>;
}

export type CheckboxProps = CheckboxOwnProps;
