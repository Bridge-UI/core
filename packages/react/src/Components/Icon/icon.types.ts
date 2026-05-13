// ** External Imports
import type { LucideIcon } from "lucide-react";

// ** Core Imports
import type { IconSize, MergeProps } from "@bridge-ui/core";

export interface IconSizeOverrides {}

export type IconProps = {
  /**
   * The classes to apply to the icon.
   */
  className?: string;

  /**
   * Lucide icon component.
   */
  icon: LucideIcon;

  /**
   * The size of the icon.
   *
   * @default "md"
   */
  size?: MergeProps<IconSize, IconSizeOverrides>;
};
