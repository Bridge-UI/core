// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type { MergeProps, RadioColor, RadioSize } from "@bridge-ui/core";

// ** Local Imports
import type {
  SwitcherClasses,
  SwitcherOwnProps,
  SwitcherPartsProps,
  SwitcherSlots,
} from "@/Components/Switcher/switcher.types";

export interface RadioSizeOverrides {}
export interface RadioColorOverrides {}

export interface RadioClasses extends SwitcherClasses {
  control?: string;
  dot?: string;
  input?: string;
}

export interface RadioPartsProps extends SwitcherPartsProps {
  control?: InputHTMLAttributes;
  dot?: InputHTMLAttributes;
  input?: Partial<InputHTMLAttributes>;
}

export interface RadioSlots extends SwitcherSlots {}

export interface RadioOwnProps extends Omit<
  SwitcherOwnProps,
  "field" | "classes" | "partsProps"
> {
  classes?: RadioClasses;
  color?: MergeProps<RadioColor, RadioColorOverrides>;
  name?: string;
  partsProps?: RadioPartsProps;
  size?: MergeProps<RadioSize, RadioSizeOverrides>;
  value?: string | number;
}

export type RadioProps = RadioOwnProps;
