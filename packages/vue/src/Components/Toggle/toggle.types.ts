// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeProps, ToggleColor, ToggleSize } from "@bridge-ui/core";

// ** Local Imports
import type {
  SwitcherClasses,
  SwitcherOwnProps,
  SwitcherPartsProps,
  SwitcherSlots,
} from "@/Components/Switcher/switcher.types";

export interface ToggleSizeOverrides {}
export interface ToggleColorOverrides {}

export interface ToggleClasses extends SwitcherClasses {
  input?: string;
  thumb?: string;
  track?: string;
}

export interface TogglePartsProps extends SwitcherPartsProps {
  input?: Partial<InputHTMLAttributes>;
  thumb?: InputHTMLAttributes;
  track?: InputHTMLAttributes;
}

export interface ToggleSlots extends SwitcherSlots {}

export interface ToggleOwnProps extends Omit<
  SwitcherOwnProps,
  "field" | "classes" | "partsProps"
> {
  classes?: ToggleClasses;
  color?: MergeProps<ToggleColor, ToggleColorOverrides>;
  partsProps?: TogglePartsProps;
  size?: MergeProps<ToggleSize, ToggleSizeOverrides>;
}

export type ToggleProps = ToggleOwnProps;
