// ** External Imports
import type { LucideIcon } from "lucide-vue-next";
import type { SVGAttributes } from "vue";

// ** Core Imports
import type { IconSize, MergeHtmlProps, MergeProps } from "@bridge-ui/core";

export interface IconSizeOverrides {}

export interface IconOwnProps {
  /**
   * Extra classes merged with size classes from the registry.
   *
   * @default undefined
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
}

export type IconProps = MergeHtmlProps<IconOwnProps, SVGAttributes>;
