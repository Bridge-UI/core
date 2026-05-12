// ** External Imports
import type { LucideIcon } from "lucide-vue-next";

// ** Local Imports
import type { IconSize } from "@/Components/Icon/props/Size";
import type { MergeProps } from "@/Utils";

export interface IconSizeOverrides {}

export type IconProps = {
  /**
   * The classes to apply to the icon.
   */
  class?: string;

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
